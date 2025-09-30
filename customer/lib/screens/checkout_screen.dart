import 'package:flutter/material.dart';

class CheckoutScreen extends StatelessWidget {
  final List<Map<String, dynamic>> items;
  const CheckoutScreen({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    double total = 0;
    for (var item in items) {
      total += item["product"]["price"] * item["quantity"];
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Thanh toán")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: items
                    .map((item) => ListTile(
                  title: Text(item["product"]["productName"]),
                  subtitle: Text("${item["quantity"]} x ${item["product"]["price"]} đ"),
                ))
                    .toList(),
              ),
            ),
            Text("Tổng tiền: $total đ", style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Xử lý đặt hàng xong
                ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Đặt hàng thành công")));
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              child: const Text("Thanh toán"),
            ),
          ],
        ),
      ),
    );
  }
}
