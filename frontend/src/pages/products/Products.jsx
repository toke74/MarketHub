//Package Imports
import { useSelector } from "react-redux";

//Local Imports
import ProductCard from "../../components/product/ProductCard";

const Products = () => {
  const { products } = useSelector((state) => state.product);

  return (
    <div className="mt-8 mb-14">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[25px] ">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
