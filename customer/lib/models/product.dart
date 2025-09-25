class Product {
  final int id;
  final String name;
  final double price;
  final String image;
  final String description;// đường dẫn tới ảnh trong assets

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.description,

  });
}

final List<Product> products = [
  Product(id: 1, name: "iPhone 13", price: 20000000, image: "assets/images/ip1.jpg", description: "aaaaa"),
  Product(id: 2, name: "iPhone 14", price: 25000000, image: "assets/images/ip2.jpg" , description: "aaaaa"),
  Product(id: 3, name: "Oppo Reno 8", price: 12000000, image: "assets/images/oppo1.jpg" , description: "aaaaa"),
  Product(id: 4, name: "Oppo Reno 10", price: 15000000, image: "assets/images/oppo2.jpg" , description: "aaaaa"),
  Product(id: 1, name: "iPhone 13", price: 20000000, image: "assets/images/ip1.jpg", description: "aaaaa"),
  Product(id: 2, name: "iPhone 14", price: 25000000, image: "assets/images/ip2.jpg" , description: "aaaaa"),
  Product(id: 3, name: "Oppo Reno 8", price: 12000000, image: "assets/images/oppo1.jpg" , description: "aaaaa"),
  Product(id: 4, name: "Oppo Reno 10", price: 15000000, image: "assets/images/oppo2.jpg" , description: "aaaaa"),
];
// Giỏ hàng (tạm lưu global)
List<Product> cart = [];
