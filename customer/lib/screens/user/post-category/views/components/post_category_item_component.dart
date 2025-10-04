import 'package:ecommerce_sem4/screens/user/post/views/post_category_post_screen.dart';
import 'package:flutter/material.dart';

class PostCategoryItem extends StatelessWidget {
  final String name;
  final int postCategoryId;
  const PostCategoryItem({
    super.key,
    required this.name,
    required this.postCategoryId,
  });

  String _abbr(String text) {
    if (text.trim().isEmpty) return '?';
    final parts = text.trim().split(RegExp(r'\s+'));
    if (parts.length == 1) {
      return parts.first.characters.take(2).toString().toUpperCase();
    }
    final first = parts.first.characters.firstOrNull ?? '';
    final last = parts.last.characters.firstOrNull ?? '';
    return (first + last).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final String safeName = name.trim().isEmpty ? 'Unnamed' : name.trim();

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => PostCategoryPostScreen(
                postCategoryId: postCategoryId.toString(),
                postCategoryName: safeName,
                isCheckScreen: false,
              ),
            ),
          );
        },
        child: Container(
          height: 88,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade200, width: 1),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0F000000),
                blurRadius: 10,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              const SizedBox(width: 12),

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

              // mũi tên subtle
              const SizedBox(width: 6),
              Icon(Icons.chevron_right_rounded,
                  size: 22, color: Colors.grey.shade400),
            ],
          ),
        ),
      ),
    );
  }
}

extension on Characters {
  String? get firstOrNull => isEmpty ? null : first;
}
