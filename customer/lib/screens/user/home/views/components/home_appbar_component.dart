import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      backgroundColor: kAccentDark,
      elevation: 0,
      toolbarHeight: 150,
      flexibleSpace: SafeArea(
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top row: address + actions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Hoang Quoc Viet, Cau Giay, Ha Noi",
                        style: TextStyle(
                          fontFamily: "Poppins",
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Your address",
                        style: TextStyle(
                          fontFamily: "Poppins",
                          fontSize: 13,
                          color: Colors.white54,
                          fontWeight: FontWeight.w400,
                        ),
                      )
                    ],
                  ),

                  // Avatar + Notification
                  Row(
                    children: [
                      const SizedBox(width: 8),
                      Container(
                        height: 42,
                        width: 42,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white24, width: 1),
                        ),
                        child: const CircleAvatar(
                          backgroundColor: Colors.white,
                          backgroundImage:
                          AssetImage("assets/user/images/logo.jpg"),
                        ),
                      ),
                    ],
                  )
                ],
              ),

              const SizedBox(height: 18),

              // Search bar
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: TextFormField(
                  style: const TextStyle(color: kInk, fontSize: 14),
                  decoration: InputDecoration(
                    prefixIcon:
                    const Icon(Icons.search, color: Colors.grey, size: 22),
                    hintText: "Search what you need...",
                    hintStyle:
                    const TextStyle(color: Colors.grey, fontSize: 14),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                        vertical: 14, horizontal: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(150.0);
}
