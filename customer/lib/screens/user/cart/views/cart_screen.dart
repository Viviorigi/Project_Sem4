import 'package:ecommerce_sem4/models/user/cart/response/cart_list_response.dart';
import 'package:ecommerce_sem4/screens/user/cart/views/components/bottom_button_cart.dart';
import 'package:ecommerce_sem4/screens/user/cart/views/components/item_cart.dart';
import 'package:ecommerce_sem4/screens/user/onboarding/views/components/onboarding_dashed_line.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<StatefulWidget> createState() => _CartScreen();
}

class _CartScreen extends State<CartScreen> {
  String? accessToken = "";
  Map<String, String> headers = <String, String>{};
  List<CartListResponse> carts = [];
  String price = "0.0";
  final formatCurrency = NumberFormat.currency(locale: "vi_VN", symbol: "\₫");

  final TextEditingController _promoCtrl = TextEditingController();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadProducts();
  }

  @override
  void dispose() {
    _promoCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadProducts() async {
    try {
      if (mounted) setState(() => _loading = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");
      final userId = pref.getString("id");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final request = {"userId": userId};
      final data = await CartService().getCart(getCartUri, headers, request);

      if (!mounted) return;
      setState(() {
        carts = data ?? [];
      });
      _calculateTotal();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _removeItem(CartListResponse product, int index) async {
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");
    final userId = pref.getString("id");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final data = await CartService()
        .getCartIdByUserId(getCartByUserIdUri, headers, {"userId": userId});

    final requestRemoveItem = {
      "cartId": data["cartId"].toString(),
      "productId": product.productId.toString(),
    };

    final res =
    await CartService().removeItem(removeCartUri, headers, requestRemoveItem);

    if (res != null) {
      setState(() {
        carts.removeAt(index);
      });
      _calculateTotal();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Item removed from cart!"),
          behavior: SnackBarBehavior.floating,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  Future<void> _updateQuantity(CartListResponse product, int quantity) async {
    final pref = await SharedPreferences.getInstance();
    accessToken = pref.getString("accessToken");
    final userId = pref.getString("id");

    headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    final data = await CartService()
        .getCartIdByUserId(getCartByUserIdUri, headers, {"userId": userId});

    final req = {
      "cartId": data["cartId"].toString(),
      "productId": product.productId.toString(),
      "quantity": quantity.toString()
    };

    final res = await CartService().updateQuantity(updateQuantityUri, headers, req);
    if (res != null) {
      setState(() {
        product.quantity = quantity;
      });
      _calculateTotal();
    }
  }

  void _calculateTotal() {
    double total = 0.0;
    for (final e in carts) {
      total += (e.quantity * (e.price));
    }
    setState(() {
      price = total.toStringAsFixed(2);
    });
  }

  void _applyPromo() {
    final code = _promoCtrl.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text("Enter a promo code first."),
        behavior: SnackBarBehavior.floating,
        duration: Duration(seconds: 2),
      ));
      return;
    }
    // TODO: tích hợp API validate mã giảm giá ở đây
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text("Applied \"$code\" (demo)."),
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 2),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final totalPrice = double.tryParse(price) ?? 0.0;

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: kAccentDark,
          centerTitle: true,
          title: const Text("Cart", style: TextStyle(color: Colors.white)),
        ),
        body: Column(
          children: [
            // vùng danh sách
            Expanded(
              child: RefreshIndicator(
                onRefresh: _loadProducts,
                child: Container(
                  color: const Color(0xFFF4F4F4),
                  child: _loading
                      ? ListView.separated(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(10, 16, 10, 16),
                    itemCount: 4,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, __) => const _SkeletonCartItem(),
                  )
                      : (carts.isEmpty
                      ? const _EmptyCart()
                      : ListView.separated(
                    padding:
                    const EdgeInsets.fromLTRB(10, 16, 10, 16),
                    itemCount: carts.length + 1, // +1 cho card totals
                    separatorBuilder: (_, i) =>
                    const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      // phần items
                      if (index < carts.length) {
                        final cartItem = carts[index];
                        return ItemCart(
                          key: ValueKey('cart_$index'),
                          cartResponse: cartItem,
                          onDelete: () => _removeItem(cartItem, index),
                          onUpdateQuantity: (q) =>
                              _updateQuantity(cartItem, q),
                        );
                      }
                      // card Promo + totals
                      return _TotalsCard(
                        promoCtrl: _promoCtrl,
                        onApply: _applyPromo,
                        subTotal: formatCurrency.format(totalPrice),
                        delivery: "0",
                        discount: "0",
                        finalTotal:
                        formatCurrency.format(totalPrice),
                      );
                    },
                  )),
                ),
              ),
            ),

            // nút checkout fix đáy
            BottomButtonCart(
              buttonName: "Checkout",
              totalPrice: totalPrice,
              event: () {
                // TODO: điều hướng trang thanh toán
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// Card tổng hợp: promo + tổng tiền
class _TotalsCard extends StatelessWidget {
  final TextEditingController promoCtrl;
  final VoidCallback onApply;
  final String subTotal;
  final String delivery;
  final String discount;
  final String finalTotal;

  const _TotalsCard({
    required this.promoCtrl,
    required this.onApply,
    required this.subTotal,
    required this.delivery,
    required this.discount,
    required this.finalTotal,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          color: whiteColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE9ECF1)),
          boxShadow: const [
            BoxShadow(color: Color(0x14000000), blurRadius: 12, offset: Offset(0, 6)),
          ]),
      padding: const EdgeInsets.all(14),
      child: Column(
        children: [
          // promo field
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: promoCtrl,
                  textInputAction: TextInputAction.done,
                  decoration: InputDecoration(
                    hintText: "Apply promo code",
                    hintStyle: const TextStyle(color: Colors.black45),
                    filled: true,
                    fillColor: const Color(0xFFF9FAFB),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE9ECF1)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE9ECF1)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFBFC7FF)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: onApply,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kAccentDark,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    "Apply",
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // summary rows
          _row("Sub Total", subTotal),
          _row("Delivery charge", delivery),
          _row("Discount", discount),
          const SizedBox(height: 14),

          const OnBoardingDashedLine(
              width: 1000, color: Colors.blue, dashGap: 10, dashLength: 100),
          const SizedBox(height: 10),

          _row("Final Total", finalTotal, bold: true),
        ],
      ),
    );
  }

  Widget _row(String left, String right, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(left, style: const TextStyle(color: Colors.black54)),
          Text(
            right,
            style: TextStyle(
              color: Colors.black87,
              fontWeight: bold ? FontWeight.w800 : FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

/// Empty state đẹp
class _EmptyCart extends StatelessWidget {
  const _EmptyCart();

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        const SizedBox(height: 80),
        Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey.shade400),
        const SizedBox(height: 12),
        Text(
          "Your cart is empty",
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Colors.grey.shade700,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          "Pull down to refresh",
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Colors.grey.shade500,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 80),
      ],
    );
  }
}

/// Skeleton khi loading
class _SkeletonCartItem extends StatelessWidget {
  const _SkeletonCartItem();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 112,
      decoration: BoxDecoration(
        color: whiteColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE9ECF1)),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 88,
            height: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _bar(width: .9),
                const SizedBox(height: 8),
                _bar(width: .6),
                const Spacer(),
                Row(
                  children: [
                    _chip(),
                    const SizedBox(width: 8),
                    _chip(width: 50),
                  ],
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _bar({double width = .7}) => FractionallySizedBox(
    widthFactor: width,
    child: Container(
      height: 12,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(6),
      ),
    ),
  );

  Widget _chip({double width = 70}) => Container(
    width: width,
    height: 22,
    decoration: BoxDecoration(
      color: Colors.grey.shade200,
      borderRadius: BorderRadius.circular(50),
    ),
  );
}
