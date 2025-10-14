using AspnetApi.Constants;
using AspnetApi.Data;
using AspnetApi.Dtos.Account;
using AspnetApi.Dtos.Comment;
using AspnetApi.Dtos.Post;
using AspnetApi.Dtos.Product;
using AspnetApi.Dtos.RequestApprove;
using AspnetApi.Models;
using JwtToken.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Reflection.Metadata;


namespace AspnetApi.Common
{
    public class CommonService<T> : ICommonService<T> where T : class
    {
        private readonly ApiDbContext _context;
        private readonly DbSet<T> _dbSet;

        public CommonService(ApiDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<PagedResponse<T>> GetPagedDataAsync(QueryParams queryParams, string[] filterBy, Func<IQueryable<T>, IQueryable<T>> includeFunc = null)
        {
            var query = await GetQuery(queryParams, filterBy);

            // Get total records
            var totalRecords = await query.CountAsync();

            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            // Apply pagination
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            // Create and return paginated response
            return new PagedResponse<T>(items, totalRecords, queryParams.PageNumber, queryParams.PageSize);
        }

        public  async Task<string> UploadFile(IFormFile? uploadFile)
        {
            var uniqueFileName = "";
            if (uploadFile != null && uploadFile.Length > 0)
            {
                uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadFile.FileName);
                var filePath = Path.Combine(Constants.Constants.ROOT_IMAGE, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadFile.CopyToAsync(stream);
                }

            }
            else
            {
                return null;
            }
            return uniqueFileName;
        }

        public async Task<List<string>> UploadFiles(List<IFormFile> files)
        {
            var savedFileNames = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Generate a unique file name to avoid collisions
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(Constants.Constants.ROOT_IMAGE, uniqueFileName);

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    savedFileNames.Add(uniqueFileName);
                }
            }

