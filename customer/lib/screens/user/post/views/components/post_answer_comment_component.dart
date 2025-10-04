import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AnswerComment extends StatelessWidget {
  final String? accountName;
  final String? content;
  final DateTime createdAt;
  final String? avatar;

  const AnswerComment({
    super.key,
    this.accountName,
    this.content,
    required this.createdAt,
    this.avatar,
  });

  static const _borderLavender = Color(0xFFE6E0FF);
  static const _shadowColor = Color(0x14000000);
  static const _avatarBg = Color(0xFFF3F2F8);

  final String imageUrl = "http://10.0.2.2:5069/images/";

  bool get _hasAvatar {
    final a = (avatar ?? '').trim();
    if (a.isEmpty) return false;
    final lower = a.toLowerCase();
    return !(lower.contains('null') || lower.contains('undefined'));
  }

  @override
  Widget build(BuildContext context) {
    final name = (accountName ?? '').trim().isEmpty ? 'User' : accountName!.trim();
    final text = (content ?? '').trim();
    final dateStr = DateFormat('dd/MM/yyyy – HH:mm').format(createdAt);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: _borderLavender, width: 1),
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: _shadowColor, blurRadius: 12, offset: Offset(0, 6)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar tròn
          Container(
            width: 48,
            height: 48,
            decoration: const BoxDecoration(shape: BoxShape.circle, color: _avatarBg),
            clipBehavior: Clip.antiAlias,
            child: _hasAvatar
                ? Image.network(
              '$imageUrl$avatar',
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) =>
                  Image.asset('assets/user/images/avatar-1.png', fit: BoxFit.cover),
            )
                : Image.asset('assets/user/images/avatar-1.png', fit: BoxFit.cover),
          ),
          const SizedBox(width: 12),

          // Nội dung
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hàng trên: tên + thời gian
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.black87,
                          fontSize: 15.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: .2,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Row(
                      children: [
                        Icon(Icons.schedule, size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 4),
                        Text(
                          dateStr,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 12.5,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 6),

                // Nội dung comment
                Text(
                  text.isEmpty ? '—' : text,
                  style: const TextStyle(
                    color: Colors.black87,
                    fontSize: 14.5,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
