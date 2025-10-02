
import 'dart:convert';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:intl/intl.dart';
import 'package:ecommerce_sem4/models/user/category/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/category/response/category_model.dart';
import 'package:ecommerce_sem4/models/user/category/response/category_response.dart';
import 'package:ecommerce_sem4/models/user/product/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/route/user/router_constants.dart';
import 'package:ecommerce_sem4/screens/user/home/views/components/card_product_component.dart';
import 'package:ecommerce_sem4/screens/user/home/views/components/category_component.dart';
import 'package:ecommerce_sem4/screens/user/home/views/components/slide_carousel.dart';
import 'package:ecommerce_sem4/services/user/category/category_service.dart';
import 'package:ecommerce_sem4/services/user/product/product_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class HomeComponent extends StatefulWidget{
  const HomeComponent({super.key});

  @override
  State<StatefulWidget> createState() => _HomeState();
}

class _HomeState extends State<HomeComponent>{
  final searchApiCategory= categorySearchUri;
  final detailApiCategory = categoryDetailUri;
  final searchApiProduct = productSearchUri;
  final imageUrl = "http://10.0.2.2:5069/images/";
  final detailApiProduct = productDetailUri;
   String? accessToken = "";
   List<Category> categories = [];
   List<Product> products = [];
  Map<String, String> headers = <String, String>{};

 final List<String> categoryImages = [
   "assets/user/images/slide1.jpg",
   "assets/user/images/slide2.jpg",
   "assets/user/images/slide3.png",
   "assets/user/images/slide4.png",
   "assets/user/images/slide5.jpg"
 ];

 @override
 void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadCategories();
    _loadTopProducts();
  }

  Future<void> _loadCategories() async {
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    Map<String, Object?> request = CategorySearchRequest(
        pageNumber: 1,
        pageSize: 5,
        sortBy: "Id",
        sortDir: "asc")
        .toMap();

    final data = await CategoryService().search(searchApiCategory, headers, request);

    setState(() {
      categories = data!.data;
    });
  }

  Future<void> _loadTopProducts() async{
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    Map<String, Object?> request = ProductSearchRequest(
        pageNumber: 1,
        pageSize: 6,
        sortBy: "Id",
        sortDir: "asc",
    )
        .toMap();

    final data = await ProductService().search(searchApiProduct, headers, request);

    setState(() {
      products = data!.data;
    });
  }


  @override
  Widget build(BuildContext context) {
    final formatCurrency = NumberFormat.currency(locale: "vi_VN", symbol: "\₫");
    return SingleChildScrollView(
        child: Container(
          // padding: EdgeInsets.all(20.0),
          child: Column(
            children: [
              HomeSlide(),
              Container(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                        padding: EdgeInsets.fromLTRB(0, 0, 0, 7),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "Category",
                              style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.bold,
                                  color: greyColor),
                            ),
                            InkWell(
                              onTap: () {
                                // Navigate to the new screen
                                Navigator.pushNamed(
                                    context,
                                    categoryScreenRoute
                                );
                              },
                              child: Text(
                                "See more",
                                style: TextStyle(
                                    color: Colors.green,
                                    height: 2.0
                                ),
                              ),
                            )
                          ],
                        )
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: categories.asMap().entries.map((entry) {
                        int index = entry.key;
                        Category item = entry.value;
                        return CategoryComponent(
                            image: categoryImages[index],
                            name: item.categoryName.toString());
                      }).toList(),
                    ),
                    Padding(
                      padding: EdgeInsets.fromLTRB(0, 15, 0, 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Best Selling",
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.bold,
                                  color: greyColor,
                                ),
                              ),
                              Text(
                                "See more",
                                style: TextStyle(
                                    color: Colors.green,
                                    height: 2.0
                                ),
                              )
                            ],
                          ),
                          Wrap(
                            spacing: 11.0,
                            runSpacing: 16.0,
                            children: products.map((product){
                              return  Container(
                                width: 180,
                                child: CardProduct(
                                    image: '$imageUrl${product.image}',
                                    name: product.productName,
                                    price: formatCurrency.format(product.price),
                                    product: product
                                    )
                              );
                            }).toList(),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        )
    );
  }
}