            return savedFileNames;
        }

        private static IQueryable<T> ApplyFilter(IQueryable<T> query, string[] propertyNames, string keyword)
        {
            if (propertyNames.Length <= 0 || string.IsNullOrEmpty(keyword))
            {
                return query;
            }

            var parameter = Expression.Parameter(typeof(T), "item");


            var expressions = new List<Expression>();

            foreach (var propertyName in propertyNames)
            {
                var property = Expression.Property(parameter, propertyName);
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var searchValue = Expression.Constant(keyword, typeof(string));
                var propertyExpression = Expression.Call(property, containsMethod, searchValue);

                expressions.Add(propertyExpression);
            }

            // Combine all expressions with OR
            Expression combinedExpression = expressions
            .Aggregate<Expression>((left, right) => Expression.OrElse(left, right));

            var lambda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);

            return query.Where(lambda);
        }

        public async Task<PagedResponse<AccountDto>> SearchAccount(
            SearchAccountFilter queryParams, string[] filterBy)
        {
            // GetQuery phải trả IQueryable<Account> hoặc có thể Cast<Account>()
            var accounts = (await GetQuery(queryParams, filterBy)).Cast<Account>();

            // JOIN: Account -> AspNetUserRoles -> AspNetRoles
            var q =
                from a in accounts
                join ur in _context.UserRoles on a.Id equals ur.UserId
                join r in _context.Roles on ur.RoleId equals r.Id
                select new AccountDto
                {
                    Id = a.Id,
                    UserName = a.UserName,
                    NormalizedUserName = a.NormalizedUserName,
                    Email = a.Email,
                    NormalizedEmail = a.NormalizedEmail,
                    PhoneNumber = a.PhoneNumber,
                    Address = a.Address,
                    Gender = a.Gender,
                    Avatar = a.Avatar,
                    CreatedAt = a.CreatedAt,
                    RoleId = r.Id,
                    RoleName = r.Name
                };

            // (tuỳ chọn) lọc theo role nếu có truyền
            if (!string.IsNullOrWhiteSpace(queryParams.RoleId))
                q = q.Where(x => x.RoleId == queryParams.RoleId);

            // tổng + phân trang
            var total = await q.CountAsync();

            var items = await q
                .OrderByDescending(x => x.CreatedAt)                  // sắp xếp nếu cần
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .AsNoTracking()
                .ToListAsync();

            return new PagedResponse<AccountDto>(items, total, queryParams.PageNumber, queryParams.PageSize);
        }


        private async Task<IQueryable<T>> GetQuery(QueryParams queryParams, string[] filterBy)
        {
            var query = _dbSet.AsQueryable();

            // Apply filtering
            if (!string.IsNullOrEmpty(queryParams.Keyword))
            {
                query = ApplyFilter(query, filterBy, queryParams.Keyword);
            }

            if (!string.IsNullOrEmpty(queryParams.Status))
            {
                bool status = queryParams.Status.Equals("1");
                query = query.Where(item => EF.Property<bool>(item, "Active") == status);
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(queryParams.SortBy) && !string.IsNullOrEmpty(queryParams.SortDir))
            {
                query = SortHelper.ApplySorting(query, queryParams.SortBy, string.Equals(queryParams.SortDir, "asc", StringComparison.OrdinalIgnoreCase));
            }else
            {
                query = SortHelper.ApplySorting(query, "CreatedAt", string.Equals("desc", "asc", StringComparison.OrdinalIgnoreCase));
            }

            return query;
        }

        public async Task<PagedResponse<T>> SearchProduct(SearchProductFilter queryParams, string[] filterBy, Func<IQueryable<T>, IQueryable<T>> includeFunc = null)
        {
            var query = await GetQuery(queryParams, filterBy);


            // Apply filtering by categoryId
            if (!string.IsNullOrEmpty(queryParams.CategoryId))
            {
                query = query.Where(p => EF.Property<string>(p, "CategoryId") == queryParams.CategoryId);
            }

            if (queryParams.FromPrice.HasValue)
            {
                query = query.Where(p => EF.Property<decimal>(p, "Price") >= queryParams.FromPrice.Value);
            }

            if (queryParams.ToPrice.HasValue && queryParams.ToPrice.Value!=0)
            {
                query = query.Where(p => EF.Property<decimal>(p, "Price") <= queryParams.ToPrice.Value);
            }

            if (queryParams.OptionIds != null && queryParams.OptionIds.Any())
            {
                var accountQuery = query.Cast<Product>();

                accountQuery = accountQuery
                        .Join(_context.AttributeOptionProducts,
                            product => product.Id,
                            attributeOption => attributeOption.ProductId,
                            (product, attributeOption) => new { product, attributeOption }) 
                        .Where(combined => queryParams.OptionIds.Contains(combined.attributeOption.AttributeOptionId))  // Filter by OptionIds
                        .Select(combined => combined.product);


                query = accountQuery.Cast<T>();
            }

            // Get total records
            var totalRecords = await query.CountAsync();

            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            // Apply pagination
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            // Create and return paginated response
            return new PagedResponse<T>(items, totalRecords, queryParams.PageNumber, queryParams.PageSize);
        }

        public async Task<PagedResponse<T>> SearchPost(
     SearchPostFilter queryParams,
     string[] filterBy,
     Func<IQueryable<T>, IQueryable<T>> includeFunc = null)
        {
            // Base query từ GetQuery (giữ như bạn đang có)
            var query = await GetQuery(queryParams, filterBy);

            // Include (nếu có)
            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            // ----- Filter theo Category -----
            if (!string.IsNullOrWhiteSpace(queryParams.PostCategoryId)
                && int.TryParse(queryParams.PostCategoryId, out var catId)
                && catId > 0)
            {
                // PostCategoryId là int
                query = query.Where(p => EF.Property<int>(p, "PostCategoryId") == catId);
            }

            // ----- Filter theo IsPublish (map sang Status) -----
            if (!string.IsNullOrWhiteSpace(queryParams.IsPublish))
            {
                var v = queryParams.IsPublish.Trim().ToLowerInvariant();

                if (v == "true" || v == "1")
                {
                    // chỉ lấy Published
                    query = query.Where(p => EF.Property<string>(p, "Status") == "Published");
                }
                else if (v == "false" || v == "0")
                {
                    // chỉ lấy KHÔNG Published (Draft, Hidden, v.v…)
                    query = query.Where(p => EF.Property<string>(p, "Status") != "Published");
                }
            }


            // ----- Filter trực tiếp theo Status (hỗ trợ nhiều giá trị) -----
            // Ví dụ: "DRAFT,UNPUBLISH,PUBLISH"
            if (!string.IsNullOrWhiteSpace(queryParams.Status))
            {
                var statuses = queryParams.Status
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(s => s.ToUpperInvariant())
                    .ToArray();

                if (statuses.Length > 0)
                {
                    query = query.Where(p => statuses.Contains((EF.Property<string>(p, "Status") ?? "").ToUpper()));
                }
            }

            // ⛔️ BỎ DÒNG LOẠI DRAFT MẶC ĐỊNH
            // // query = query.Where(p => EF.Property<string>(p, "Status") != "DRAFT");

            // ----- Tổng bản ghi sau khi filter -----
            var totalRecords = await query.CountAsync();

            // ----- Sort (tuỳ bạn đã làm trong GetQuery; nếu cần có thể bổ sung ở đây) -----

            // ----- Paging an toàn -----
            var pageNumber = queryParams.PageNumber <= 0 ? 1 : queryParams.PageNumber;
            var pageSize = queryParams.PageSize <= 0 ? 10 : queryParams.PageSize;

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResponse<T>(items, totalRecords, pageNumber, pageSize);
        }


        public async Task<PagedResponse<T>> SearchRequestApprove(SearchRequestApproveFilter queryParams, string[] filterBy, Func<IQueryable<T>, IQueryable<T>> includeFunc = null)
        {
            var query = await GetQuery(queryParams, filterBy);

            query = query.Where(p => EF.Property<string>(p, "Status") == AspnetApi.Constants.Constants.REQUEST_APPROVAL["PENDING"]);


            if (queryParams.StartDate!=null&& queryParams.StartDate.HasValue)
            {
                query = query.Where(p => EF.Property<DateTime>(p, "CreatedAt") >= queryParams.StartDate);

            }

            if (queryParams.EndDate != null && queryParams.EndDate.HasValue)
            {
                query = query.Where(p => EF.Property<DateTime>(p, "CreatedAt") <= queryParams.EndDate);
            }


            // Get total records
            var totalRecords = await query.CountAsync();

            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            // Apply pagination
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            // Create and return paginated response
            return new PagedResponse<T>(items, totalRecords, queryParams.PageNumber, queryParams.PageSize);
        
        }

        public async Task<PagedResponse<T>> SearchComment(SearchCommentFilter queryParams, string[] filterBy, Func<IQueryable<T>, IQueryable<T>> includeFunc = null)
        {
            var query = await GetQuery(queryParams, filterBy);

            if (!string.IsNullOrEmpty(queryParams.IsActive))
            {
                var commentQuery = query.Cast<Comment>();

                commentQuery = commentQuery
                  .Join(_context.RequestApproves,
                        comment => comment.Id,
                        requestApprove => requestApprove.CommentId,
                        (comment, requestApprove) => new { comment, requestApprove })
                  .Where(cmt => cmt.requestApprove.Status == queryParams.IsActive)
                  .Select(cmt => cmt.comment);

                query = commentQuery.Cast<T>();

            }else
            {
                var commentQuery = query.Cast<Comment>();

                commentQuery = commentQuery
                  .Join(_context.RequestApproves,
                        comment => comment.Id,
                        requestApprove => requestApprove.CommentId,
                        (comment, requestApprove) => new { comment, requestApprove })
                  .Where(cmt => cmt.requestApprove.Status == AspnetApi.Constants.Constants.REQUEST_APPROVAL["APPROVE"])
                  .Select(cmt => cmt.comment);

                query = commentQuery.Cast<T>();
            }


            if (queryParams.StartDate != null && queryParams.StartDate.HasValue)
            {
                query = query.Where(p => EF.Property<DateTime>(p, "CreatedAt").Date >= queryParams.StartDate);

            }

            if (queryParams.EndDate != null && queryParams.EndDate.HasValue)
            {
                query = query.Where(p => EF.Property<DateTime>(p, "CreatedAt").Date <= queryParams.EndDate);
            }

            // Get total records
            var totalRecords = await query.CountAsync();

            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            // Apply pagination
            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            // Create and return paginated response
            return new PagedResponse<T>(items, totalRecords, queryParams.PageNumber, queryParams.PageSize);

        }
    }
}
