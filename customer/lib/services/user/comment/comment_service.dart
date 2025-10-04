// lib/services/user/comment/comment_service.dart
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:ecommerce_sem4/utils/http_utils.dart';
import 'package:http/http.dart' as http;

class CommentPostService {
  Future<String?> createComment(
      String uri,
      Map<String, String> headers,
      Object request,
      ) async {
    try {
      final http.Response res = await HttpUtils().post(uri, headers, request);

      // HTTP 2xx coi như thành công
      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = res.body.trim();
        if (body.isEmpty || body.toLowerCase() == 'null') {
          return 'ok'; // body rỗng vẫn coi thành công
        }

        // Thử parse JSON
        try {
          final decoded = jsonDecode(body);
          if (decoded is Map<String, dynamic>) {
            // Lấy message nếu có, fallback 'ok'
            final msg = decoded['message']?.toString();
            return (msg != null && msg.isNotEmpty) ? msg : 'ok';
          }
          // Nếu là list hoặc kiểu khác nhưng không rỗng
          return 'ok';
        } catch (_) {
          // body là chuỗi thường (non-JSON) → trả luôn chuỗi
          return body;
        }
      }

      debugPrint('Request failed: ${res.statusCode} - ${res.body}');
      return null;
    } catch (e) {
      debugPrint('Error occurred: $e');
      return null;
    }
  }
}
