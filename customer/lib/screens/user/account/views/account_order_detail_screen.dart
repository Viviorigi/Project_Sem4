
import 'package:ecommerce_sem4/models/user/order/response/order_item_response.dart';
import 'package:ecommerce_sem4/screens/user/account/views/components/label_item_component.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';


class UserOrderDetailScreen extends StatefulWidget {
  final OrderItemResponse? userOrder;

  const UserOrderDetailScreen({super.key, required this.userOrder});

  @override
  State<StatefulWidget> createState() => _UserOrderDetail();
}

class _UserOrderDetail extends State<UserOrderDetailScreen> {
  final TextEditingController _searchController = TextEditingController();
  final imageUrl = "http://10.0.2.2:5069/images/";
  final formatCurrency = NumberFormat.currency(locale: "en_US", symbol: "\$");
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
          appBar: AppBar(
            backgroundColor: greenBgColor,
            automaticallyImplyLeading: true,
            foregroundColor: whiteColor,
            title: const Text("Order detail"),
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
                                    LabelItem(
                                        labelName: "Order Id:",
                                        content: widget.userOrder!.orderId
                                            .toString()),
                                    LabelItem(
                                      labelName: "User name:",
                                      content:
                                          widget.userOrder!.userName.toString(),
                                    ),
                                    LabelItem(
                                      labelName: "Email:",
                                      content:
                                          widget.userOrder!.email.toString(),
                                    ),
                                    LabelItem(
                                      labelName: "Phone:",
                                      content: (widget.userOrder!.phone
                                                  .toString() ==
                                              'null'
                                          ? ""
                                          : widget.userOrder!.phone.toString()),
                                    ),
                                    LabelItem(
                                      labelName: "Order date:",
                                      content: DateFormat('dd/MM/yyyy').format(
                                          DateTime.parse(
                                              widget.userOrder!.orderDate!)),
                                    ),
                                    LabelItem(
                                      labelName: "Shipping address:",
                                      content:
                                          widget.userOrder!.shippingAddress!,
                                    ),
                                    LabelItem(
                                      labelName: "Status:",
                                      content:
                                          widget.userOrder!.status.toString(),
                                    ),
                                    LabelItem(
                                      labelName: "Total Price:",
                                      content: formatCurrency
                                          .format(widget.userOrder!.totalPrice),
                                    ),

                                    const SizedBox(
                                      height: 10,
                                    ),
                                    const Divider(
                                      height: 1,
                                      thickness: 1,
                                      color: Colors.black,
                                    ),
                                    SingleChildScrollView(
                                      scrollDirection: Axis.horizontal, // Enable horizontal scrolling
                                      child: DataTable(
                                        columns: const [
                                          DataColumn(label: Text('Stt')),
                                          DataColumn(label: Text('Product name')),
                                          DataColumn(label: Text('Quantity')),
                                          DataColumn(label: Text('Price')),
                                          DataColumn(label: Text('Subtotal')),
                                        ],
                                        rows: widget.userOrder!.orderItems!.asMap().map((index, item) {
                                          return MapEntry(index, DataRow(cells: [
                                            DataCell(Text((index + 1).toString())), // Index starts from 0, so add 1 to show it correctly
                                            DataCell(Text(item.productName!)),
                                            DataCell(Text(item.quantity.toString())),  // Make sure quantity is a string or convert it
                                            DataCell(Text(formatCurrency.format(item.price))),    // Same here for price
                                            DataCell(Text(formatCurrency.format(item.subTotal))), // Same for subtotal
                                          ]));
                                        }).values.toList(), // Convert the Map values to a List of DataRow
                                      ),
                                    )

                                  ],
                                )),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              //BottomButton(buttonName: "Add to cart",price: widget.product!.price,quantity: _quantity,event: _addToCart,)
            ],
          )),
    );
  }
}
