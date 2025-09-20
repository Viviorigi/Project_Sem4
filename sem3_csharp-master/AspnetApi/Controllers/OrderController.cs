using AspnetApi.Common;
using AspnetApi.Data;
using AspnetApi.Dtos.Order;
using AspnetApi.Dtos.Order.Request;
using AspnetApi.Dtos.Order.Response;
using AspnetApi.Models;
using JwtToken.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspnetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApiDbContext _context;

        private readonly ICommonService<Order> _commonService;

        public OrderController(ApiDbContext context, ICommonService<Order> commonService)
        {
            _context = context;
            _commonService = commonService;
        }

        // Create a new order
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            // Fetch the cart for the user
            var cart = await _context.Carts
                .Include(c => c.CartItems) // Ensure cart items are loaded
                .FirstOrDefaultAsync(c => c.UserId.Equals(order.UserId));

            if (cart == null)
            {
                return NotFound(new { message = "Cart not found for the user." });
            }

            // Retrieve cart items
            var cartItems = cart.CartItems.ToList();

            if (cartItems.Count == 0)
            {
                return new JsonResult("No products in the cart.");
            }

            // Add the order
            _context.Order.Add(order);
            await _context.SaveChangesAsync(); // Save changes to generate order Id

            // Create OrderItems from CartItems
            var orderItems = cartItems.Select(item => new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList();

            // Add OrderItems to the database
            await _context.OrderItems.AddRangeAsync(orderItems);
            await _context.SaveChangesAsync();

            // Remove cart items for the user
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // Remove an order
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveOrder(int id)
        {
            var order = await _context.Order.FindAsync(id);
            if (order == null) return NotFound();

            _context.Order.Remove(order);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Change order status
        [HttpPut("change-status/{id}")]
        public async Task<IActionResult> ChangeStatus(int id, [FromBody] OrderChangeStatusRequest orderChange)
        {
            var order = await _context.Order.FindAsync(id);
            if (order == null) return NotFound();

            var newStatus = orderChange.NewStatus?.Trim();
            if (string.IsNullOrWhiteSpace(newStatus))
                return BadRequest("newStatus is required.");

            if (!IsValidStatusTransition(order.Status, newStatus))
                return BadRequest("Lỗi chuyển đổi trạng thái !");

            // Lưu dưới dạng chuẩn PascalCase theo enum (đẹp & đồng bộ)
            if (!Enum.TryParse<OrderStatus>(newStatus, true, out var statusEnum))
                return BadRequest("Trạng thái không hợp lệ.");

            order.Status = statusEnum.ToString(); // "Pending", "Ordered", ...
            _context.Order.Update(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }


        // Get orders by user ID
        [HttpGet("user-orders/{userId}")]
        public async Task<IActionResult> GetUserOrders(string userId)
        {
            //var orders = await _context.Order.Where(o => o.UserId == userId).Include(o=>o.Account).Include(o=>o.OrderItems).ThenInclude(p=>p.Product).ToListAsync();
            var orders = await _context.Order
            .Where(o => o.UserId == userId)
            .Include(o => o.Account)
            .Include(o => o.OrderItems)
                .ThenInclude(p => p.Product)
            .OrderByDescending(o => o.Id) // Sorting by Id in descending order
            .ToListAsync();
            // Project the data to include computed fields
            var orderResponses = orders.Select(order => new OrderDetailResponse
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                UserName = order.Account.UserName,
                Email = order.Account.Email,
                OrderItems = order.OrderItems.Select(orderItem => new OrderItemDetail
                {
                    ProductName = orderItem.Product.ProductName,
                    Quantity = orderItem.Quantity,
                    Price = orderItem.Price
                }).ToList(),
                TotalPrice = order.OrderItems.Sum(item => item.Quantity * item.Price) // Computed field
            }).ToList();

            return Ok(orderResponses);
        }

        //getAll order at admin area
        //note check again
        [HttpPost("search")]
        public async Task<IActionResult> Get([FromBody] QueryParams queryParams)
        {
            var query = _context.Order
                .AsNoTracking()
                .Include(o => o.Account)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .AsQueryable();

            // Lọc theo Status
            if (!string.IsNullOrWhiteSpace(queryParams.Status))
            {
                query = query.Where(o => o.Status == queryParams.Status);
            }

            // Lọc theo Keyword
            if (!string.IsNullOrWhiteSpace(queryParams.Keyword))
            {
                var kw = queryParams.Keyword.Trim();
                query = query.Where(o =>
                    (o.Account.UserName != null && o.Account.UserName.Contains(kw)) ||
                    (o.Account.Email != null && o.Account.Email.Contains(kw)) ||
                    (o.ShippingAddress != null && o.ShippingAddress.Contains(kw)) ||
                    o.OrderItems.Any(oi => oi.Product.ProductName.Contains(kw))
                );
            }

            // Lọc theo ngày (nếu bạn có field StartDate, EndDate trong QueryParams thì parse như ví dụ trước)
            // ...

            // Mặc định sort theo OrderDate DESC
            query = query.OrderByDescending(o => o.OrderDate);

            // Paging 1-based
            var page = Math.Max(1, queryParams.PageNumber);
            var size = Math.Max(1, queryParams.PageSize);
            var totalRecords = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * size)
                .Take(size)
                .Select(order => new OrderDetailResponse
                {
                    OrderId = order.Id,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    ShippingAddress = order.ShippingAddress,
                    UserName = order.Account.UserName,
                    Email = order.Account.Email,
                    OrderItems = order.OrderItems.Select(item => new OrderItemDetail
                    {
                        ProductName = item.Product.ProductName,
                        Quantity = item.Quantity,
                        Price = item.Price
                    }).ToList(),
                    TotalPrice = order.OrderItems.Sum(oi => oi.Quantity * oi.Price)
                })
                .ToListAsync();

            var response = new PageResponseOrder(page, size, totalRecords, items);
            return Ok(response);
        }


        //detail order get information of the account and product totalPrice
        [HttpGet("detail/{orderId}")]
        public async Task<IActionResult> GetOrderDetail(int orderId)
        {
            // Retrieve the order along with related entities
            var order = await _context.Order
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Account)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            // Return 404 if the order does not exist
            if (order == null) return NotFound(new { message = "Order not found" });

            // Create the response model
            var orderDetailResponse = new OrderDetailResponse
            {
                OrderId = order.Id,
                UserName = order.Account?.UserName ?? "Unknown",
                Email = order.Account?.Email ?? "Unknown",
                Phone = order.Account.PhoneNumber,
                Gender = order.Account.Gender,
                Avatar = order.Account.Avatar,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetail
                {
                    ProductName = oi.Product?.ProductName ?? "Unknown Product",
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList(),
                TotalPrice = order.OrderItems.Sum(oi => oi.Quantity * oi.Price)
            };

            // Return the response
            return Ok(orderDetailResponse);
        }

        private static bool IsValidStatusTransition(string currentStatus, string newStatus)
        {
            // Chuẩn hóa, bỏ phân biệt hoa/thường
            bool TryParse(string s, out OrderStatus e) =>
                Enum.TryParse(s, true, out e);

            if (!TryParse(currentStatus, out var cur) || !TryParse(newStatus, out var next))
                return false;

            return cur switch
            {
                OrderStatus.Pending => next is OrderStatus.Ordered or OrderStatus.Cancelled,
                OrderStatus.Ordered => next is OrderStatus.Shipping or OrderStatus.Cancelled,
                OrderStatus.Shipping => next is OrderStatus.Completed,
                OrderStatus.Completed => false,     // đã hoàn tất, không đổi
                OrderStatus.Cancelled => false,     // đã hủy, không đổi
                _ => false
            };
        }
    }
}
