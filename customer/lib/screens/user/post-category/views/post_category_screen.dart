import 'dart:math';
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
      if (mounted) setState(() => _loading = true);

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

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final useGrid = width >= 680; // rộng thì 2 cột

    return Scaffold(
      backgroundColor: Colors.white, // nền tối phía sau để đồng bộ app
      body: RefreshIndicator(
        onRefresh: _loadPostCategories,
        edgeOffset: 80,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
          slivers: [
            // AppBar màu kAccentDark đồng bộ
            SliverAppBar(
              pinned: true,
              elevation: 0,
              backgroundColor: kAccentDark,
              leading: Padding(
                padding: const EdgeInsets.only(left: 6),
                child: Material(
                  color: Colors.white.withOpacity(0.18),
                  shape: const CircleBorder(),
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LayoutScreen()),
                      );
                    },
                    child: const Padding(
                      padding: EdgeInsets.all(6),
                      child: Icon(Icons.keyboard_arrow_left, color: Colors.white, size: 28),
                    ),
                  ),
                ),
              ),
              title: const Text(
                "List Post Category",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  letterSpacing: .2,
                ),
              ),
            ),

            // bo góc trắng ở phần thân
            SliverToBoxAdapter(
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
              ),
            ),
            const SliverPadding(padding: EdgeInsets.only(top: 12)),

            // nội dung: dùng sliver để không crash scroll
            if (_loading)
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                sliver: SliverList.separated(
                  itemCount: 8,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, __) => const _SkeletonCard(),
                ),
              )
            else if (postCategories.isEmpty)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                      style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                    ),
                    const SizedBox(height: 80),
                  ],
                ),
              )
            else if (useGrid)
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 2.6,
                    ),
                    delegate: SliverChildBuilderDelegate(
                          (context, i) {
                        final item = postCategories[i];
                        return PostCategoryItem(
                          name: item.postCategoryName ?? '',
                          postCategoryId: item.id,
                        );
                      },
                      childCount: postCategories.length,
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  sliver: SliverList.separated(
                    itemCount: postCategories.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, i) {
                      final item = postCategories[i];
                      return PostCategoryItem(
                        name: item.postCategoryName ?? '',
                        postCategoryId: item.id,
                      );
                    },
                  ),
                ),
          ],
        ),
      ),
    );
  }
}

// Skeleton sáng gọn
class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard();

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: const Duration(milliseconds: 900),
      curve: Curves.easeInOut,
      builder: (context, t, _) {
        final mix = Color.lerp(
          Colors.grey.shade100,
          Colors.grey.shade300,
          0.5 + 0.5 * sin(t * pi),
        )!;
        return Container(
          height: 80,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE9ECF1), width: 1),
          ),
          child: Row(
            children: [
              Container(
                width: 6,
                height: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
                ),
              ),
              const SizedBox(width: 14),
              Container(width: 44, height: 44, decoration: BoxDecoration(color: mix, shape: BoxShape.circle)),
              const SizedBox(width: 14),
              Expanded(
                child: Container(height: 14, decoration: BoxDecoration(color: mix, borderRadius: BorderRadius.circular(8))),
              ),
              const SizedBox(width: 14),
            ],
          ),
        );
      },
    );
  }
}
