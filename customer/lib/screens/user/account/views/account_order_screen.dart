import 'package:ecommerce_sem4/models/user/order/response/order_item_response.dart';
import 'package:ecommerce_sem4/screens/user/account/views/components/user_order_item_component.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/order/order_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccountOrderScreen extends StatefulWidget {
  const AccountOrderScreen({super.key});

  @override
  State<AccountOrderScreen> createState() => _AccountOrderScreen();
}

class _AccountOrderScreen extends State<AccountOrderScreen> {
  final userOrderApi = userOrderUri;
  List<OrderItemResponse> userOrders = [];
  String? accessToken = "";
  String? userId = "";
  Map<String, String> headers = {};
  final formatCurrency = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadOrderUser();
  }

  Future<void> _loadOrderUser() async {
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");
    userId = pref.getString("id");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final data = await OrderService().detail("$userOrderApi/$userId", headers);
    final res = data?.map((item) => OrderItemResponse.fromJson(item)).toList();

    if (res != null) {
      setState(() {
        userOrders = res;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: kCanvas,
        appBar: AppBar(
          backgroundColor: kAccentDark,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          title: const Text(
            "My Orders",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
          ),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.fromLTRB(14, 16, 14, 16),
          child: userOrders.isEmpty
              ? const Center(
            child: Text(
              "No orders yet",
              style: TextStyle(color: kMuted, fontSize: 15),
            ),
          )
              : ListView.separated(
            itemCount: userOrders.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final userOrder = userOrders[index];
              return UserOrderItem(
                orderId: userOrder.orderId,
                orderDate: userOrder.orderDate!,
                totalPrice: userOrder.totalPrice,
                orderUser: userOrder,
              );
            },
          ),
        ),
      ),
    );
  }
}
