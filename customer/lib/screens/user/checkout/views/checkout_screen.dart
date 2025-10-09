import 'package:ecommerce_sem4/models/user/order/request/create_request.dart';
import 'package:ecommerce_sem4/screens/user/layout/views/layout_screen.dart';
import 'package:ecommerce_sem4/screens/user/product/views/components/bottom_button.dart';
import 'package:ecommerce_sem4/services/user/order/order_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CheckoutScreen extends StatelessWidget {
  final double totalPrice;

  const CheckoutScreen({super.key, required this.totalPrice});

  @override
  Widget build(BuildContext context) {
    final TextEditingController addressController = TextEditingController();

    void showAlertDialog(String title, String message) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text("OK"),
              ),
            ],
          );
        },
      );
    }

    Future<void> createOrder() async {
      final pref = await SharedPreferences.getInstance();
      final userId = pref.getString("id");
      final accessToken = pref.getString("accessToken");

      final headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final address = addressController.text.trim();
      if (address.isEmpty || totalPrice <= 0) {
        showAlertDialog(
          "Error",
          "Please enter your address and make sure your cart has items.",
        );
        return;
      }

      final request = CreateOrderRequest(
        userId: userId!,
        status: "Ordered",
        shippingAddress: address,
        totalAmount: totalPrice,
      ).toMap();

      final data = await OrderService().createOrder(orderUri, headers, request);

      if (data != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Order successfully!"),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );

        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const LayoutScreen()),
          );
        });
      } else {
        showAlertDialog("Error", "Order failed. Please try again later.");
      }
    }

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: kAccentDark,
          automaticallyImplyLeading: true,
          foregroundColor: whiteColor,
          title: const Text(
            "Checkout",
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
        ),
        body: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      const Text(
                        "Shipping Address",
                        style: TextStyle(
                          color: Colors.black87,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Address field
                      TextFormField(
                        controller: addressController,
                        decoration: InputDecoration(
                          hintText: "Enter your delivery address...",
                          filled: true,
                          fillColor: Colors.grey.shade50,
                          contentPadding: const EdgeInsets.symmetric(
                              vertical: 14, horizontal: 18),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide:
                            const BorderSide(color: borderInput, width: 1),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: kAccentDark,
                              width: 1.5,
                            ),
                          ),
                        ),
                        maxLines: 3,
                      ),

                      const SizedBox(height: 24),
                      const Text(
                        "Payment Method",
                        style: TextStyle(
                          color: Colors.black87,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),

                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border:
                          Border.all(color: Colors.grey.shade300, width: 1),
                        ),
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.green.shade50,
                                shape: BoxShape.circle,
                              ),
                              padding: const EdgeInsets.all(8),
                              child: const Icon(Icons.attach_money_rounded,
                                  color: Colors.green, size: 28),
                            ),
                            const SizedBox(width: 16),
                            const Text(
                              "Cash on Delivery",
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.black87,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const Spacer(),
                            const Icon(Icons.check_circle,
                                color: kAccentDark, size: 22),
                          ],
                        ),
                      ),

                      const SizedBox(height: 28),

                      // Total summary
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF9FAFB),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Column(
                          children: [
                            _summaryRow("Subtotal", totalPrice),
                            _summaryRow("Shipping Fee", 0),
                            _summaryRow("Discount", 0),
                            const Divider(height: 24, thickness: 1),
                            _summaryRow("Total", totalPrice, bold: true),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            BottomButton(
              buttonName: "Submit Order",
              price: totalPrice,
              quantity: 0,
              event: createOrder,
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryRow(String title, double amount, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontSize: 15, color: Colors.black54, fontWeight: FontWeight.w500)),
          Text(
            formatVND(amount),
            style: TextStyle(
              fontSize: 16,
              fontWeight: bold ? FontWeight.bold : FontWeight.w600,
              color: bold ? kAccentDark : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

}

String formatVND(num value) {
  final fmt = NumberFormat.currency(locale: 'vi_VN', symbol: '₫', decimalDigits: 0);
  return fmt.format(value);
}