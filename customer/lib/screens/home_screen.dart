import 'package:cached_network_image/cached_network_image.dart';
import 'package:customer/models/utils/common.dart';
import 'package:customer/services/categoryService.dart';
import 'package:customer/services/productService.dart';
import 'package:flutter/material.dart';


class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> categories = [];  // DANH SÁCH CATEGORY
  List<dynamic> products = [];    // DANH SÁCH PRODUCT
  bool isLoadingCate = true;      // TRẠNG THÁI LOAD CATEGORY
  bool isLoadingProduct = true;   // TRẠNG THÁI LOAD PRODUCT

  final CategoryService _categoryService = CategoryService();
  final ProductService _productService = ProductService();

  @override
  void initState() {
    super.initState();
    fetchCategory();  // GỌI API CATEGORY
    fetchProduct();   // GỌI API PRODUCT
  }

  // ✅ GỌI API CATEGORY
  Future<void> fetchCategory() async {
    final result = await _categoryService.search(pageNumber: 1, pageSize: 10);
    if (result["success"] == true) {
      setState(() {
        categories = result["data"] ?? [];
        isLoadingCate = false;
      });
    } else {
      setState(() {
        isLoadingCate = false;
      });
    }
  }

  // ✅ GỌI API PRODUCT
  Future<void> fetchProduct() async {
    final result = await _productService.search(pageNumber: 1, pageSize: 10);
    if (result["success"] == true) {
      setState(() {
        products = result["data"] ?? [];
        isLoadingProduct = false;
      });
    } else {
      setState(() {
        isLoadingProduct = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ✅ THANH TRÊN (APPBAR GIỐNG ẢNH)
      appBar: AppBar(
        title: const Text(
          "Cửa hàng điện thoại",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ✅ Ô TÌM KIẾM
            TextField(
              decoration: InputDecoration(
                hintText: "Tìm kiếm điện thoại...",
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12),
              ),
            ),
            const SizedBox(height: 20),

            // ✅ BANNER GIẢ LẬP
            Container(
              height: 150,
              decoration: BoxDecoration(
                color: Colors.blueGrey.shade200,
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: const Text(
                "BANNER ĐIỆN THOẠI",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 20),

            // ✅ HIỂN THỊ CATEGORY
            const Text(
              "Danh mục",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            isLoadingCate
                ? const Center(child: CircularProgressIndicator())
                : SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cate = categories[index];
                  return Container(
                    width: 80,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        cate["categoryName"] ?? "No Name",
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 28),

            // ✅ HIỂN THỊ PRODUCT
            const Text(
              "Sản phẩm bán chạy",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            isLoadingProduct
                ? const Center(child: CircularProgressIndicator())
                : GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              itemCount: products.length,
              shrinkWrap: true,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.7,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
              ),
              itemBuilder: (context, index) {
                final p = products[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // hien thi anh
                      Container(
                        height: 100,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
                          //load ảnh
                          child: CachedNetworkImage(
                            imageUrl: "${Common.domain}/images/${p.image}",
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Center(child: CircularProgressIndicator()),
                            errorWidget: (context, url, error) => Icon(Icons.error),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        p["productName"] ?? "Tên sản phẩm",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "${p["price"] ?? 0} đ",
                        style: const TextStyle(
                          color: Colors.red,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),

      // ✅ BOTTOM NAVIGATION
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: "Yêu thích",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Cài đặt",
          ),
        ],
        currentIndex: 0,
        onTap: (index) {},
      ),
    );
  }
}
