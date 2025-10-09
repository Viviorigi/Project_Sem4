import 'package:ecommerce_sem4/models/user/cart/response/cart_list_response.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ItemCart extends StatefulWidget {
  final CartListResponse? cartResponse;
  final VoidCallback? onDelete;
  final Function(int quantity)? onUpdateQuantity;

  const ItemCart({
    super.key,
    required this.cartResponse,
    this.onDelete,
    this.onUpdateQuantity,
  });

  @override
  State<ItemCart> createState() => _ItemCartState();
}

class _ItemCartState extends State<ItemCart> {
  final String imageUrl = "http://10.0.2.2:5069/images/";
  late final NumberFormat _currency =
  NumberFormat.currency(locale: "vi_VN", symbol: "\₫");

  late int _quantity;

  @override
  void initState() {
    super.initState();
    final q = widget.cartResponse?.quantity ?? 1;
    _quantity = q < 1 ? 1 : q;
  }

  void _decrement() {
    if (_quantity <= 1) return;
    setState(() => _quantity--);
    widget.onUpdateQuantity?.call(_quantity);
  }

  void _increment() {
    setState(() => _quantity++);
    widget.onUpdateQuantity?.call(_quantity);
  }

  void _remove() => widget.onDelete?.call();

  @override
  Widget build(BuildContext context) {
    final item = widget.cartResponse;
    final name = item?.product.productName ?? 'Product';
    final type = item?.product.category?.categoryName
        ?? item?.product.category?.categoryName        // nếu model flatten
        ?? item?.product.category?.slug      // dự phòng khác nếu có
        ?? 'SmartPhone';
    final price = item?.product.price ?? 0.0;
    final img = (item?.product.image ?? '').trim();

    const borderLavender = Color(0xFFE6E0FF);
    const shadowColor = Color(0x14000000);

    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: borderLavender, width: 1),
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: shadowColor, blurRadius: 12, offset: Offset(0, 6)),
        ],
      ),
      child: Stack(
        children: [
          // nội dung chính
          Row(
            children: [
              // Thumbnail
              Container(
                width: 110,
                height: double.infinity,
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: borderLavender),
                  color: const Color(0xFFF3F2F8),
                ),
                clipBehavior: Clip.antiAlias,
                child: (img.isNotEmpty &&
                    !img.toLowerCase().contains('null') &&
                    !img.toLowerCase().contains('undefined'))
                    ? Image.network(
                  '$imageUrl$img',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Image.asset(
                    "assets/user/images/category_5.png",
                    fit: BoxFit.cover,
                  ),
                  loadingBuilder: (context, child, progress) {
                    if (progress == null) return child;
                    return Container(color: Colors.grey.shade200);
                  },
                )
                    : Image.asset(
                  "assets/user/images/category_5.png",
                  fit: BoxFit.cover,
                ),
              ),

              // Texts & stepper
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(0, 12, 12, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tên sp
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.black87,
                          fontSize: 16.5,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                          letterSpacing: .2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      // Loại
                      Text(
                        type,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),

                      // Giá + Stepper
                      Row(
                        children: [
                          // Giá
                          Text(
                            _currency.format(price),
                            style: const TextStyle(
                              color: kAccentDark,
                              fontWeight: FontWeight.w800,
                              fontSize: 16,
                            ),
                          ),
                          const Spacer(),
                          // Stepper “pill”
                          _QtyPill(
                            value: _quantity,
                            onMinus: _decrement,
                            onPlus: _increment,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // nút xóa góc phải
          Positioned(
            top: 6,
            right: 6,
            child: Material(
              color: Colors.white,
              shape: const CircleBorder(),
              elevation: 1,
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: _remove,
                child: const Padding(
                  padding: EdgeInsets.all(6),
                  child: Icon(Icons.close_rounded, size: 16, color: Colors.grey),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Stepper số lượng dạng “pill”
class _QtyPill extends StatelessWidget {
  final int value;
  final VoidCallback onMinus;
  final VoidCallback onPlus;

  const _QtyPill({
    required this.value,
    required this.onMinus,
    required this.onPlus,
  });

  @override
  Widget build(BuildContext context) {
    const border = Color(0xFFE9ECF1);

    return Container(
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        border: Border.all(color: border),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _circleBtn(icon: Icons.remove, onTap: onMinus),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Text(
              '$value',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: Colors.black87,
              ),
            ),
          ),
          _circleBtn(icon: Icons.add, onTap: onPlus),
        ],
      ),
    );
  }

  Widget _circleBtn({required IconData icon, required VoidCallback onTap}) {
    return Material(
      color: Colors.white,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(4),
          child: Icon(icon, size: 18, color: kAccentDark),
        ),
      ),
    );
  }
}
