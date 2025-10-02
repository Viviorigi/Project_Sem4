
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      flexibleSpace: Container(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Trung tien, Tran Phu, Ha Noi",
                      style: TextStyle(
                          fontFamily: "Poppins",
                          fontSize: 15,
                          color: whiteColor,
                          fontWeight: FontWeight.w400),
                    ),
                    Text(
                      "Your address",
                      style: TextStyle(
                          fontFamily: "Poppins",
                          fontSize: 13,
                          color: Colors.white24,
                          fontWeight: FontWeight.w300),
                    )
                  ],
                ),
                Column(
                  children: [
                    Container(
                      height: 50,
                      width: 50,
                      child: const CircleAvatar(
                        backgroundColor: whiteColor,
                        radius:
                        50.0, // Adjust the radius for the size of the circle
                        backgroundImage:
                        AssetImage("assets/user/images/logo.png"),
                      ),
                    )
                  ],
                )
              ],
            ),
            const SizedBox(
              height: 40,
            ),
            TextFormField(
              decoration: const InputDecoration(
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: borderInput, width: 1.0),
                  borderRadius: BorderRadius.all(Radius.circular(10.0)),
                ),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10.0))),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: borderInput, width: 1.0),
                  borderRadius: BorderRadius.all(Radius.circular(10.0)),
                ),
                filled: true,
                fillColor: Colors.white,
                hintText: "Search What You Need ?",
                contentPadding: EdgeInsets.symmetric(
                    vertical: 15.0, horizontal: 20.0), // Add padding
                hintStyle: TextStyle(color: greyColor, fontSize: 13),
                suffixIcon: Icon(Icons.search, color: Colors.grey),
              ),
            )
          ],
        ),
      ),
      backgroundColor: greenBgColor,
    );
  }

  @override
  // TODO: implement preferredSize
  Size get preferredSize => const Size.fromHeight(185.0);
}