import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token'); // key bạn dùng để lưu token sau login
  }
}
