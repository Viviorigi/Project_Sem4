

import 'package:ecommerce_sem4/models/user/cart/request/add_cart_request.dart';
import 'package:ecommerce_sem4/models/user/post/response/post_model.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/screens/user/post/views/post_detail_screen.dart';
import 'package:ecommerce_sem4/screens/user/product/views/product_detail_screen.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PostItem extends StatelessWidget{
  final String? image;
  final String? name;
  final String? description;
  final Post? post;
  final imageUrl = "http://10.0.2.2:5069/images/";

  const PostItem({super.key,  this.image,  this.name,  this.description,this.post});
  String stripHtml(String htmlText) {
    if(htmlText!=null){
      return htmlText.replaceAll(RegExp(r'<[^>]*>'), ''); // Removes all HTML tags
    }else {
      return "";
    }
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      margin: const EdgeInsets.all(5),
      child:  Card(
        elevation: 5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        child: Row(
          children: <Widget>[
            Container(
              margin: const EdgeInsets.all(6),
              width: 150,
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.grey,
                  width: 1,
                ),
                shape: BoxShape.rectangle,
              ),
              child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                  child: Image.network(
                    '$imageUrl${image!}',
                    height: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Image.asset("assets/user/images/slide1.jpg"), // Optional error handling
                  )
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(9.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children:  [
                  GestureDetector(
                    child:  Text(
                      name!,
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: blackColor,
                          overflow: TextOverflow.ellipsis
                      ),
                    ),
                    onTap: (){
                       Navigator.push(context, MaterialPageRoute(builder: (context) => PostDetailScreen(post: post)));
                    },
                  ),


                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(
                       description!=null?stripHtml(description!):"",
                        style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.normal,
                            fontSize: 13,
                            overflow: TextOverflow.ellipsis
                        ),
                      ),

                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}