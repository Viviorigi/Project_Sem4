import 'package:customer/screens/productDetail_screen.dart';
import 'package:customer/screens/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:customer/models/utils/common.dart';
import 'package:customer/services/categoryService.dart';
import 'package:customer/services/productService.dart';
import 'cart_screen.dart';
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

  List<dynamic> categories = [];
  List<dynamic> products1 = [];
  List<dynamic> filteredProducts = [];

  bool isLoadingCate = true;
  bool isLoadingProduct = true;

  int? selectedCategoryId;
  String searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  final CategoryService _categoryService = CategoryService();
  final ProductService _productService = ProductService();

  int _selectedBottomIndex = 0;

  @override
  void initState() {
    super.initState();
    fetchCategory();
    fetchProduct();
  }


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


  //  GỌI API PRODUCT
  Future<void> fetchProduct() async {
    final result = await _productService.search(pageNumber: 1, pageSize: 10);
    if (result["success"] == true) {
      setState(() {

        products1 = result["data"] ?? [];
        filteredProducts = List.from(products1);

        products = result["data"] ?? [];

        isLoadingProduct = false;
      });
    } else {
      setState(() {
        isLoadingProduct = false;
      });
    }

  }

  void filterProducts() {
    setState(() {
      filteredProducts = products1.where((p) {
        final matchesSearch = searchQuery.isEmpty
            ? true
            : (p["productName"] ?? "")
            .toLowerCase()
            .contains(searchQuery.toLowerCase());
        final matchesCategory = selectedCategoryId == null ||
            p["categoryId"] == selectedCategoryId;
        return matchesSearch && matchesCategory;
      }).toList();
    });

  }

  @override
  Widget build(BuildContext context) {

    Widget body;
    switch (_selectedBottomIndex) {
      case 0:
        body = buildHome();
        break;
      case 1:
        body = const Center(child: Text("Yêu thích")); // placeholder
        break;
      case 2:
        body = const CartScreen();
        break;
      case 3:
        body = const ProfileScreen();
        break;
      default:
        body = buildHome();
    }

    // --- HÀM XÁC ĐỊNH TIÊU ĐỀ ĐỘNG ---
    String getTitle(int index) {
      switch (index) {
        case 0:
          return "Trang chủ";
        case 1:
          return "Yêu thích";
        case 2:
          return "Giỏ hàng"; // Tiêu đề khi chọn tab Giỏ hàng
        case 3:
          return "Cài đặt";
        default:
          return "Ứng dụng";
      }
    }

    Widget? buildLeading(int index) {
      // Hiển thị nút back cho index 1 (Yêu thích) và index 2 (Giỏ hàng)
      if (index == 1 || index == 2 || index == 3) {
        return IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // THAY VÌ POP, CHÚNG TA ĐẶT LẠI TRẠNG THÁI VỀ TRANG CHỦ (index 0)
            setState(() {
              _selectedBottomIndex = 0; // Chuyển về tab Trang chủ
            });
          },
        );
      }
      return null; // Không hiển thị gì nếu là tab Trang chủ (0) hoặc Cài đặt (3)
    }

    return Scaffold(
      // Dùng tiêu đề động
      appBar: AppBar(title: Text(getTitle(_selectedBottomIndex)),
        // centerTitle: true,
        // backgroundColor: Colors.blue.shade700,
        // foregroundColor: Colors.white,
        leading: buildLeading(_selectedBottomIndex),
      ),
      body: body,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedBottomIndex,
        onTap: (index) {
          setState(() {
            _selectedBottomIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: "Yêu thích"),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: "Giỏ hàng"),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: "Cài đặt"),
        ],
      ),
    );
  }

  Widget buildHome() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tìm kiếm
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: "Tìm kiếm điện thoại...",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: () {
                  searchQuery = _searchController.text;
                  filterProducts();
                },
                child: const Icon(Icons.search),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Banner
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

          // Category
          const Text("Danh mục", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          isLoadingCate
              ? const Center(child: CircularProgressIndicator())
              : SizedBox(
            height: 80,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: categories.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: const Text("Tất cả"),
                      selected: selectedCategoryId == null,
                      onSelected: (_) {
                        selectedCategoryId = null;
                        filterProducts();
                      },
                    ),
                  );
                }
                final cate = categories[index - 1];
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(cate["categoryName"] ?? "No Name"),
                    selected: selectedCategoryId == cate["id"],
                    onSelected: (_) {
                      selectedCategoryId = cate["id"];
                      filterProducts();
                    },
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 28),

          // Products
          const Text("Sản phẩm ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          isLoadingProduct
              ? const Center(child: CircularProgressIndicator())
              : GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: filteredProducts.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
            ),
            itemBuilder: (context, index) {
              final p = filteredProducts[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ProductDetailScreen(product: p),
                    ),
                  );
                },
                child: Container(

    return Scaffold(
      //  THANH TRÊN (APPBAR GIỐNG ẢNH)
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

            //  Ô TÌM KIẾM
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

            //  BANNER GIẢ LẬP
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

                      Container(
                        height: 100,
                        width: double.infinity,
                        child: ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
                          child: CachedNetworkImage(
                            imageUrl: "${Common.domain}/images/${p["image"]}",
                            fit: BoxFit.cover,

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

                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text("${p["price"] ?? 0} đ", style: const TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
              );
            },

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

      //  BOTTOM NAVIGATION
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
