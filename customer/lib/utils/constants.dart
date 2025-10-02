// lib/utils/constants.dart
import 'dart:ui';
import 'package:flutter/material.dart';

// ===== MÀU CŨ (giữ nguyên để không phá layout hiện tại) =====
const Color greyColor = Color(0xFF7C7C7C);
const Color greenBgColor = Color(0xFF019934);
const Color whiteColor = Colors.white;
const Color blackColor = Colors.black;
const Color dashedLine = Color(0xFF8E8E8E);
const Color borderInput = Color(0xFF8E8E8E);
const Color f4f4Color = Color(0xFFF4F4F4);
const Color filterProductColor = Color(0xFFF2F3F2);

// ===== PALETTE MỚI (Modern Light – dùng dần cho UI mới) =====
// Nền & bề mặt
const Color kCanvas = Color(0xFFFFFFFF);   // nền chính (trắng)
const Color kSurface = Color(0xFFF9FAFB);  // card sáng (gray-50)
const Color kStroke  = Color(0xFFE5E7EB);  // viền/hairline (gray-200)

// Text
const Color kInk    = Color(0xFF111111);   // text chính
const Color kMuted  = Color(0xFF6B7280);   // text phụ (gray-500)

// Accent
const Color kAccentDark = Color(0xFF111827); // đen đậm cho button/CTA
// Nếu muốn hợp logo pastel:
const Color kAccentPink = Color(0xFFF7A9C4); // hồng pastel
const Color kAccentLavender = Color(0xFFB7C0FF); // tím pastel

// State (tùy chọn)
const Color kSuccess = Color(0xFF16A34A);   // xanh success
const Color kWarning = Color(0xFFF59E0B);   // cam warning
const Color kDanger  = Color(0xFFDC2626);   // đỏ error

// ===== API URI (giữ nguyên) =====
const String apiUri = "http://10.0.2.2:5069/api";
const String loginUri = "$apiUri/auth/login";
const String registerUri = "$apiUri/auth/register";
// category
const String categorySearchUri = "$apiUri/category/search";
const String categoryDetailUri = "$apiUri/category";
// product
const String productSearchUri = "$apiUri/product/search";
const String productDetailUri = "$apiUri/product";
// cart
const String cartAddUri = "$apiUri/cart/add";
const String getCartUri = "$apiUri/cart/search";
const String updateQuantityUri = "$apiUri/cart/update";
const String getCartByUserIdUri = "$apiUri/cart/getCart";
const String removeCartUri = "$apiUri/cart";
// post-category
const String postCategorySearchUri = "$apiUri/postcategory/search";
const String postCategoryDetailUri = "$apiUri/postcategory";
// post
const String postSearchUri = "$apiUri/post/search";
const String postDetailUri = "$apiUri/post";
const String postCommentUri = "$apiUri/comment";
// order
const String orderUri = "$apiUri/order/create";
const String userOrderUri = "$apiUri/order/user-orders";
// account
const String getByIdAccountUri = "$apiUri/account";
const String updateAccountUri = "$apiUri/account/user";
