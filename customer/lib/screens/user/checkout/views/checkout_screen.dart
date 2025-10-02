
import 'package:ecommerce_sem4/models/user/cart/request/add_cart_request.dart';
import 'package:ecommerce_sem4/models/user/order/request/create_request.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/screens/user/layout/views/layout_screen.dart';
import 'package:ecommerce_sem4/screens/user/product/views/components/bottom_button.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/services/user/order/order_service.dart';
import 'package:ecommerce_sem4/services/user/product/product_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CheckoutScreen extends StatelessWidget{
  final double totalPrice;

  const CheckoutScreen({super.key, required this.totalPrice});



  @override
  Widget build(BuildContext context) {
    TextEditingController _addressController = TextEditingController();

    void _showAlertDialog(String title, String message) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Close the dialog
                },
                child: const Text("OK"),
              ),
            ],
          );
        },
      );
    }

    Future<void> _createOrder() async {
      // Get userId and accessToken from SharedPreferences
      final pref = await SharedPreferences.getInstance();
      String? userId = pref.getString("id");
      String? accessToken = pref.getString("accessToken");
      String? apiUrlOrder = orderUri;

      Map<String, String> headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      String address = _addressController.text.trim();

      if(address == null || address=="" || address.isEmpty || totalPrice==0.0){
        _showAlertDialog("Error", "Enter your address or add your wanted product to the cart. Please try again.");
        return;
      }
      Map<String, Object?> request = CreateOrderRequest(
        userId: userId!,
        status: "Ordered",
        shippingAddress: address,
        totalAmount: totalPrice,
      ).toMap();

      final data = await OrderService().createOrder(apiUrlOrder, headers, request);

      if (data != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Order successfully!"),
            duration: Duration(seconds: 2),
          ),
        );

        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                  builder: (context) => const LayoutScreen())
          );
        });
      }
    }


    return SafeArea(
      child: Scaffold(
          appBar: AppBar(
            backgroundColor: greenBgColor,
            automaticallyImplyLeading: true,
            foregroundColor: whiteColor,
            title:  const Text("Checkout"),
          ),
          body: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(15, 15, 15, 15),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [

                            Padding(
                                padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text("Address",
                                      style: TextStyle(
                                          color: Colors.black87,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 20
                                      ),
                                    ),

                                    const SizedBox(
                                      height: 5,
                                    ),
                                    TextFormField(
                                      controller: _addressController,
                                      decoration: const InputDecoration(
                                        enabledBorder: OutlineInputBorder(
                                          borderSide: BorderSide(color: borderInput, width: 1.0),

                                        ),

                                        focusedBorder: OutlineInputBorder(
                                          borderSide: BorderSide(color: borderInput, width: 1.0),

                                        ),
                                        filled: true,
                                        fillColor: Colors.white,
                                        contentPadding: EdgeInsets.symmetric(
                                            vertical: 15.0, horizontal: 20.0), // Add padding
                                        hintStyle: TextStyle(color: greyColor, fontSize: 13),
                                      ),
                                    ),

                                  const SizedBox(
                                      height: 10,
                                    ),

                                   const Text(
                                      "Payment method",
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
                                      "Money",
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green[700],
                                      ),
                                    )

                                  ],
                                )
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              BottomButton(buttonName: "Submit",price:totalPrice,quantity: 0,event: _createOrder,)
            ],
          )
      ),
    );
  }
}

