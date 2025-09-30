import 'dart:convert';
import 'package:customer/models/utils/authStorage.dart';
import 'package:customer/models/utils/common.dart';
import 'package:http/http.dart' as http;


class ProductService {
  final String baseUrl = "${Common.domain}/api/product";

  Future<Map<String, dynamic>> search({
    int pageNumber = 1,
    int pageSize = 10,
  }) async {
    final url = Uri.parse("$baseUrl/search");
    final token = await AuthStorage.getToken();

    final headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      if (token != null && token.isNotEmpty) "Authorization": "Bearer $token",
    };

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: jsonEncode({
          "pageNumber": pageNumber,
          "pageSize": pageSize,
        }),
      ).timeout(const Duration(seconds: 10));

      print("Product status: ${response.statusCode}");
      print("Product body: ${response.body}");

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return { "success": true, "data": json["data"] ?? [] };
      } else {
        return {
          "success": false,
          "message": "Lỗi lấy product: ${response.statusCode}"
        };
      }
    } catch (e) {
      print("Product error: $e");
      return { "success": false, "message": "Không kết nối được server" };
    }
  }
}
