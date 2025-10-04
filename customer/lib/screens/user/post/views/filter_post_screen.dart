import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:ecommerce_sem4/models/user/post-category/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/post-category/response/post_category_model.dart';
import 'package:ecommerce_sem4/screens/user/post/views/post_category_post_screen.dart';
import 'package:ecommerce_sem4/screens/user/product/views/components/list_title_radio_component.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/post-category/post_category_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';

class FilterPostScreen extends StatefulWidget {
  final bool isCheck;          // true: trả về id qua pop, false: mở màn danh sách
  final bool? isScreen;        // dùng chung logic cũ của bạn
  const FilterPostScreen({super.key, required this.isCheck, this.isScreen});

  @override
  State<StatefulWidget> createState() => _FilterPost();
}

class _FilterPost extends State<FilterPostScreen> {
  final searchApiPostCategory = postCategorySearchUri;

  String? accessToken = "";
  List<PostCategory> postCategories = [];

  Map<String, String> headers = <String, String>{};
  String? selectedValue = ""; // mặc định All
  String? postCategoryName = "All";

  final TextEditingController _keywordController = TextEditingController();
  final _scrollCtrl = ScrollController();

  bool _loading = true;

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadPostCategories();
  }

  Future<void> _loadPostCategories() async {
    try {
      if (mounted) setState(() => _loading = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final request = PostCategorySearchRequest(
        pageNumber: 1,
        pageSize: 100000,
        sortBy: "Id",
        sortDir: "desc",
      ).toMap();

      final data = await PostCategoryService()
          .search(searchApiPostCategory, headers, request);

      if (!mounted) return;
      setState(() {
        postCategories = data?.data ?? [];
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _applyFilter(BuildContext context, String selectedCategoryId) {
    Navigator.pop(context, selectedCategoryId);
  }

  void _applyFilterForSecondScreen() {
    final String keywordValue = _keywordController.text.trim();
    final String catId = (selectedValue ?? "");
    final String catName = (postCategoryName ?? "All");

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PostCategoryPostScreen(
          postCategoryId: catId,
          postCategoryName: catName,
          isCheckScreen: widget.isCheck,
          keyword: keywordValue.isEmpty ? null : keywordValue,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _keywordController.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // nền gradient đồng bộ app
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [
              kAccentDark.withOpacity(0.95),
              kAccentDark.withOpacity(0.86),
              kAccentDark.withOpacity(0.80),
            ],
          ),
        ),
        child: Column(
          children: [
            // AppBar custom kAccentDark
            SafeArea(
              bottom: false,
              child: Container(
                padding: const EdgeInsets.fromLTRB(12, 14, 12, 14),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Material(
                        color: Colors.white.withOpacity(0.18),
                        shape: const CircleBorder(),
                        child: InkWell(
                          customBorder: const CircleBorder(),
                          onTap: () => Navigator.pop(context),
                          child: const Padding(
                            padding: EdgeInsets.all(6),
                            child: Icon(Icons.close, size: 28, color: whiteColor),
                          ),
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 56),
                      child: Text(
                        "Filters",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: whiteColor,
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          letterSpacing: .2,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Panel trắng bo góc
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color: filterProductColor,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                  boxShadow: [
                    BoxShadow(
                      blurRadius: 18, offset: Offset(0, -4), color: Color(0x14000000),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    // Nội dung cuộn
                    Padding(
                      padding: const EdgeInsets.fromLTRB(12, 24, 12, 96),
                      child: CustomScrollView(
                        controller: _scrollCtrl,
                        physics: const BouncingScrollPhysics(),
                        slivers: [
                          SliverToBoxAdapter(child: _SearchField(controller: _keywordController)),
                          const SliverToBoxAdapter(child: SizedBox(height: 16)),
                          const SliverToBoxAdapter(
                            child: Padding(
                              padding: EdgeInsets.fromLTRB(10, 0, 0, 8),
                              child: Text(
                                "Post Categories",
                                style: TextStyle(
                                  color: Colors.black87,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                          ),

                          if (_loading)
                            SliverList.builder(
                              itemCount: 6,
                              itemBuilder: (_, __) => const _SkeletonRadio(),
                            )
                          else
                            SliverList(
                              delegate: SliverChildListDelegate.fixed([
                                // All
                                TitleRadion(
                                  name: "All",
                                  value: "",
                                  selectedValue: selectedValue,
                                  onChanged: (value) {
                                    setState(() {
                                      postCategoryName = "All";
                                      selectedValue = value;
                                    });
                                  },
                                ),
                                // Others
                                ...postCategories.map((category) {
                                  return TitleRadion(
                                    name: category.postCategoryName,
                                    value: category.id.toString(),
                                    selectedValue: selectedValue,
                                    onChanged: (value) {
                                      setState(() {
                                        postCategoryName = category.postCategoryName;
                                        selectedValue = value;
                                      });
                                    },
                                  );
                                }).toList(),
                                const SizedBox(height: 8),
                              ]),
                            ),
                        ],
                      ),
                    ),

                    // Nút Apply dính đáy
                    Positioned(
                      left: 0, right: 0, bottom: 0,
                      child: SafeArea(
                        top: false,
                        child: Container(
                          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                          decoration: BoxDecoration(
                            color: filterProductColor,
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x12000000),
                                blurRadius: 12,
                                offset: Offset(0, -2),
                              ),
                            ],
                          ),
                          child: SizedBox(
                            height: 56,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: kAccentDark,
                                foregroundColor: f4f4Color,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                elevation: 0,
                              ),
                              onPressed: () {
                                // Giữ logic cũ
                                if (widget.isCheck && (widget.isScreen ?? false)) {
                                  _applyFilter(context, selectedValue ?? "");
                                } else {
                                  _applyFilterForSecondScreen();
                                }
                              },
                              child: const Text(
                                'Apply Filter',
                                style: TextStyle(
                                  color: f4f4Color,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: .2,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Ô search “xịn” – bo mềm, icon, clear nhanh
class _SearchField extends StatefulWidget {
  final TextEditingController controller;
  const _SearchField({required this.controller});

  @override
  State<_SearchField> createState() => _SearchFieldState();
}

class _SearchFieldState extends State<_SearchField> {
  @override
  Widget build(BuildContext context) {
    final hasText = widget.controller.text.isNotEmpty;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE9ECF1)),
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(color: Color(0x0D000000), blurRadius: 8, offset: Offset(0, 3)),
        ],
      ),
      child: TextField(
        controller: widget.controller,
        onChanged: (_) => setState(() {}),
        textInputAction: TextInputAction.search,
        decoration: InputDecoration(
          hintText: "Search what you need…",
          hintStyle: const TextStyle(color: greyColor, fontSize: 13.5),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
          prefixIcon: const Padding(
            padding: EdgeInsets.only(left: 10, right: 6),
            child: Icon(Icons.search, color: Colors.grey, size: 22),
          ),
          prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
          suffixIcon: hasText
              ? IconButton(
            splashRadius: 18,
            icon: const Icon(Icons.close_rounded, color: Colors.grey, size: 20),
            onPressed: () {
              widget.controller.clear();
              setState(() {});
            },
          )
              : null,
        ),
      ),
    );
  }
}

/// Skeleton cho radio item (khi đang load)
class _SkeletonRadio extends StatelessWidget {
  const _SkeletonRadio();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(6, 4, 6, 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE9ECF1)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 18, height: 18,
            decoration: BoxDecoration(
              color: Colors.grey.shade200, shape: BoxShape.circle,
              border: Border.all(color: Colors.grey.shade300),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              height: 12,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(6),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
