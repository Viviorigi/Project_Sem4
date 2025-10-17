using AspnetApi.Common;
using AspnetApi.Data;
using AspnetApi.Dtos.Order;
using AspnetApi.Dtos.Order.Request;
using AspnetApi.Dtos.Order.Response;
using AspnetApi.Models;
using AspnetApi.Services.Email;
using JwtToken.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace AspnetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private readonly ICommonService<Order> _commonService;
        private readonly IEmailSender _emailSender;

        public OrderController(ApiDbContext context, ICommonService<Order> commonService, IEmailSender emailSender)
        {
            _context = context;
            _commonService = commonService;
            _emailSender = emailSender;
        }

        // Create a new order
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            // Lấy giỏ hàng của user
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == order.UserId);

            if (cart == null)
                return NotFound(new { message = "Cart not found for the user." });

            var cartItems = cart.CartItems?.ToList() ?? new List<CartItem>();
            if (cartItems.Count == 0)
                return BadRequest(new { message = "No products in the cart." });

            // Lưu Order (để có Order.Id)
            _context.Order.Add(order);
            await _context.SaveChangesAsync();

            // Tạo OrderItems từ CartItems
            var orderItems = cartItems.Select(item => new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList();

            await _context.OrderItems.AddRangeAsync(orderItems);
            await _context.SaveChangesAsync();

            // Xóa giỏ hàng
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            // Lấy thông tin user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == order.UserId);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            // JOIN để lấy tên sản phẩm hiển thị
            var productLookup = await _context.Products
                .Where(p => orderItems.Select(oi => oi.ProductId).Contains(p.Id))
                .Select(p => new { p.Id, p.ProductName })
                .ToListAsync();

            var details = (from oi in orderItems
                           join p in productLookup on oi.ProductId equals p.Id
                           select new
                           {
                               Name = p.ProductName,
                               oi.Quantity,
                               oi.Price,
                               Subtotal = oi.Price * oi.Quantity
                           }).ToList();

            // Tính tổng
            float subtotal = details.Sum(x => x.Subtotal);  
            float grandTotal = subtotal ;

            // Định dạng tiền tệ VN
            var vi = new CultureInfo("vi-VN");
            string Money(float v) => string.Format(vi, "{0:c0}", v);

            // Chuẩn bị HTML email
            var sb = new StringBuilder($@"
                    <!DOCTYPE html>
                    <html lang='vi'>
                    <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <style>
                      body {{
                        font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                        background:#f6f8fb; color:#333; margin:0; padding:16px;
                      }}
                      .wrap {{
                        max-width:600px; margin:0 auto; background:#fff; border-radius:12px;
                        box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;
                      }}
                      .header {{
                        background:linear-gradient(120deg,#0d6efd,#6610f2);
                        color:#fff; text-align:center; padding:18px 14px;
                      }}
                      .header h1 {{ font-size:20px; margin:0; }}
                      .section {{ padding:18px 18px 6px 18px; }}
                      .muted {{ color:#666; font-size:14px; }}
                      .table {{
                        width:100%; border-collapse:collapse; margin-top:8px; font-size:14px;
                      }}
                      .table th, .table td {{
                        border-bottom:1px solid #eee; padding:10px 8px; text-align:left;
                      }}
                      .table th {{ background:#fafafa; font-weight:600; }}
                      .right {{ text-align:right; }}
                      .total-row td {{ font-weight:700; }}
                      .footer {{
                        border-top:1px solid #eee; text-align:center; padding:12px; font-size:12px; color:#777;
                      }}
                      @media (max-width: 480px) {{
                        .table th, .table td {{ padding:8px 6px; }}
                      }}
                    </style>
                    </head>
                    <body>
                      <div class='wrap'>
                        <div class='header'>
                          <h1>✅ Xác nhận đặt hàng thành công</h1>
                        </div>

                        <div class='section'>
                          <p>Xin chào {(user.Email ?? user.UserName)},</p>
                          <p>Cảm ơn bạn đã đặt hàng tại <strong>PhoneStore</strong>.</p>
                          <p class='muted'>
                            Mã đơn: <strong>#{order.Id:000000}</strong><br/>
                            Ngày đặt: {DateTime.Now.ToString("dd/MM/yyyy HH:mm", vi)}
                          </p>

                          <table class='table'>
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th class='right'>SL</th>
                                <th class='right'>Đơn giá</th>
                                <th class='right'>Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody>");

                                foreach (var d in details)
                                {
                                    sb.Append($@"
                              <tr>
                                <td>{System.Net.WebUtility.HtmlEncode(d.Name)}</td>
                                <td class='right'>{d.Quantity}</td>
                                <td class='right'>{Money(d.Price)}</td>
                                <td class='right'>{Money(d.Subtotal)}</td>
                              </tr>");
                                }

                                sb.Append($@"
                              <tr>
                                <td colspan='3' class='right'>Tạm tính</td>
                                <td class='right'>{Money(subtotal)}</td>
                              </tr>
                              <tr class='total-row'>
                                <td colspan='3' class='right'>Tổng cộng</td>
                                <td class='right'>{Money(grandTotal)}</td>
                              </tr>
                            </tbody>
                          </table>

                          <p class='muted' style='margin-top:12px'>
                            Lưu ý: Bộ phận chăm sóc khách hàng sẽ liên hệ để xác nhận và sắp xếp giao hàng sớm nhất.
                          </p>
                        </div>

                        <div class='footer'>
                          © {DateTime.Now:yyyy} PhoneStore — Cảm ơn bạn đã tin tưởng chúng tôi.
                        </div>
                      </div>
                    </body>
                    </html>");

            var subject = $"Xác nhận đơn hàng #{order.Id:000000}";
            var htmlMessage = sb.ToString();

            await _emailSender.SendEmailAsync(user.Email, subject, htmlMessage);

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
