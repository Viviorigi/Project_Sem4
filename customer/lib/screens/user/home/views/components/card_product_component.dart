
import 'package:ecommerce_sem4/models/user/cart/request/add_cart_request.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/screens/user/product/views/product_detail_screen.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

final formatCurrency = NumberFormat.currency(locale: "vi_VN", symbol: "₫");

class CardProduct extends StatelessWidget {

  final String image;
  final String name;
  final double price;

  final Product product; // không nullable để tránh null khi push


  const CardProduct({
    super.key,
    required this.image,
    required this.name,
    required this.price,
    required this.product,
  });

  String get formattedPrice {
    return formatCurrency.format(price);
  }

  Future<void> _addToCart(BuildContext context) async {
    final pref = await SharedPreferences.getInstance();
    final userId = pref.getString("id");
    final accessToken = pref.getString("accessToken");

    if (userId == null || accessToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Bạn cần đăng nhập trước khi thêm vào giỏ.")),
      );
      return;
    }

    final headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final request = CartRequest(
      userId: userId,
      productId: product.id.toString(),
      quantity: "1",
      price: product.price.toString(),
    ).toMap();

    final data = await CartService().addToCart(cartAddUri, headers, request);
    if (data != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Đã thêm sản phẩm vào giỏ!"), duration: Duration(seconds: 2)),
      );
    }



  }

  void _goToDetail(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ProductDetailScreen(product: product)),
    );
  }

  @override
  Widget build(BuildContext context) {

    return Material( // cần Material để InkWell hiển thị ripple
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(15),
        onTap: () => _goToDetail(context), // << bắt tap toàn card
        child: Card(
          elevation: 5,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          clipBehavior: Clip.antiAlias, // để ripple bo góc đẹp
          child: Column(
            children: <Widget>[
              // Ảnh
              SizedBox(
                height: 150,
                width: double.infinity,
                child: Image.network(
                  image,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Image.asset("assets/user/images/slide1.jpg", fit: BoxFit.cover),
                ),
              ),

              // Nội dung
              Padding(
                padding: const EdgeInsets.all(9.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Tên sản phẩm (giữ GestureDetector nếu muốn, nhưng không cần nữa)
                    Text(
                      name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: blackColor),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          formattedPrice,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                        ElevatedButton(
                          onPressed: () => _addToCart(context),
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            padding: const EdgeInsets.all(16),
                            backgroundColor: kAccentDark,
                          ),
                          child: const Icon(Icons.add, color: Colors.white),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

