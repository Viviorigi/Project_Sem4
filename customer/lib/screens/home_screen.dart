import 'package:customer/models/category.dart';
import 'package:customer/models/product.dart';
import 'package:customer/screens/productDetail_screen.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart'; // để dùng logout
import 'cart_screen.dart';
import 'login_screen.dart'; // màn login

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String searchQuery = "";
  int currentPage = 0;
  final int itemsPerPage = 6;

  // Hàm logout
  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    print("Logout - current token: $token");
    if (token != null && token.isNotEmpty) {
      await prefs.remove('token');
      await prefs.remove('refreshToken');
      print("Token removed");
    } else {
      print("No token found to remove");
    }

    // Sau khi logout -> quay về LoginScreen
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = products
        .where((p) => p.name.toLowerCase().contains(searchQuery.toLowerCase()))
        .toList();

    final totalPages = (filtered.length / itemsPerPage).ceil();
    final start = currentPage * itemsPerPage;
    final end =
    (start + itemsPerPage) > filtered.length ? filtered.length : (start + itemsPerPage);
    final pageProducts = filtered.sublist(start, end);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Trang chủ"),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CartScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: Column(
        children: [
          // Danh mục
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final c = categories[index];
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.blueAccent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Center(
                    child: Text(
                      c.name,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ),
                );
              },
            ),
          ),

          // Thanh tìm kiếm
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              decoration: const InputDecoration(
                hintText: "Tìm kiếm sản phẩm...",
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (val) {
                setState(() {
                  searchQuery = val;
                  currentPage = 0;
                });
              },
            ),
          ),

          // Danh sách sản phẩm
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: pageProducts.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.7,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
              ),
              itemBuilder: (context, index) {
                final p = pageProducts[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => DetailScreen(product: p)),
                    );
                  },
                  child: Card(
                    child: Column(
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.asset(
                              p.image,
                              fit: BoxFit.cover,
                              width: double.infinity,
                            ),
                          ),
                        ),
                        Text(
                          p.name,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text("${p.price.toStringAsFixed(0)} đ"),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Phân trang
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(totalPages, (index) {
              return GestureDetector(
                onTap: () {
                  setState(() {
                    currentPage = index;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.all(4),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: currentPage == index ? Colors.blue : Colors.grey,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    "${index + 1}",
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              );
            }),
          )
        ],
      ),
    );
  }
}
