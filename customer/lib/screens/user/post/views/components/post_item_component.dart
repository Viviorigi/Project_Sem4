import 'package:ecommerce_sem4/models/user/post/response/post_model.dart';
import 'package:ecommerce_sem4/screens/user/post/views/post_detail_screen.dart';
import 'package:ecommerce_sem4/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PostItem extends StatelessWidget {
  final String? image;
  final String? name;
  final String? description;
  final Post? post;
  final VoidCallback? onTap;

  // Giữ giống bạn
  final String imageUrl = "http://10.0.2.2:5069/images/";

  const PostItem({
    super.key,
    this.image,
    this.name,
    this.description,
    this.post,
    this.onTap,
  });

  String stripHtml(String? htmlText) {
    if (htmlText == null) return "";
    return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
  }

  String _formatCreatedAt(dynamic createdAt) {
    if (createdAt == null) return "";
    try {
      final dt = createdAt is DateTime ? createdAt : DateTime.parse(createdAt.toString());
      return '${DateFormat.Hm().format(dt)}  ·  ${DateFormat('dd/MM/yyyy').format(dt)}';
    } catch (_) {
      return "";
    }
  }

  bool get _hasImage {
    final src = image?.trim() ?? "";
    if (src.isEmpty) return false;
    final s = src.toLowerCase();
    return !(s.contains('null') || s.contains('undefined'));
  }

  @override
  Widget build(BuildContext context) {
    final String title = (name ?? '').trim().isEmpty ? 'Không có tiêu đề' : name!.trim();
    final String timeStr = _formatCreatedAt(post?.createdAt);

    // màu viền tím nhạt theo screenshot
    const Color borderLavender = Color(0xFFE6E0FF); // tím rất nhạt
    const Color shadowColor = Color(0x14000000);    // bóng nhẹ

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 6),
      child: Material(
        color: Colors.white,
        elevation: 0,
        borderRadius: BorderRadius.circular(18),
        shadowColor: shadowColor,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap ??
                  () {
                if (post != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => PostDetailScreen(post: post)),
                  );
                }
              },
          child: Container(
            height: 120,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: borderLavender, width: 1),
              boxShadow: const [
                BoxShadow(color: shadowColor, blurRadius: 12, offset: Offset(0, 6)),
              ],
            ),
            child: Row(
              children: [
                // Thumbnail bo góc
                Container(
                  width: 132,
                  height: double.infinity,
                  margin: const EdgeInsets.fromLTRB(8, 8, 10, 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderLavender),
                    color: const Color(0xFFF3F2F8),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: _hasImage
                      ? Image.network(
                    '$imageUrl$image',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) =>
                        Image.asset("assets/user/images/slide1.jpg", fit: BoxFit.cover),
                    loadingBuilder: (context, child, progress) {
                      if (progress == null) return child;
                      return Container(color: Colors.grey.shade200);
                    },
                  )
                      : Image.asset("assets/user/images/slide1.jpg", fit: BoxFit.cover),
                ),

                // Nội dung
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(0, 12, 12, 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tiêu đề
                        Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.w800,
                            color: blackColor,
                            height: 1.1,
                            letterSpacing: .2,
                          ),
                        ),

                        const SizedBox(height: 6),

                        // Meta time
                        if (timeStr.isNotEmpty)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.access_time, size: 14, color: Colors.grey.shade600),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  timeStr,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(fontSize: 12.5, color: Colors.grey.shade600),
                                ),
                              ),
                            ],
                          ),

                        const SizedBox(height: 6),

                        // Mô tả
                        Expanded(
                          child: Text(
                            stripHtml(description),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 13.5,
                              color: Colors.black87,
                              height: 1.35,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Chevron subtle
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400, size: 22),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
