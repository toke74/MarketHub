const Product = () => {
  const products = [
    {
      id: 1,
      category: "jacket",
      title: "Mens Winter Leathers Jackets",
      defaultImage: "images/products/jacket-3.jpg",
      hoverImage: "images/products/jacket-4.jpg",
      price: 48.0,
      originalPrice: 75.0,
      discount: "15%",
      rating: 3,
      badgeType: "discount",
    },
    {
      id: 2,
      category: "shirt",
      title: "Pure Garment Dyed Cotton Shirt",
      defaultImage: "images/products/shirt-1.jpg",
      hoverImage: "images/products/shirt-2.jpg",
      price: 45.0,
      originalPrice: 56.0,
      rating: 3,
      badgeType: "sale",
    },
    {
      id: 3,
      category: "shirt",
      title: "Pure Garment Dyed Cotton Shirt",
      defaultImage: "images/products/shirt-1.jpg",
      hoverImage: "images/products/shirt-2.jpg",
      price: 45.0,
      originalPrice: 56.0,
      rating: 3,
      badgeType: "sale",
    },
  ];

  return (
    <div className="product-main mb-8">
      <div className="product-grid grid grid-cols-3 gap-6 md:gap-6">
        product grid
      </div>
    </div>
  );
};

export default Product;
