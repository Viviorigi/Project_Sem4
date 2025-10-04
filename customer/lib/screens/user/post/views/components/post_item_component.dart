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

  final String imageUrl = "http://10.0.2.2:5069/images/";

  const PostItem({
    super.key,
    this.image,
    this.name,
    this.description,
    this.post,
  });

  String stripHtml(String? htmlText) {
    if (htmlText == null) return "";
    return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
  }

  String _formatCreatedAt(dynamic createdAt) {
    if (createdAt == null) return "";
    try {
      final dt =
      createdAt is DateTime ? createdAt : DateTime.parse(createdAt.toString());
      return '${DateFormat.Hm().format(dt)} · ${DateFormat('dd/MM/yyyy').format(dt)}';
    } catch (_) {
      return "";
    }
  }

  bool get _hasImage =>
      image != null &&
          image!.trim().isNotEmpty &&
          !(image!.toLowerCase().contains('null') ||
              image!.toLowerCase().contains('undefined'));

  @override
  Widget build(BuildContext context) {
    final String title = (name ?? '').trim().isEmpty ? 'Không có tiêu đề' : name!.trim();
    final String timeStr = _formatCreatedAt(post?.createdAt);

    return SizedBox(
      height: 120,
      child: Card(
        elevation: 3,
        margin: const EdgeInsets.all(6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            if (post != null) {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => PostDetailScreen(post: post)),
              );
            }
          },
          child: Row(
            children: [
              // Thumbnail
              Container(
                width: 150,
                height: double.infinity,
                decoration: BoxDecoration(
                  border: Border(
                    right: BorderSide(color: Colors.grey.shade200, width: 1),
                  ),
                ),
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

              // Texts
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 16.5,
                          fontWeight: FontWeight.w700,
                          color: blackColor,
                          height: 1.2,
                        ),
                      ),

                      const SizedBox(height: 6),

                      // Time (optional)
                      if (timeStr.isNotEmpty)
                        Row(
                          children: [
                            Icon(Icons.access_time, size: 14, color: Colors.grey.shade600),
                            const SizedBox(width: 4),
                            Text(
                              timeStr,
                              style: TextStyle(
                                fontSize: 12.5,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),

                      const SizedBox(height: 6),

                      // Description
                      Text(
                        stripHtml(description),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13.5,
                          color: Colors.black87,
                          height: 1.35,
                        ),
                      ),
                    ],
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
