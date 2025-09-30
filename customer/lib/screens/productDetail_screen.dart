import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:customer/models/utils/common.dart';
import 'cart_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final dynamic product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int quantity = 1;

  // Widget helper để tạo nút tăng/giảm số lượng
  Widget _buildQuantityButton(IconData icon, VoidCallback onPressed) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(4),
      child: Container(
        width: 35,
        height: 35,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Icon(icon, size: 20, color: Colors.black87),
      ),
    );
  }

  // Hàm cập nhật số lượng
  void _updateQuantity(int delta) {
    setState(() {
      final newQuantity = quantity + delta;
      // Đảm bảo số lượng không nhỏ hơn 1
      if (newQuantity >= 1) {
        quantity = newQuantity;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Scaffold(
      appBar: AppBar(title: const Text("Chi tiết sản phẩm")),
      body: SingleChildScrollView( // Dùng SingleChildScrollView để tránh overflow
        padding: const EdgeInsets.all(16.0),
        child: Row(
          // căn chỉnh tất cả các phần tử con theo đỉnh (top)
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bên trái: hình ảnh (đã bỏ AspectRatio cố định 1:1 trong Row)
            Expanded(
              flex: 1,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: "${Common.domain}/images/${p["image"]}",
                  fit: BoxFit.cover,
                  height: 250, // Đặt chiều cao cố định để cân đối với phần thông tin
                  placeholder: (context, url) => Container(color: Colors.grey.shade200, height: 250),
                  errorWidget: (context, url, error) => const SizedBox(
                    height: 250,
                    child: Center(child: Icon(Icons.error_outline, size: 40)),
                  ),
                ),
              ),
            ),

            const SizedBox(width: 16),

            // Bên phải: thông tin
            Expanded(
              flex: 1,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(p["productName"] ?? "Tên sản phẩm",
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Text("${p["price"] ?? 0} đ",
                      style: const TextStyle(fontSize: 18, color: Colors.red, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),

                  // --- HIỂN THỊ VÀ ĐIỀU KHIỂN SỐ LƯỢNG ---
                  const Text("Số lượng:", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 8),

                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Nút Giảm (-)
                      _buildQuantityButton(Icons.remove, () => _updateQuantity(-1)),

                      // Hiển thị số lượng
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          quantity.toString(),
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ),

                      // Nút Tăng (+)
                      _buildQuantityButton(Icons.add, () => _updateQuantity(1)),
                    ],
                  ),

                  const SizedBox(height: 24),

                  Text(p["description"] ?? "Không có mô tả",
                      style: const TextStyle(fontSize: 14)),
                  const SizedBox(height: 24),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          // Thêm vào giỏ hàng (LOGIC GIỮ NGUYÊN)
                          Cart.addToCart(p, quantity);
                          ScaffoldMessenger.of(context).showSnackBar(
                            // Cập nhật SnackBar để hiển thị số lượng đã thêm
                              SnackBar(content: Text("Đã thêm $quantity sản phẩm vào giỏ hàng")));
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        child: const Text("Thêm giỏ hàng"),
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