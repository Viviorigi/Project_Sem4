
import 'package:ecommerce_sem4/models/user/cart/request/add_cart_request.dart';
import 'package:ecommerce_sem4/models/user/post/response/post_detail_response.dart';
import 'package:ecommerce_sem4/models/user/post/response/post_model.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/screens/user/post/views/components/post_answer_comment_component.dart';
import 'package:ecommerce_sem4/screens/user/post/views/components/post_form_comment_component.dart';
import 'package:ecommerce_sem4/screens/user/product/views/components/bottom_button.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/services/user/product/product_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../services/user/post/post_service.dart';

class PostDetailScreen extends StatefulWidget{
  final Post? post;

  const PostDetailScreen({super.key, required this.post});

  @override
  State<StatefulWidget> createState() => _PostDetail();
}

class _PostDetail extends State<PostDetailScreen>{
  final TextEditingController _searchController = TextEditingController();
  final postDetailUriapi = postDetailUri;
  PostDetailResponse? comments1 = null;
  String? accessToken = "";
  Map<String, String> headers = <String, String>{};

  final imageUrl = "http://10.0.2.2:5069/images/";


  Future<void> _loadPost() async{
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final data = await PostService().detail(postDetailUriapi+"/"+widget.post!.id.toString(), headers,);

    setState(() {
      comments1 = data;
    });

  }


  String stripHtml(String? htmlText) {
    if(htmlText!=null){
      return htmlText.replaceAll(RegExp(r'<[^>]*>'), ''); // Removes all HTML tags
    }else {
      return "";
    }
  }

  @override
  void initState(){
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadPost();
  }

  //to release any resources as input
  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
          appBar: AppBar(
            backgroundColor: greenBgColor,
            automaticallyImplyLeading: true,
            foregroundColor: whiteColor,
            title: const Text("Post detail"),
          ),
          body: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                    Container(
                    alignment: Alignment.topCenter,
                    width: double.infinity,
                    height: 300,
                    child: Image.network(
                      '$imageUrl${widget.post?.image}',
                      fit: BoxFit.cover,
                      errorBuilder: (BuildContext context, Object error, StackTrace? stackTrace) {
                        // Return a placeholder image if there's an error loading the network image
                        return Image.asset("assets/user/images/slide1.jpg", fit: BoxFit.cover);
                      },
                    ),
                  ),

                    Padding(
                        padding: const EdgeInsets.fromLTRB(15, 15, 15, 15),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                    padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(widget.post!.title,
                                          style: const TextStyle(
                                              color: Colors.black87,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 25
                                          ),
                                        ),
                                      ],
                                    )
                                ),
                              ],
                            ),
                            const Divider(
                              color: Colors.grey,     // Set the color to grey
                              thickness: 1,           // Adjust thickness as desired
                              indent: 16,             // Optional: add spacing on the left side
                              endIndent: 16,          // Optional: add spacing on the right side
                            ),

                            Padding(
                                padding: const EdgeInsets.fromLTRB(8, 10, 0, 0),
                                child:  Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                   const Text(
                                      "Description",
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold
                                      ),
                                    ),
                                   const SizedBox(
                                      height: 5,
                                    ),
                                    Text(
                                        stripHtml(widget.post!.description)
                                    ),
                                    const SizedBox(
                                      height: 5,
                                    ),
                                    const Text(
                                      "Content",
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold
                                      ),
                                    ),
                                    const SizedBox(
                                      height: 5,
                                    ),
                                    Text(
                                        stripHtml(widget.post!.content)
                                    ),

                                    const SizedBox(
                                      height: 5,
                                    ),

                                    const Text(
                                      "Comments",
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold
                                      ),
                                    ),

                                    const SizedBox(
                                      height: 5,
                                    ),

                                    ...comments1?.comments?.map((entry) =>

                                      AnswerComment(
                                        accountName: entry.account.userName!,
                                        content: entry!.content,
                                        createdAt: entry.createdAt,
                                        avatar: entry.account.avatar,
                                      )

                                       ).toList() ?? [],

                                    const Divider(
                                      color: Colors.grey,
                                      thickness: 1,
                                      indent: 10,
                                      endIndent: 10,
                                    ),

                                    FormCommentPost(postId:widget.post!.id.toString()),

                                  ],
                                )
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              //BottomButton(buttonName: "Add to cart",price: widget.product!.price,quantity: _quantity,event: _addToCart,)
            ],
          )
      ),
    );
  }
}