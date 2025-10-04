import 'dart:ui';
import 'package:ecommerce_sem4/models/user/post/response/post_detail_response.dart';
import 'package:ecommerce_sem4/models/user/post/response/post_model.dart';
import 'package:ecommerce_sem4/screens/user/post/views/components/post_answer_comment_component.dart';
import 'package:ecommerce_sem4/screens/user/post/views/components/post_form_comment_component.dart';
import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../services/user/post/post_service.dart';

class PostDetailScreen extends StatefulWidget {
  final Post? post;
  const PostDetailScreen({super.key, required this.post});

  @override
  State<StatefulWidget> createState() => _PostDetail();
}

class _PostDetail extends State<PostDetailScreen> {
  final postDetailUriapi = postDetailUri;
  PostDetailResponse? commentsResp;
  String? accessToken = "";
  Map<String, String> headers = <String, String>{};
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
      if (mounted) setState(() => _loading = true);
      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final data = await PostService()
          .detail("$postDetailUriapi/${widget.post!.id}", headers);

      if (mounted) {
        setState(() {
          commentsResp = data;
        });
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  // -------- Helpers --------
  String stripHtml(String? htmlText) {
    if (htmlText == null) return "";
    return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
  }

  String formatCreatedAt(dynamic createdAt) {
    // Định dạng: HH:mm dd/MM/yyyy
    try {
      DateTime dt;
      if (createdAt is DateTime) {
        dt = createdAt;
      } else {
        dt = DateTime.parse(createdAt.toString());
      }
      String two(int v) => v.toString().padLeft(2, '0');
      return "${two(dt.hour)}:${two(dt.minute)} ${two(dt.day)}/${two(dt.month)}/${dt.year}";
    } catch (_) {
      return "";
    }
  }

  int get commentsCount => commentsResp?.comments?.length ?? 0;

  @override
  Widget build(BuildContext context) {
    final p = widget.post!;
    final createdAtText = formatCreatedAt(p.createdAt);

    return Scaffold(
      backgroundColor: Colors.white, // nền trắng
      body: RefreshIndicator(
        onRefresh: _loadPost,
        edgeOffset: 80,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
          slivers: [
            // AppBar + Cover
            SliverAppBar(
              pinned: true,
              stretch: true,
              elevation: 0,
              backgroundColor: Colors.black, // để khi co lại có transition mượt trên ảnh
              leading: Padding(
                padding: const EdgeInsets.only(left: 6),
                child: Material(
                  color: Colors.white.withOpacity(0.16),
                  shape: const CircleBorder(),
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: () => Navigator.pop(context),
                    child: const Padding(
                      padding: EdgeInsets.all(6),
                      child: Icon(Icons.keyboard_arrow_left, color: whiteColor, size: 28),
                    ),
                  ),
                ),
              ),
              expandedHeight: 340,
              flexibleSpace: FlexibleSpaceBar(
                stretchModes: const [StretchMode.zoomBackground, StretchMode.fadeTitle],
                titlePadding: EdgeInsets.zero,
                title: const SizedBox.shrink(), // không dùng title mặc định
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Ảnh cover
                    Image.network(
                      '$imageUrl${p.image}',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          Image.asset("assets/user/images/slide1.jpg", fit: BoxFit.cover),
                      loadingBuilder: (context, child, progress) {
                        if (progress == null) return child;
                        return Container(color: Colors.grey.shade300);
                      },
                    ),
                    // Gradient tối dưới để nổi chữ
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Colors.transparent, Colors.transparent, Colors.black54],
                        ),
                      ),
                    ),
                    // Tiêu đề ở GIỮA ảnh (font 36) + thời gian bên dưới
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              p.title,
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 36, // yêu cầu
                                fontWeight: FontWeight.w800,
                                height: 1.15,
                                letterSpacing: .2,
                                shadows: [Shadow(blurRadius: 6, color: Colors.black54)],
                              ),
                            ),
                            const SizedBox(height: 8),
                            if (createdAtText.isNotEmpty)
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.access_time, size: 16, color: Colors.white70),
                                  const SizedBox(width: 6),
                                  Text(
                                    createdAtText,
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Thân trang bo góc trắng
            SliverToBoxAdapter(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  boxShadow: [
                    BoxShadow(blurRadius: 18, offset: Offset(0, -4), color: Color(0x14000000)),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Meta (comment count)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: Row(
                          children: [
                            const Icon(Icons.comment, size: 18, color: Colors.black54),
                            const SizedBox(width: 6),
                            Text(
                              '$commentsCount bình luận',
                              style: const TextStyle(color: Colors.black54, fontSize: 13.5),
                            ),
                          ],
                        ),
                      ),
                      const _DividerInset(),

                      // Description
                      const _SectionHeader(title: "Description"),
                      _SectionBody(text: stripHtml(p.description)),
                      const _DividerInset(),

                      // Content
                      const _SectionHeader(title: "Content"),
                      _SectionBody(text: stripHtml(p.content)),

                      // Ngăn cách rõ ràng với comments
                      const _DividerInset(),
                      const _SectionHeader(title: "Comments"),

                      // ĐƯA FORM LÊN TRÊN danh sách comment
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                        child: FormCommentPost(postId: p.id.toString()),
                      ),

                      // Danh sách comment (luôn ở CUỐI trang)
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 220),
                        child: _loading
                            ? const Padding(
                          key: ValueKey('loading'),
                          padding: EdgeInsets.all(16),
                          child: Center(child: CircularProgressIndicator()),
                        )
                            : Padding(
                          key: const ValueKey('loaded'),
                          padding: const EdgeInsets.only(top: 6),
                          child: Column(
                            children: [
                              ...((commentsResp?.comments) ?? [])
                                  .map((entry) => AnswerComment(
                                accountName: entry.account.userName ?? "User",
                                content: entry.content ?? "",
                                createdAt: entry.createdAt,
                                avatar: entry.account.avatar,
                              ))
                                  .toList(),
                            ],
                          ),
                        ),
                      ),

                      const SafeArea(top: false, child: SizedBox(height: 18)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// -------- Reusable UI parts --------
class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Text(
        title,
        style: TextStyle(
          color: Colors.grey.shade900,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.2,
        ),
      ),
    );
  }
}

class _SectionBody extends StatelessWidget {
  final String text;
  const _SectionBody({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
      child: Text(
        text,
        style: const TextStyle(color: Colors.black87, fontSize: 14.8, height: 1.55),
      ),
    );
  }
}

class _DividerInset extends StatelessWidget {
  const _DividerInset();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Divider(color: Color(0xFFE6E6E6), height: 28, thickness: 1),
    );
  }
}
