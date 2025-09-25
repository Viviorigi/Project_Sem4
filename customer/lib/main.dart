import 'package:customer/screens/home_screen.dart';
import 'package:customer/screens/login_screen.dart';
import 'package:customer/services/auth_service.dart';
import 'package:flutter/material.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final authService = AuthService();
  final loggedIn = await authService.isLoggedIn();

  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: const LoginScreen(),
  ));
}
