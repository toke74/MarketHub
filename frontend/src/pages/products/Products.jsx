import ProductCard from "../../components/product/ProductCard";
import { products } from "../../utils/data";

const Products = () => {
  return (
    <div className="mt-8 mb-14">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[25px] ">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
