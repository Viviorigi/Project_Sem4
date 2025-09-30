import 'package:flutter/material.dart';
import 'package:customer/models/utils/common.dart';
import 'checkout_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  // Hàm này đã xử lý việc tính tổng tiền cho các item được chọn
  double total() {
    double t = 0;
    for (var item in Cart.items) {
      // Chỉ tính các sản phẩm được chọn
      if (item["selected"]) {
        t += item["product"]["price"] * item["quantity"];
      }
    }
    return t;
  }

  // Hàm cập nhật số lượng (quantity)
  void _updateQuantity(int index, int delta) {
    setState(() {
      final currentQuantity = Cart.items[index]["quantity"] as int;
      final newQuantity = currentQuantity + delta;

      if (newQuantity > 0) {
        Cart.items[index]["quantity"] = newQuantity;
      } else {
        // Nếu số lượng giảm xuống 0, xóa sản phẩm khỏi giỏ hàng
        _removeItem(index);
      }
    });
  }

  // Hàm xóa sản phẩm
  void _removeItem(int index) {
    setState(() {
      Cart.items.removeAt(index);
      // Hiển thị thông báo đã xóa (optional)
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Đã xóa sản phẩm khỏi giỏ hàng")),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final cartItems = Cart.items;

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: cartItems.isEmpty
                ? const Center(
              child: Text(
                "Giỏ hàng trống.",
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            )
                : ListView.builder(
              itemCount: cartItems.length,
              itemBuilder: (context, index) {
                final item = cartItems[index];
                final p = item["product"];

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Checkbox chọn mua
                      Checkbox(
                        value: item["selected"],
                        onChanged: (val) {
                          setState(() {
                            item["selected"] = val!;
                          });
                        },
                      ),

                      // 2. Ảnh sản phẩm
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          "${Common.domain}/images/${p["image"]}",
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            width: 80, height: 80, color: Colors.grey.shade200,
                            child: const Icon(Icons.broken_image),
                          ),
                        ),
                      ),

                      const SizedBox(width: 12),

                      // 3. Thông tin & Điều khiển số lượng
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              p["productName"] as String,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              "Giá: ${p["price"]} đ",
                              style: TextStyle(color: Colors.red.shade600, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 8),

                            // --- KHU VỰC ĐIỀU KHIỂN SỐ LƯỢNG ---
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Nút Giảm (-)
                                _buildQuantityButton(
                                    Icons.remove,
                                        () => _updateQuantity(index, -1)
                                ),

                                // Hiển thị số lượng
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 12.0),
                                  child: Text(
                                    item["quantity"].toString(),
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                  ),
                                ),

                                // Nút Tăng (+)
                                _buildQuantityButton(
                                    Icons.add,
                                        () => _updateQuantity(index, 1)
                                ),
                                const Spacer(),
                                // Nút xóa (thùng rác)
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: Colors.grey),
                                  onPressed: () => _removeItem(index),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          // HIỂN THỊ KHU VỰC TỔNG TIỀN VÀ MUA HÀNG CHỈ KHI CÓ SẢN PHẨM
          if (cartItems.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Text("Tổng tiền: ${total().toStringAsFixed(0)} đ", // Định dạng tiền
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold)),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: () {
                      final selectedItems =
                      cartItems.where((item) => item["selected"]).toList();
                      if (selectedItems.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text("Chọn sản phẩm để mua")));
                        return;
                      }
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) =>
                                  CheckoutScreen(items: selectedItems)));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Mua hàng"),
                  ),
                ],
              ),
            ),
          // Thêm padding cho các thiết bị có thanh điều hướng dưới cùng (ví dụ: iPhone)
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  // Widget riêng để tạo nút tăng/giảm
  Widget _buildQuantityButton(IconData icon, VoidCallback onPressed) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(4),
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Icon(icon, size: 18, color: Colors.black87),
      ),
    );
  }
}

class Cart {
  static List<Map<String, dynamic>> items = [];

  static void addToCart(dynamic product, int quantity) {
    final existing =
    items.indexWhere((item) => item["product"]["id"] == product["id"]);
    if (existing >= 0) {
      // Logic đã đúng: Cộng dồn số lượng nếu sản phẩm đã tồn tại
      items[existing]["quantity"] += quantity;
    } else {
      items.add({"product": product, "quantity": quantity, "selected": true});
    }
  }
}
