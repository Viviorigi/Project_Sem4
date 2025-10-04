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
      setState(() => _loading = true);
      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final data = await PostService()
          .detail("$postDetailUriapi/${widget.post!.id}", headers);

      setState(() {
        commentsResp = data;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String stripHtml(String? htmlText) {
    if (htmlText == null) return "";
    return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.post!;
    return SafeArea(
      child: Scaffold(
        body: Container(
          // nền gradient đồng bộ
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
              // AppBar
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
                            onTap: () => Navigator.pop(context),
                            child: const Padding(
                              padding: EdgeInsets.all(6),
                              child: Icon(Icons.keyboard_arrow_left,
                                  size: 28, color: whiteColor),
                            ),
                          ),
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 56),
                        child: Text(
                          "Post detail",
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.center,
                          style: TextStyle(
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
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Ảnh cover
                          Container(
                            width: double.infinity,
                            height: 300,
                            clipBehavior: Clip.hardEdge,
                            decoration: const BoxDecoration(
                              borderRadius:
                              BorderRadius.vertical(top: Radius.circular(24)),
                            ),
                            child: Image.network(
                              '$imageUrl${p.image}',
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) =>
                                  Image.asset("assets/user/images/slide1.jpg",
                                      fit: BoxFit.cover),
                              loadingBuilder: (context, child, progress) {
                                if (progress == null) return child;
                                return Container(color: Colors.grey.shade200);
                              },
                            ),
                          ),

                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                            child: Text(
                              p.title,
                              style: const TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.w800,
                                fontSize: 24,
                                height: 1.2,
                                letterSpacing: 0.2,
                              ),
                            ),
                          ),

                          const Divider(
                            color: Colors.grey,
                            thickness: 1,
                            indent: 16,
                            endIndent: 16,
                          ),

                          // Description
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                            child: Text(
                              "Description",
                              style: TextStyle(
                                color: Colors.grey.shade900,
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Padding(
                            padding:
                            const EdgeInsets.fromLTRB(16, 6, 16, 12),
                            child: Text(
                              stripHtml(p.description),
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 14.5,
                                height: 1.5,
                              ),
                            ),
                          ),

                          // Content
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                            child: Text(
                              "Content",
                              style: TextStyle(
                                color: Colors.grey.shade900,
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Padding(
                            padding:
                            const EdgeInsets.fromLTRB(16, 6, 16, 12),
                            child: Text(
                              stripHtml(p.content),
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 14.5,
                                height: 1.55,
                              ),
                            ),
                          ),

                          // Comments
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                            child: Text(
                              "Comments",
                              style: TextStyle(
                                color: Colors.grey.shade900,
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),

                          if (_loading)
                            const Padding(
                              padding: EdgeInsets.all(16),
                              child: Center(
                                  child: CircularProgressIndicator()),
                            )
                          else ...[
                            const SizedBox(height: 6),
                            ...((commentsResp?.comments) ?? [])
                                .map((entry) => AnswerComment(
                              accountName: entry.account.userName ?? "User",
                              content: entry.content ?? "",
                              createdAt: entry.createdAt,
                              avatar: entry.account.avatar,
                            ))
                                .toList(),
                            const Divider(
                              color: Colors.grey,
                              thickness: 1,
                              indent: 16,
                              endIndent: 16,
                            ),
                            // form comment
                            Padding(
                              padding:
                              const EdgeInsets.fromLTRB(16, 0, 16, 24),
                              child: FormCommentPost(
                                  postId: p.id.toString()),
                            ),
                          ],
                        ],
                      ),
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
