// import 'dart:convert';
// import 'package:customer/models/category.dart';
// import 'package:customer/models/common.dart';
// import 'package:http/http.dart' as http;
//
//
// class CategoryService {
//   final String baseUrl = "${Common.domain}/api/Category";
//
//   Future<List<Category>> getAllCategories() async {
//     final url = Uri.parse('$baseUrl/all');
//     print('Fetching categories from: $url'); // Debug: Log URL
//     try {
//       final response = await http.get(url);
//       print('Response status: ${response.statusCode}'); // Debug: Log status
//       print('Response body: ${response.body}'); // Debug: Log raw response
//
//       if (response.statusCode == 200) {
//         final List<dynamic> data = json.decode(response.body);
//         print('Parsed data: $data'); // Debug: Log parsed data
//         return data.map((json) => Category.fromJson(json)).toList();
//       } else {
//         throw Exception('Failed to load categories: ${response.statusCode}');
//       }
//     } catch (e) {
//       print('Error fetching categories: $e'); // Debug: Log error
//       throw Exception('Failed to load categories: $e');
//     }
//   }
// }