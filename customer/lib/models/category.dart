class Category {
  final int id;
  final String name;

  Category({
    required this.id,
    required this.name,
  });
}

final List<Category> categories = [
  Category(id: 1, name: "iPhone"),
  Category(id: 2, name: "Samsung"),
  Category(id: 3, name: "Xiaomi"),
  Category(id: 4, name: "OPPO"),
  Category(id: 5, name: "Vivo"),
];
