import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Ví dụ thông tin tạm thời
    final user = {"name": "Nguyen Van A", "email": "a@example.com"};

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Tên: ${user["name"]}", style: const TextStyle(fontSize: 18)),
          const SizedBox(height: 8),
          Text("Email: ${user["email"]}", style: const TextStyle(fontSize: 16)),
          const Spacer(),
          Center(
            child: ElevatedButton(
              onPressed: () {
                // Xử lý đăng xuất
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              child: const Text("Đăng xuất"),
            ),
          ),
        ],
      ),
    );
  }
}
