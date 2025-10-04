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
    if (createdAt == null) return "";
    if (createdAt is DateTime) {
      final d = createdAt;
      String two(int v) => v.toString().padLeft(2, '0');
      return "${two(d.day)}/${two(d.month)}/${d.year} ${two(d.hour)}:${two(d.minute)}";
    }
    // nếu backend trả String
    return createdAt.toString();
  }

  int get commentsCount => commentsResp?.comments?.length ?? 0;

  @override
  Widget build(BuildContext context) {
    final p = widget.post!;
    return Scaffold(
      backgroundColor: kAccentDark,
      body: RefreshIndicator(
        onRefresh: _loadPost,
        edgeOffset: 80,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
          slivers: [
            // Sliver AppBar hiện đại
            SliverAppBar(
              pinned: true,
              stretch: true,
              elevation: 0,
              backgroundColor: kAccentDark,
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
              expandedHeight: 320,
              flexibleSpace: FlexibleSpaceBar(
                stretchModes: const [StretchMode.zoomBackground, StretchMode.fadeTitle],
                titlePadding: const EdgeInsetsDirectional.only(start: 72, bottom: 14, end: 16),
                title: Text(
                  p.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: whiteColor,
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                    letterSpacing: 0.2,
                    shadows: [Shadow(blurRadius: 4, color: Colors.black54)],
                  ),
                ),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
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
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Color(0x00000000), Color(0xAA000000)],
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.topCenter,
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 0.6, sigmaY: 0.6),
                        child: Container(color: Colors.transparent),
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
                      // Meta
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: Row(
                          children: [
                            const Icon(Icons.schedule, size: 18, color: Colors.black54),
                            const SizedBox(width: 6),
                            Text(
                              formatCreatedAt(p.createdAt),
                              style: const TextStyle(color: Colors.black54, fontSize: 13.5),
                            ),
                            const Spacer(),
                            // _StatChip(
                            //   icon: Icons.remove_red_eye,
                            //   label: (p.view ?? 0).toString(),
                            // ),
                            const SizedBox(width: 8),
                            _StatChip(
                              icon: Icons.comment,
                              label: '$commentsCount',
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

                      const _DividerInset(),

                      // Comments
                      const _SectionHeader(title: "Comments"),
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
                              const _DividerInset(),
                              Padding(
                                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                                child: FormCommentPost(postId: p.id.toString()),
                              ),
                            ],
                          ),
                        ),
                      ),
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

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _StatChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F6F8),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFE9ECF1)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.black54),
          const SizedBox(width: 6),
          Text(label, style: const TextStyle(fontSize: 13.5, color: Colors.black87)),
        ],
      ),
    );
  }
}
