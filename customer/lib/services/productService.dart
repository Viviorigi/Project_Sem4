// import 'dart:convert';
// import 'package:customer/models/common.dart';
// import 'package:customer/models/product.dart';
// import 'package:http/http.dart' as http;
//
// class SearchProductFilter {
//   final int page;
//   final int pageSize;
//   final String search;
//   // Thêm các trường khác nếu cần
//
//   SearchProductFilter({
//     this.page = 1,
//     this.pageSize = 10,
//     this.search = "",
//   });
//
//   Map<String, dynamic> toJson() {
//     return {
//       "page": page,
//       "pageSize": pageSize,
//       "search": search,
//       // Đảm bảo các key trùng với C# DTO
//     };
//   }
// }
//
// class ProductService {
//   // Thay thế bằng URL API gốc của bạn
//   final String baseUrl = "${Common.domain}/api/Product";
//
//   // payload: { "page": 1, "pageSize": 10, "searchTerm": "..." }
//   Future<Map<String, dynamic>> searchProducts(Map<String, dynamic> payload) async {
//     final url = Uri.parse('$baseUrl/search');
//     final response = await http.post(
//       url,
//       headers: {'Content-Type': 'application/json'},
//       body: json.encode(payload),
//     );
//
//     if (response.statusCode == 200) {
//       final data = json.decode(response.body);
//       return data;
//     } else {
//       throw Exception('Failed to search products');
//     }
//   }
//
//   Future<Map<String, dynamic>> getProductsPaginated({
//     int page = 1,
//     String keyword = '',
//   }) async {
//     final queryParams = {
//       'page': '$page',
//       'per_page': '5',
//     };
//     if (keyword.isNotEmpty) {
//       queryParams['search'] = keyword;
//     }
//
//     final uri = Uri.http('10.0.2.2:8000', '/api/products', queryParams); // chú ý URL
//     final response = await http.get(uri);
//
//     if (response.statusCode == 200) {
//       final jsonData = json.decode(response.body);
//       final List productsJson = jsonData['data'];
//
//       return {
//         'products': productsJson.map((e) => Product.fromJson(e)).toList(),
//         'currentPage': jsonData['current_page'],
//         'lastPage': jsonData['last_page'],
//       };
//     } else {
//       throw Exception('Lỗi khi lấy sản phẩm phân trang');
//     }
//   }
//
// }