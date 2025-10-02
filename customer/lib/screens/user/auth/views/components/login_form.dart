import 'dart:convert';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:ecommerce_sem4/models/user/auth/request/login_request.dart';
import 'package:ecommerce_sem4/models/user/auth/response/account_infor.dart';
import 'package:ecommerce_sem4/route/user/router_constants.dart';
import 'package:ecommerce_sem4/screens/user/layout/views/layout_screen.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final String uri = loginUri;
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();

  bool _obscure = true;
  bool _loading = false;
  bool _rememberMe = false;

  String? _emailValidator(String? v) {
    if (v == null || v.trim().isEmpty) return 'Please enter your email';
    return null;
  }

  String? _passwordValidator(String? v) {
    if (v == null || v.isEmpty) return 'Please enter your password';
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    try {
      final body = LoginRequest(_email.text.trim(), _password.text).toMap();
      final res = await http.post(
        Uri.parse(uri),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: jsonEncode(body),
      );

      final data = jsonDecode(const Utf8Decoder().convert(res.bodyBytes));

      if (!mounted) return;
      if (data['token'] == null) {
        _showDialog('Login Failed', 'Email or password is not correct');
      } else {
        final jwt = JWT.decode(data['token']);
        final acc = AccountInfor.fromJson({
          "email": jwt.payload["email"],
          "sub": jwt.payload["sub"],
          "role": jwt.payload["role"],
          "accessToken": data['token'],
          "exp": jwt.payload["exp"],
          "id": jwt.payload["Id"],
        });

        final prefs = await SharedPreferences.getInstance();
        if (_rememberMe) prefs.setString("email", acc.email);
        prefs
          ..setString("sub", acc.sub)
          ..setString("role", acc.role)
          ..setString("accessToken", acc.accessToken)
          ..setString("id", acc.id)
          ..setInt("exp", acc.exp.microsecondsSinceEpoch);

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const LayoutScreen()),
        );
      }
    } catch (e) {
      if (mounted) _showDialog('Network Error', 'Please try again later.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showDialog(String title, String msg) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        content: Text(msg),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AbsorbPointer(
      absorbing: _loading,
      child: Opacity(
        opacity: _loading ? .7 : 1,
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Email
              ModernInputField(
                label: "Email",
                hint: "Enter your email",
                controller: _email,
                validator: _emailValidator,
              ),
              const SizedBox(height: 18),

              // Password
              ModernInputField(
                label: "Password",
                hint: "Enter your password",
                controller: _password,
                validator: _passwordValidator,
                obscure: _obscure,
                toggleObscure: () => setState(() => _obscure = !_obscure),
              ),

              const SizedBox(height: 12),

              // Remember me + Forgot
              Row(
                children: [
                  Checkbox(
                    value: _rememberMe,
                    onChanged: (v) => setState(() => _rememberMe = v ?? false),
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    visualDensity: VisualDensity.compact,
                    side: BorderSide(color: kStroke),
                    activeColor: kAccentDark,
                  ),
                  Text("Remember me", style: TextStyle(color: kMuted, fontSize: 13)),
                  const Spacer(),
                ],
              ),

              const SizedBox(height: 20),

              // CTA button
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kAccentDark,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  onPressed: _submit,
                  child: _loading
                      ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Sign In'),
                ),
              ),

              const SizedBox(height: 20),

              // Sign up link
              Center(
                child: RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: "Don’t have an account? ",
                        style: TextStyle(fontSize: 13, color: kMuted, fontFamily: 'Poppins'),
                      ),
                      TextSpan(
                        text: "Create one",
                        style: TextStyle(
                          fontSize: 13,
                          color: kAccentDark,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () => Navigator.pushNamed(context, signUpScreenRoute),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Input hiện đại đồng bộ với SignUp
class ModernInputField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final bool obscure;
  final VoidCallback? toggleObscure;

  const ModernInputField({
    super.key,
    required this.label,
    required this.hint,
    required this.controller,
    this.validator,
    this.obscure = false,
    this.toggleObscure,
  });

  @override
  Widget build(BuildContext context) {
    final suffix = toggleObscure != null
        ? IconButton(
      icon: Icon(obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: kMuted),
      onPressed: toggleObscure,
    )
        : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13.5,
              color: kInk,
            )),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: obscure,
          validator: validator,
          style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: kMuted, fontSize: 13.5),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            suffixIcon: suffix,
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: kStroke, width: 1),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: kAccentDark, width: 1.4),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: kDanger, width: 1),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: kDanger, width: 1.2),
            ),
          ),
        ),
      ],
    );
  }
}
