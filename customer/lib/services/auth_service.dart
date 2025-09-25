import 'dart:convert';
import 'package:customer/models/common.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String baseUrl = "${Common.domain}/api/Auth";

  // Register -> trả về { success: bool, message: String }
  Future<Map<String, dynamic>> register({
    required String email,
    required String username,
    required String password,
  }) async {
    final url = Uri.parse("$baseUrl/register");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "username": username,
          "password": password,
        }),
      ).timeout(const Duration(seconds: 10));

      print("Register status: ${response.statusCode}");
      print("Register body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {"success": true, "message": data["message"] ?? "Đăng ký thành công"};
      } else {
        final data = jsonDecode(response.body);
        String msg = "Đăng ký thất bại";
        if (data is Map) {
          if (data["errors"] != null) {
            if (data["errors"] is List && data["errors"].isNotEmpty) msg = data["errors"][0].toString();
            else msg = data["errors"].toString();
          } else if (data["message"] != null) msg = data["message"].toString();
        }
        return {"success": false, "message": msg};
      }
    } catch (e) {
      print("Register error: $e");
      return {"success": false, "message": "Không kết nối được server"};
    }
  }

  // Login -> trả về { success: bool, message: String, token: String? }
  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse("$baseUrl/login");
    try {
      print("Call Login API: $url");
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      ).timeout(const Duration(seconds: 10));

      print("Login status: ${response.statusCode}");
      print("Login body: ${response.body}");

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // SUPPORT: token có thể là 'token' hoặc 'accessToken' tuỳ backend
        final token = (data['token'] ?? data['accessToken'] ?? '') as String;
        final refreshToken = (data['refreshToken'] ?? data['refresh_token'] ?? '') as String;

        // Lưu token nếu có
        try {
          final prefs = await SharedPreferences.getInstance();
          if (token.isNotEmpty) await prefs.setString('token', token);
          if (refreshToken.isNotEmpty) await prefs.setString('refreshToken', refreshToken);
          print("Token saved: $token");
        } catch (e) {
          print("Lưu token lỗi: $e");
        }

        return {"success": true, "message": "Đăng nhập thành công", "token": token};
      } else {
        // parse lỗi từ API
        try {
          final data = jsonDecode(response.body);
          String msg = "Đăng nhập thất bại";
          if (data is Map) {
            if (data["message"] != null) msg = data["message"].toString();
            else if (data["errors"] != null) {
              if (data["errors"] is List && data["errors"].isNotEmpty) msg = data["errors"][0].toString();
              else msg = data["errors"].toString();
            }
          }
          return {"success": false, "message": msg};
        } catch (e) {
          return {"success": false, "message": "Lỗi server (${response.statusCode})"};
        }
      }
    } catch (e) {
      print("Login exception: $e");
      return {"success": false, "message": "Không kết nối được server"};
    }
  }

  // Logout client-only: xóa token local
  Future<bool> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      print("Logout - current token: $token");
      if (token != null && token.isNotEmpty) {
        await prefs.remove('token');
        await prefs.remove('refreshToken');
        print("Token removed");
        return true;
      } else {
        print("No token found to remove");
        return false;
      }
    } catch (e) {
      print("Logout error: $e");
      return false;
    }
  }

  // Get token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
