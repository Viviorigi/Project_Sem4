import 'package:ecommerce_sem4/models/user/post-category/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/post-category/response/post_category_model.dart';
import 'package:ecommerce_sem4/screens/user/layout/views/layout_screen.dart';
import 'package:ecommerce_sem4/screens/user/post-category/views/components/post_category_item_component.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/post-category/post_category_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PostCategoryScreen extends StatefulWidget {
  const PostCategoryScreen({super.key});

  @override
  State<StatefulWidget> createState() => _PostCategoryList();
}

class _PostCategoryList extends State<PostCategoryScreen> {
  final searchApiPostCategory = postCategorySearchUri;
  List<PostCategory> postCategories = [];
  Map<String, String> headers = <String, String>{};
  String? accessToken = "";
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadPostCategories();
  }

  Future<void> _loadPostCategories() async {
    try {
      setState(() => _loading = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final request = PostCategorySearchRequest(
        pageNumber: 1,
        pageSize: 10000000,
        sortBy: "Id",
        sortDir: "asc",
      ).toMap();

      final data =
      await PostCategoryService().search(searchApiPostCategory, headers, request);

      setState(() {
        postCategories = data?.data ?? [];
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Container(
          // nền gradient đồng bộ brand
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                greenBgColor.withOpacity(0.95),
                greenBgColor.withOpacity(0.86),
                greenBgColor.withOpacity(0.80),
              ],
            ),
          ),
          child: Column(
            children: [
              _FancyAppBar(
                title: "List Post Category",
                onBack: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const LayoutScreen()),
                  );
                },
              ),
              // body trắng bo góc tách bạch
              Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    boxShadow: [
                      BoxShadow(
                        blurRadius: 18,
                        offset: Offset(0, -4),
                        color: Color(0x14000000),
                      ),
                    ],
                  ),
                  child: RefreshIndicator(
                    onRefresh: _loadPostCategories,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      switchInCurve: Curves.easeOut,
                      switchOutCurve: Curves.easeIn,
                      child: _loading
                          ? const _LoadingList()
                          : (postCategories.isEmpty
                          ? const _EmptyState()
                          : ListView.separated(
                        padding:
                        const EdgeInsets.fromLTRB(12, 16, 12, 16),
                        itemCount: postCategories.length,
                        separatorBuilder: (_, __) =>
                        const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final item = postCategories[index];
                          return PostCategoryItem(
                            name: item.postCategoryName,
                            postCategoryId: item.id,
                          );
                        },
                      )),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FancyAppBar extends StatelessWidget {
  final String title;
  final VoidCallback onBack;
  const _FancyAppBar({required this.title, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 14, 12, 14),
      child: SafeArea(
        bottom: false,
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
                  onTap: onBack,
                  child: const Padding(
                    padding: EdgeInsets.all(6),
                    child: Icon(Icons.keyboard_arrow_left,
                        size: 28, color: whiteColor),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 56),
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: whiteColor,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LoadingList extends StatelessWidget {
  const _LoadingList();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 16),
      itemCount: 8,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, __) => const _SkeletonCard(),
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 88,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200, width: 1),
      ),
      child: Row(
        children: [
          const SizedBox(width: 14),
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Container(
              height: 12,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
          const SizedBox(width: 14),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        const SizedBox(height: 64),
        Icon(Icons.category_outlined, size: 64, color: Colors.grey.shade400),
        const SizedBox(height: 12),
        Text(
          'Chưa có danh mục bài viết',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Colors.grey.shade700,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Kéo xuống để làm mới',
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
