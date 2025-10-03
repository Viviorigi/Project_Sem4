import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:ecommerce_sem4/models/user/order/response/order_item_response.dart';
import 'package:ecommerce_sem4/screens/user/account/views/account_order_detail_screen.dart';
import 'package:ecommerce_sem4/utils/constants.dart';

class UserOrderItem extends StatelessWidget {
  final int orderId;
  final String orderDate;            // ISO string
  final double? totalPrice;
  final OrderItemResponse? orderUser;

  const UserOrderItem({
    super.key,
    required this.orderId,
    required this.orderDate,
    this.totalPrice,
    this.orderUser,
  });

  @override
  Widget build(BuildContext context) {
    final vnd = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
    final dateStr = _formatDate(orderDate);

    // Nếu backend có trường status thì hiện chip; nếu không có sẽ ẩn
    final status = orderUser?.status; // đổi theo model thực tế của bạn

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => UserOrderDetailScreen(userOrder: orderUser),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: kSurface,                               // nền card nhạt
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: kStroke),            // viền mảnh
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.04),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Row(
          children: [
            // Icon hoá đơn trong khung
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: kStroke),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.receipt_long_outlined, color: kAccentDark, size: 22),
            ),
            const SizedBox(width: 12),

            // Nội dung
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Dòng 1: mã đơn + chip trạng thái (nếu có)
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Order #$orderId',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: kInk,
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      if (status != null && status.toString().isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            border: Border.all(color: kStroke),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            status.toString(),
                            style: const TextStyle(
                              color: kMuted,
                              fontSize: 12.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Dòng 2: ngày đặt
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 14, color: kMuted),
                      const SizedBox(width: 6),
                      Text(
                        dateStr,
                        style: const TextStyle(
                          color: kMuted,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // Dòng 3: tổng tiền
                  Text(
                    'Total: ${vnd.format(totalPrice ?? 0)}',
                    style: const TextStyle(
                      color: kAccentDark,
                      fontSize: 15.5,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            // Mũi tên điều hướng
            const Icon(Icons.chevron_right, color: kMuted),
          ],
        ),
      ),
    );
  }

  String _formatDate(String input) {
    try {
      final d = DateTime.parse(input);
      return DateFormat('dd/MM/yyyy').format(d);
    } catch (_) {
      return input; // fallback nếu parse lỗi
    }
  }
}
