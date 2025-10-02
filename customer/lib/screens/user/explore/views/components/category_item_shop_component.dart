
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class ItemShopCategory extends StatelessWidget{
  final String image;
  final Color colorBg;
  final Color colorSideBorder;
  final String text;

  const ItemShopCategory({super.key, required this.image, required this.colorBg, required this.colorSideBorder, required this.text});

  @override
  Widget build(BuildContext context) {
  return SizedBox(
    width: (MediaQuery.of(context).size.width / 2) -20,
    height: 210,
    child: Card(
        color: colorBg,
        elevation: 4,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20.0),
            side: BorderSide(
                width: 1,
                color: colorSideBorder
            )
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 130,
              height: 130,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.rectangle,
                image: DecorationImage(
                    fit: BoxFit.contain,
                    image: AssetImage(image)
                ),
              ),
            ),
             Padding(
              padding: const EdgeInsets.only(top: 10, left: 10, bottom: 20, right: 10),
              child:  Text(
                text,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
            )
          ],
        )
    ),
  );
  }
}