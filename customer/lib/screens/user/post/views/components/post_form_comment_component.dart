import 'package:ecommerce_sem4/services/user/auth/auth_service.dart';
import 'package:ecommerce_sem4/services/user/comment/comment_service.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../../models/user/comment/post/request/create_request.dart';

class FormCommentPost extends StatefulWidget {
  final String postId;
  const FormCommentPost({super.key, required this.postId});

  @override
  State<StatefulWidget> createState() => _FormCommentPostState();
}

class _FormCommentPostState extends State<FormCommentPost> {
  final TextEditingController _controller = TextEditingController();

  final searchApiComment = postCommentUri;
  String? accessToken = "";
  String? accountId = "";
  Map<String, String> headers = <String, String>{};

  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    AuthService().checkLoginStatus(context);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toast(String msg, {bool ok = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        behavior: SnackBarBehavior.floating,
        backgroundColor: ok ? Colors.green[600] : Colors.red[600],
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _createComment() async {
    final text = _controller.text.trim();
    if (text.isEmpty) {
      _toast("Vui lòng nhập nội dung trước khi gửi", ok: false);
      return;
    }
    if (_isSending) return;

    try {
      setState(() => _isSending = true);

      final pref = await SharedPreferences.getInstance();
      accessToken = pref.getString("accessToken");
      accountId = pref.getString("id");

      headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      };

      final request = CreatePostCommentRequest(
        content: text,
        postId: widget.postId,
        accountId: accountId,
      ).toMap();

      final resp = await CommentPostService()
          .createComment(searchApiComment, headers, request);

      if (resp != null && resp.isNotEmpty) {
        _controller.clear();
        FocusScope.of(context).unfocus();
        _toast("Đã gửi bình luận!");
      } else {
        _toast("Gửi bình luận thất bại. Thử lại nhé.", ok: false);
      }
    } catch (_) {
      _toast("Có lỗi xảy ra. Thử lại sau nhé.", ok: false);
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool canSend = _controller.text.trim().isNotEmpty && !_isSending;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE9ECF1), width: 1),
        boxShadow: const [
          BoxShadow(color: Color(0x14000000), blurRadius: 12, offset: Offset(0, 6)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Ô nhập “pill”, tự giãn dòng
          Expanded(
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44, maxHeight: 140),
              child: Scrollbar(
                child: TextField(
                  controller: _controller,
                  onChanged: (_) => setState(() {}),
                  onSubmitted: (_) => _createComment(),
                  textInputAction: TextInputAction.newline,
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  minLines: 1,
                  decoration: InputDecoration(
                    hintText: "Viết bình luận…",
                    hintStyle: const TextStyle(color: Colors.black38, fontSize: 14),
                    filled: true,
                    fillColor: const Color(0xFFF9FAFB),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    prefixIcon: const Padding(
                      padding: EdgeInsets.only(left: 10, right: 6),
                      child: Icon(Icons.mode_comment_outlined, size: 20, color: Colors.black38),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE9ECF1), width: 1),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFBFC7FF), width: 1.2),
                    ),
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(width: 8),

          // Nút gửi nổi
          Material(
            color: canSend ? kAccentDark : Colors.grey.shade300,
            shape: const CircleBorder(),
            elevation: canSend ? 2 : 0,
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: canSend ? _createComment : null,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  child: _isSending
                      ? const SizedBox(
                    key: ValueKey('loading'),
                    width: 18, height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                      : const Icon(Icons.send_rounded, key: ValueKey('icon'), size: 20, color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
