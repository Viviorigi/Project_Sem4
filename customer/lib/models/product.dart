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

// Giỏ hàng (tạm lưu global)
List<Product> cart = [];
