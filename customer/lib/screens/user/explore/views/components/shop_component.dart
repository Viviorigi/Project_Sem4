import 'package:ecommerce_sem4/models/user/category/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/category/response/category_model.dart';
import 'package:ecommerce_sem4/screens/user/explore/views/search_screen.dart';
import 'package:ecommerce_sem4/screens/user/product/views/category_product_screen.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/category/category_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ShopComponent extends StatefulWidget {
  const ShopComponent({super.key});
  @override
  State<ShopComponent> createState() => _ShopComponentState();
}

class _ShopComponentState extends State<ShopComponent> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocus = FocusNode();

  String? accessToken = "";
  final searchApiCategory = categorySearchUri;
  List<Category> categories = [];
  Map<String, String> headers = <String, String>{};
  bool _loading = true;

  // 5 ảnh – map theo index % 5 để cố định và đồng bộ
  static const _cateImgs = <String>[
    "assets/user/images/category_1.png",
    "assets/user/images/category_2.png",
    "assets/user/images/category_3.png",
    "assets/user/images/category_4.png",
    "assets/user/images/category_5.png",
  ];

  // gradient pastel cho card
  static const _gradients = <List<Color>>[
    [Color(0xFFFFF8E1), Color(0xFFFFECB3)], // warm yellow
    [Color(0xFFFFF1F6), Color(0xFFFFD6E8)], // soft pink
    [Color(0xFFE8F3FF), Color(0xFFCFE8FF)], // baby blue
    [Color(0xFFEFFAF3), Color(0xFFD9F5E7)], // mint
    [Color(0xFFF3F0FF), Color(0xFFE9E3FF)], // lavender
  ];

  // viền ngoài
  static const _strokes = <Color>[
    Color(0xFFFFE082),
    Color(0xFFFFB3C0),
    Color(0xFF9EC8FF),
    Color(0xFF9FE4C2),
    Color(0xFFC0B6FF),
  ];

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    try {
      setState(() => _loading = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");
      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final request = CategorySearchRequest(
        pageNumber: 1,
        pageSize: 10000000,
        sortBy: "Id",
        sortDir: "asc",
      ).toMap();

      final data =
      await CategoryService().search(searchApiCategory, headers, request);

      setState(() {
        categories = data?.data ?? [];
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _goSearch() {
    final kw = _searchController.text.trim();
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => SearchScreen(keyword: kw)),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // nền sáng nhẹ cho toàn trang
    return RefreshIndicator(
      onRefresh: _loadCategories,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFF7F8FC), Color(0xFFF9FAFB)],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 14, 12, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
               

                // Search pill đẹp hơn
                Material(
                  elevation: 3,
                  borderRadius: BorderRadius.circular(14),
                  shadowColor: Colors.black12,
                  child: TextField(
                    controller: _searchController,
                    focusNode: _searchFocus,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _goSearch(),
                    decoration: InputDecoration(
                      hintText: "Search what you need…",
                      hintStyle:
                      TextStyle(color: Colors.grey.shade500, fontSize: 14),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding:
                      const EdgeInsets.symmetric(vertical: 14, horizontal: 14),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide:
                        const BorderSide(color: borderInput, width: 1),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide:
                        const BorderSide(color: borderInput, width: 1.2),
                      ),
                      prefixIcon:
                      const Icon(Icons.search_rounded, color: Colors.grey),
                      suffixIcon: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (_searchController.text.isNotEmpty)
                            IconButton(
                              tooltip: 'Clear',
                              splashRadius: 18,
                              icon: const Icon(Icons.close_rounded,
                                  color: Colors.grey),
                              onPressed: () {
                                _searchController.clear();
                                setState(() {}); // cập nhật suffix
                                _searchFocus.requestFocus();
                              },
                            ),
                          const SizedBox(width: 2),
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ElevatedButton(
                              onPressed: _goSearch,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: kAccentDark,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: const Text(
                                "Search",
                                style: TextStyle(fontWeight: FontWeight.w700),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    onChanged: (_) => setState(() {}),
                  ),
                ),

                const SizedBox(height: 16),

                // Nội dung
                if (_loading)
                  const Padding(
                    padding: EdgeInsets.all(24),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (categories.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        Icon(Icons.category_outlined,
                            size: 56, color: Colors.grey.shade400),
                        const SizedBox(height: 8),
                        Text(
                          "Chưa có danh mục",
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  GridView.builder(
                    itemCount: categories.length,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 8),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 0.95,
                    ),
                    itemBuilder: (context, index) {
                      final c = categories[index];
                      final styleIdx = index % _cateImgs.length;
                      return _CategoryCard(
                        title: c.categoryName,
                        imageAsset: _cateImgs[styleIdx],
                        gradient: _gradients[styleIdx],
                        stroke: _strokes[styleIdx],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CategoryProductScreen(
                                categoryId: c.id.toString(),
                                categoryName: c.categoryName,
                                isCheckScreen: true,
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Card danh mục: gradient pastel + tile ảnh trắng nổi + chữ đậm
class _CategoryCard extends StatelessWidget {
  final String title;
  final String imageAsset;
  final List<Color> gradient;
  final Color stroke;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.title,
    required this.imageAsset,
    required this.gradient,
    required this.stroke,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: gradient,
            ),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: stroke.withOpacity(.55), width: 1),
            boxShadow: const [
              BoxShadow(
                color: Color(0x14000000),
                blurRadius: 12,
                offset: Offset(0, 6),
              ),
            ],
          ),
          padding: const EdgeInsets.fromLTRB(12, 14, 12, 12),
          child: Column(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(
                        color: Colors.white.withOpacity(.65),
                        width: 1,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x12000000),
                          blurRadius: 10,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Image.asset(imageAsset, fit: BoxFit.contain),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 15.5,
                  color: Colors.black87,
                  letterSpacing: .1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
