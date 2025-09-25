import 'package:customer/models/cart_item.dart';
import 'package:customer/models/product.dart';
import 'package:flutter/material.dart';

class OrderConfirmScreen extends StatefulWidget {
  final List<Product> cartProducts;

  const OrderConfirmScreen({super.key, required this.cartProducts});

  @override
  State<OrderConfirmScreen> createState() => _OrderConfirmScreenState();
}

class _OrderConfirmScreenState extends State<OrderConfirmScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    // Convert product list -> cart item list
    final cartItems = widget.cartProducts
        .map((p) => CartItem(product: p, quantity: 1))
        .toList();

    final totalAmount =
    cartItems.fold(0.0, (sum, item) => sum + item.totalPrice);

    return Scaffold(
      appBar: AppBar(title: const Text("Xác nhận đơn hàng")),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            // Danh sách sản phẩm
            Expanded(
              child: ListView(
                children: [
                  const Text("Sản phẩm",
                      style:
                      TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ...cartItems.map((item) => ListTile(
                    title: Text(item.product.name),
                    subtitle: Text("SL: ${item.quantity}"),
                    trailing:
                    Text("${item.totalPrice.toStringAsFixed(0)} đ"),
                  )),
                  const Divider(),
                  ListTile(
                    title: const Text("Tổng cộng",
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    trailing: Text("${totalAmount.toStringAsFixed(0)} đ",
                        style:
                        const TextStyle(fontSize: 16, color: Colors.red)),
                  ),
                  const SizedBox(height: 20),

                  // Form thông tin người đặt
                  const Text("Thông tin người đặt",
                      style:
                      TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _nameController,
                          decoration:
                          const InputDecoration(labelText: "Họ và tên"),
                          validator: (value) =>
                          value == null || value.isEmpty
                              ? "Nhập họ tên"
                              : null,
                        ),
                        TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(
                              labelText: "Số điện thoại"),
                          keyboardType: TextInputType.phone,
                          validator: (value) =>
                          value == null || value.isEmpty
                              ? "Nhập số điện thoại"
                              : null,
                        ),
                        TextFormField(
                          controller: _addressController,
                          decoration:
                          const InputDecoration(labelText: "Địa chỉ"),
                          validator: (value) =>
                          value == null || value.isEmpty
                              ? "Nhập địa chỉ"
                              : null,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Button Xác nhận
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    // final order = Order(
                    //   id: DateTime.now().millisecondsSinceEpoch,
                    //   items: cartItems,
                    //   date: DateTime.now(),
                    //   status: "pending",
                    // );

                    // Có thể lưu order này vào danh sách đơn hàng toàn cục
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text(
                              "Đặt hàng thành công cho ${_nameController.text}!")),
                    );

                    Navigator.pop(context); // Quay về giỏ hàng
                  }
                },
                child: const Text("Xác nhận đặt hàng"),
              ),
            )
          ],
        ),
      ),
    );
  }
}
