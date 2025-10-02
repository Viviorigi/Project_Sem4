import 'package:ecommerce_sem4/screens/user/auth/views/login_screen.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class OnBoardingScreen extends StatelessWidget {
  const OnBoardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;

    return SafeArea(
      child: Scaffold(
        backgroundColor: kCanvas,
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 28, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Logo + Brand
              Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset(
                      'assets/user/images/logo.jpg',
                      width: 120, height: 120, fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'PHONE',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: kInk,
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                      letterSpacing: .4,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Modern gadgets & accessories',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: kMuted,
                      fontSize: 15.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),
              _Hairline(color: kStroke),

              const SizedBox(height: 16),

              // Lưới tính năng 2x2
              Row(
                children: const [
                  Expanded(child: _FeatureTile(icon: Icons.workspace_premium_outlined, title: 'Premium devices')),
                  SizedBox(width: 12),
                  Expanded(child: _FeatureTile(icon: Icons.local_shipping_outlined,   title: 'Fast delivery')),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: const [
                  Expanded(child: _FeatureTile(icon: Icons.assignment_return_outlined, title: 'Easy returns')),
                  SizedBox(width: 12),
                  Expanded(child: _FeatureTile(icon: Icons.lock_outline,               title: 'Secure & safe')),
                ],
              ),

              const SizedBox(height: 28),

              // Headline phụ
              Text(
                'Welcome to our Store',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: kInk,
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Get your devices as fast as one hour',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: kMuted,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(height: 22),

              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                  },
                  style: TextButton.styleFrom(
                    backgroundColor: kAccentDark,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: BorderSide(color: kInk.withOpacity(.12), width: 1),
                    ),
                  ),
                  child: const Text(
                    'LOGIN',
                    style: TextStyle(
                      fontSize: 16.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: .3,
                    ),
                  ),
                ),
              ),

              // khoảng đệm cuối theo chiều rộng
              SizedBox(height: w * 0.06),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureTile extends StatelessWidget {
  final IconData icon;
  final String title;
  const _FeatureTile({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: kSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kStroke, width: 1),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: kStroke),
            ),
            padding: const EdgeInsets.all(10),
            child: Icon(icon, color: kInk, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                color: kInk,
                fontSize: 15.5,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Hairline extends StatelessWidget {
  final Color color;
  const _Hairline({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(height: 1, color: color);
  }
}
