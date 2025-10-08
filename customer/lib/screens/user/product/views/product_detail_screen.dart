import 'package:ecommerce_sem4/models/user/cart/request/add_cart_request.dart';
import 'package:ecommerce_sem4/models/user/product/response/product_model.dart';
import 'package:ecommerce_sem4/screens/user/product/views/components/bottom_button.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/cart/cart_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product? product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<StatefulWidget> createState() => _ProductDetail();
}

class _ProductDetail extends State<ProductDetailScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _quantity = 1;
  final formatCurrency =
  NumberFormat.currency(locale: "vi_Vn", symbol: "\₫");
  final String cartPost = cartAddUri;
  final imageUrl = "http://10.0.2.2:5069/images/";

  Future<void> _addToCart() async {
    final pref = await SharedPreferences.getInstance();
    String? userId = pref.getString("id");
    String? accessToken = pref.getString("accessToken");

    Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $accessToken',
    };

    Map<String, Object?> request = CartRequest(
      userId: userId!,
      productId: widget.product!.id.toString(),
      quantity: _searchController.text,
      price: widget.product!.price.toString(),
    ).toMap();

    final data = await CartService().addToCart(cartPost, headers, request);

    if (data != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Item has been added to the cart successfully!"),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _searchController.text = _quantity.toString();
  }

  void _incrementQuantity() {
    setState(() {
      _quantity++;
      _searchController.text = _quantity.toString();
    });
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
        _searchController.text = _quantity.toString();
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
          appBar: AppBar(
            backgroundColor: greenBgColor,
            automaticallyImplyLeading: true,
            foregroundColor: whiteColor,
            title: const Text("Product detail"),
          ),
          body: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// ROW CHÍNH: ẢNH TRÁI - THÔNG TIN PHẢI
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      /// ẢNH (40%)
                      Expanded(
                        flex: 6,
                        child: AspectRatio(
                          aspectRatio: 1, // Vuông, hiển thị to rõ
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              '$imageUrl${widget.product?.image}',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Image.asset(
                                  "assets/user/images/slide1.jpg",
                                  fit: BoxFit.cover,
                                );
                              },
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(width: 12),

                      /// THÔNG TIN + NÚT ADD (60%)
                      Expanded(
                        flex: 6,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            /// Tên + tim
                            Row(
                              mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    widget.product!.productName,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 22,
                                        color: Colors.black87),
                                  ),
                                ),
                                IconButton(
                                  onPressed: () {},
                                  icon: const Icon(Icons.favorite_border),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            /// Giá
                            Text(
                              formatCurrency.format(widget.product!.price),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 10),

                            /// Chọn số lượng
                            Row(
                              children: [
                                IconButton(
                                  onPressed: _decrementQuantity,
                                  icon: const Icon(Icons.remove),
                                  padding: EdgeInsets.zero,
                                ),
                                SizedBox(
                                  width: 50,
                                  child: TextFormField(
                                    controller: _searchController,
                                    textAlign: TextAlign.center,
                                    keyboardType: TextInputType.number,
                                    decoration: InputDecoration(
                                      border: OutlineInputBorder(
                                        borderRadius:
                                        BorderRadius.circular(20.0),
                                      ),
                                    ),
                                    onChanged: (value) {
                                      setState(() {
                                        _quantity =
                                            int.tryParse(value) ?? 1;
                                      });
                                    },
                                  ),
                                ),
                                IconButton(
                                  onPressed: _incrementQuantity,
                                  icon: const Icon(Icons.add),
                                  color: greenBgColor,
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),

                            /// Nút Add to Cart (loại nhỏ)
                            SizedBox(
                              height: 40,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: greenBgColor,
                                  foregroundColor: Colors.white,
                                ),
                                onPressed: _addToCart,
                                child: const Text("Add to Cart"),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Divider(color: Colors.grey),

                  /// MÔ TẢ
                  const SizedBox(height: 10),
                  const Text(
                    "Description",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0), // lề trái/phải gọn
                    child: Text(
                      prettyDescription(widget.product?.description),
                      style: const TextStyle(
                        fontSize: 15,
                        color: Colors.black87,
                        height: 1.5, // giãn dòng ổn định
                      ),
                      textAlign: TextAlign.left,
                      softWrap: true,
                      // Giúp line-height phân bổ đều giữa các thiết bị/phông
                      textHeightBehavior: const TextHeightBehavior(
                        leadingDistribution: TextLeadingDistribution.even,
                      ),
                      // Strut cố định chiều cao dòng -> tránh “lộn xộn” giữa các ký tự/bullet
                      strutStyle: const StrutStyle(
                        fontSize: 15,
                        height: 1.5,
                        leading: 0.0,
                        forceStrutHeight: true,
                      ),
                    ),
                  ),

                ],
              ),
            ),
          )),
    );
  }
}

String prettyDescription(String? raw) {
  if (raw == null || raw.trim().isEmpty) {
    return "No description available.";
  }

  // 1) Chuẩn hoá xuống dòng từ HTML
  String s = raw
      .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
      .replaceAll(RegExp(r'</p\s*>', caseSensitive: false), '\n')
      .replaceAll(RegExp(r'<li[^>]*>', caseSensitive: false), '\n• ')
      .replaceAll(RegExp(r'</li\s*>', caseSensitive: false), '');

  // 2) Bỏ các tag còn lại
  s = s.replaceAll(RegExp(r'<[^>]+>'), '');

  // 3) Decode vài entity hay gặp
  s = s
      .replaceAll('&nbsp;', ' ')
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>');

  // 4) Tách dòng, trim, bỏ dòng rỗng thừa
  final lines = s
      .split('\n')
      .map((e) => e.trim())
      .where((e) => e.isNotEmpty)
      .toList();

  // 5) Thêm bullet & thụt dòng cho dòng “phụ”
  // Quy ước: dòng chứa ":" (như "Màn hình:") coi là mục chính (•),
  // còn lại coi là chi tiết (◦) và thụt vào.
  final out = <String>[];
  final headingRegex = RegExp(r'^[A-Za-zÀ-ỹ0-9].*?:'); // có nhãn kèm dấu ':'
  for (final line in lines) {
    if (headingRegex.hasMatch(line)) {
      out.add('• $line');
    } else {
      out.add('  ◦ $line');
    }
  }

  return out.join('\n');
}


String stripHtml(String? htmlText) {
  if (htmlText == null) return "";
  return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
}
