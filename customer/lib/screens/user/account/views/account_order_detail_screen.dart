import 'package:ecommerce_sem4/models/user/order/response/order_item_response.dart';
import 'package:ecommerce_sem4/screens/user/account/views/components/label_item_component.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class UserOrderDetailScreen extends StatefulWidget {
  final OrderItemResponse? userOrder;

  const UserOrderDetailScreen({super.key, required this.userOrder});

  @override
  State<UserOrderDetailScreen> createState() => _UserOrderDetail();
}

class _UserOrderDetail extends State<UserOrderDetailScreen> {
  final formatCurrency = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

  @override
  Widget build(BuildContext context) {
    final order = widget.userOrder!;

    return SafeArea(
      child: Scaffold(
        backgroundColor: kCanvas,
        appBar: AppBar(
          backgroundColor: kAccentDark,
          elevation: 0,
          foregroundColor: Colors.white,
          title: const Text("Order Details"),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Column(
              children: [
                // ---------- Order Info Card ----------
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: kSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: kStroke),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(.05),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      LabelItem(labelName: "Order ID:", content: order.orderId.toString()),
                      LabelItem(labelName: "User name:", content: order.userName ?? ""),
                      LabelItem(labelName: "Email:", content: order.email ?? ""),
                      LabelItem(
                        labelName: "Order date:",
                        content: DateFormat('dd/MM/yyyy').format(DateTime.parse(order.orderDate!)),
                      ),
                      LabelItem(labelName: "Shipping address:", content: order.shippingAddress ?? ""),
                      LabelItem(labelName: "Status:", content: order.status ?? ""),
                      LabelItem(
                        labelName: "Total Price:",
                        content: formatCurrency.format(order.totalPrice),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ---------- Product Table ----------
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: kSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: kStroke),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(.05),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Order Items",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: kInk,
                        ),
                      ),
                      const SizedBox(height: 10),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          headingRowColor: WidgetStateProperty.all(kAccentDark.withOpacity(.9)),
                          headingTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          dataRowColor: WidgetStateProperty.all(Colors.white),
                          border: TableBorder.symmetric(
                            inside: BorderSide(color: kStroke, width: 0.6),
                            outside: BorderSide(color: kStroke, width: 1),
                          ),
                          columns: const [
                            DataColumn(label: Text('No.')),
                            DataColumn(label: Text('Product')),
                            DataColumn(label: Text('Qty')),
                            DataColumn(label: Text('Price')),
                            DataColumn(label: Text('Subtotal')),
                          ],
                          rows: order.orderItems!.asMap().entries.map((entry) {
                            final index = entry.key;
                            final item = entry.value;
                            return DataRow(cells: [
                              DataCell(Text((index + 1).toString())),
                              DataCell(Text(item.productName ?? "")),
                              DataCell(Text(item.quantity.toString())),
                              DataCell(Text(formatCurrency.format(item.price))),
                              DataCell(Text(formatCurrency.format(item.subTotal))),
                            ]);
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
