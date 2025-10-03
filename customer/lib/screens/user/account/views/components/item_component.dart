import 'package:flutter/material.dart';
import 'package:ecommerce_sem4/utils/constants.dart';

class ItemComponent extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback? onTap;
  final bool danger;

  const ItemComponent({
    super.key,
    required this.text,
    required this.icon,
    this.onTap,
    this.danger = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: kStroke),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  icon,
                  color: danger ? kDanger : kAccentDark,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    color: danger ? kDanger : kInk,
                    fontSize: 15.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Icon(Icons.chevron_right, color: kMuted, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
