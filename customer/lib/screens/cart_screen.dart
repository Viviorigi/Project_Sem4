import 'package:customer/models/product.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'order_confirm_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Giỏ hàng")),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: cart.length,
              itemBuilder: (context, index) {
                final p = cart[index];
                return ListTile(
                  leading: CachedNetworkImage(imageUrl: p.image, width: 50),
                  title: Text(p.name),
                  subtitle: Text("${p.price.toStringAsFixed(0)} đ"),
                );
              },
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => OrderConfirmScreen(cartProducts: cart),
                ),
              );
            },
            child: const Text("Đặt hàng"),
          )
        ],
      ),
    );
  }
}
