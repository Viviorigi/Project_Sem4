import 'package:ecommerce_sem4/models/user/post/request/search_request.dart';
import 'package:ecommerce_sem4/models/user/post/response/post_model.dart';
import 'package:ecommerce_sem4/screens/user/explore/views/shop_screen.dart';
import 'package:ecommerce_sem4/screens/user/post-category/views/post_category_screen.dart';
import 'package:ecommerce_sem4/screens/user/post/views/components/post_item_component.dart';
import 'package:ecommerce_sem4/screens/user/post/views/filter_post_screen.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/post/post_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'post_detail_screen.dart';

class PostCategoryPostScreen extends StatefulWidget {
  final String postCategoryId;
  final String postCategoryName;
  bool? isCheckScreen;
  final String? keyword;
  PostCategoryPostScreen({
    super.key,
    required this.postCategoryId,
    required this.postCategoryName,
    this.isCheckScreen,
    this.keyword,
  });

  @override
  State<StatefulWidget> createState() => _PostCategoryPost();
}

class _PostCategoryPost extends State<PostCategoryPostScreen> {
  final searchApiPost = postSearchUri;
  List<Post> posts = [];
  String? accessToken = "";
  Map<String, String> headers = <String, String>{};
  final formatCurrency = NumberFormat.currency(locale: "en_US", symbol: "\$");
  final imageUrl = "http://10.0.2.2:5069/images/";
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
    _loadPost();
  }

  Future<void> _loadPost() async {
    try {
      setState(() => _loading = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      Map<String, Object?> request = PostSearchRequest(
        pageNumber: 1,
        pageSize: 10000,
        sortBy: "Id",
        sortDir: "asc",
        postCategoryId: widget.postCategoryId,
        keyword: widget.keyword,
      ).toMap();

      final data = await PostService().search(searchApiPost, headers, request);

      setState(() {
        posts = data?.data ?? [];
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isExplore = widget.isCheckScreen ?? false;

    return SafeArea(
      child: Scaffold(
        body: Container(
          // nền gradient xịn
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
              // AppBar custom
              Container(
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
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                  isExplore ? const ExploreScreen() : const PostCategoryScreen(),
                                ),
                              );
                            },
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
                          widget.postCategoryName,
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
                      Align(
                        alignment: Alignment.centerRight,
                        child: Material(
                          color: Colors.white.withOpacity(0.18),
                          shape: const CircleBorder(),
                          child: InkWell(
                            customBorder: const CircleBorder(),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => FilterPostScreen(
                                    isCheck: isExplore,
                                    isScreen: false,
                                  ),
                                ),
                              );
                            },
                            child: const Padding(
                              padding: EdgeInsets.all(6),
                              child: Icon(Icons.filter_list,
                                  size: 28, color: whiteColor),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Body trắng bo góc
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
                    onRefresh: _loadPost,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      child: _loading
                          ? const _LoadingList()
                          : (posts.isEmpty
                          ? const _EmptyState()
                          : ListView.separated(
                        padding:
                        const EdgeInsets.fromLTRB(12, 16, 12, 16),
                        itemCount: posts.length,
                        separatorBuilder: (_, __) =>
                        const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final post = posts[index];

                          // ⬇⬇⬇ FIX: Bọc PostItem để điều hướng sang PostDetailScreen
                          return Card(
                            elevation: 1.5,
                            shadowColor: Colors.black12,
                            margin: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(16),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => PostDetailScreen(post: post),
                                  ),
                                );
                              },
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 6, horizontal: 6),
                                child: PostItem(
                                  image: post.image,
                                  name: post.title,
                                  description: post.description,
                                  post: post,
                                ),
                              ),
                            ),
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

class _LoadingList extends StatelessWidget {
  const _LoadingList();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 16),
      itemCount: 6,
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
      height: 96,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200, width: 1),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 84,
            height: 84,
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
                _bar(),
                const SizedBox(height: 8),
                _bar(width: 1),
                const SizedBox(height: 6),
                _bar(width: 0.75),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _bar({double width = 0.6}) => FractionallySizedBox(
    widthFactor: width,
    child: Container(
      height: 12,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  );
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        const SizedBox(height: 64),
        Icon(Icons.article_outlined, size: 64, color: Colors.grey.shade400),
        const SizedBox(height: 12),
        Text(
          'Chưa có bài viết nào',
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
