import 'package:customer/models/product.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';


class DetailScreen extends StatelessWidget {
  final Product product;
  const DetailScreen({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Chi tiết sản phẩm: ${product.name}"),),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  flex: 1,
                  child: CachedNetworkImage(
                    imageUrl: product.image,
                    height: 200,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(product.name,
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text("${product.price.toStringAsFixed(0)} đ",
                          style: const TextStyle(
                              fontSize: 18, color: Colors.red)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              cart.add(product);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text("Đã thêm vào giỏ hàng")),
                              );
                            },
                            child: const Text("Thêm giỏ hàng"),
                          ),
                          const SizedBox(width: 10),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orange),
                            child: const Text("Mua ngay"),
                          ),
                        ],
                      )
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                children: [
                  Text("Mô tả: ${product.description}"),
                  const SizedBox(height: 20),
                  const Text("Bình luận:",
                      style:
                      TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const ListTile(
                    title: Text("Người dùng A"),
                    subtitle: Text("Sản phẩm rất tốt!"),
                  ),
                  const ListTile(
                    title: Text("Người dùng B"),
                    subtitle: Text("Hàng chất lượng, giá hợp lý."),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
