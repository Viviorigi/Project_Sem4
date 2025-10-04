import 'dart:math';
import 'package:ecommerce_sem4/screens/user/post/views/post_category_post_screen.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class PostCategoryItem extends StatelessWidget {
  final String name;
  final int postCategoryId;

  const PostCategoryItem({
    super.key,
    required this.name,
    required this.postCategoryId,
  });

  // Không dùng Characters để tránh lỗi import
  String _abbr(String text) {
    final t = text.trim();
    if (t.isEmpty) return '?';
    final parts = t.split(RegExp(r'\s+'));
    if (parts.length == 1) {
      final s = parts.first;
      return s.substring(0, min(2, s.length)).toUpperCase();
    }
    return (parts.first[0] + parts.last[0]).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final String safeName = name.trim().isEmpty ? 'Unnamed' : name.trim();

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      elevation: 0,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => PostCategoryPostScreen(
                postCategoryId: postCategoryId.toString(),
                postCategoryName: safeName,
                isCheckScreen: false,
              ),
            ),
          );
        },
        child: Container(
          height: 88,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE9ECF1), width: 1),
            boxShadow: const [
              BoxShadow(color: Color(0x12000000), blurRadius: 10, offset: Offset(0, 4)),
            ],
          ),
          child: Row(
            children: [
              // Stripe cùng màu AppBar (kAccentDark)
              Container(
                width: 6,
                height: double.infinity,
                decoration: BoxDecoration(
                  color: kAccentDark,
                  borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
                ),
              ),
              const SizedBox(width: 14),

              // Avatar chữ cái
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F6F8),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE9ECF1)),
                ),
                alignment: Alignment.center,
                child: Text(
                  _abbr(safeName),
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    color: Colors.black87,
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Tên danh mục
              Expanded(
                child: Text(
                  safeName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.black87,
                    fontSize: 16.5,
                    fontWeight: FontWeight.w700,
                    height: 1.2,
                    letterSpacing: 0.2,
                  ),
                ),
              ),

              const SizedBox(width: 6),
              Icon(Icons.chevron_right_rounded, size: 22, color: Colors.grey.shade400),
              const SizedBox(width: 8),
            ],
          ),
        ),
      ),
    );
  }
}
