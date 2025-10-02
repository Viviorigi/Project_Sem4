
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';

class CategoryComponent extends StatelessWidget{
  final String image;
  final String name;
  const CategoryComponent({super.key, required this.image, required this.name});

  @override
  Widget build(BuildContext context) {
   return  Column(
     children: [
       Container(
         width: 50.0, // Set the width of the circle
         height: 50.0, // Set the height of the circle
         decoration:  BoxDecoration(
           shape: BoxShape.rectangle,
           image: DecorationImage(
             fit: BoxFit.cover, // Ensures the image fits inside the circle
             image: AssetImage(image), // Replace with your image path
           ),
         ),
       ),
       Padding(
         padding: const EdgeInsets.fromLTRB(0, 5, 0, 0),
        child:  Text(
           name,
           style: const TextStyle(
               color: greyColor,
               fontFamily: "Poppins",
               fontSize: 9
           ),
         ),
       )
     ],
   );
  }
}