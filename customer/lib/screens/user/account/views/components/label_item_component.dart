import 'package:flutter/material.dart';
import 'package:ecommerce_sem4/utils/constants.dart';

class LabelItem extends StatelessWidget {
  final String labelName;
  final String content;
  final IconData? icon; // tuỳ chọn, có thể truyền icon

  const LabelItem({
    super.key,
    required this.labelName,
    required this.content,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: kStroke),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: kAccentDark, size: 18),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  labelName,
                  style: const TextStyle(
                    color: kMuted,
                    fontWeight: FontWeight.w600,
                    fontSize: 13.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  content,
                  style: const TextStyle(
                    color: kInk,
                    fontWeight: FontWeight.w700,
                    fontSize: 15.5,
                  ),
                  softWrap: true,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
