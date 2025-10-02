

import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class ShopAppBar extends StatelessWidget implements PreferredSizeWidget{
  const ShopAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: greenBgColor,
      centerTitle: true,
      title: const Text(
        "Find Products",
        style: TextStyle(
            color: Colors.black,
            fontSize: 22
        ),
      ),
      automaticallyImplyLeading: false,
    );
  }

  @override
  // TODO: implement preferredSize
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}