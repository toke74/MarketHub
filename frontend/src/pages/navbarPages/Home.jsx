//Local Imports
import Banner from "../../components/common/Banner";
import CategorySlider from "../../components/product/CategorySlider";
import {
  CategorySidebar,
  ProductShowcaseSidebar,
} from "../../components/product/Sidebars";
import ProductShowcase from "../../components/product/ProductShowcase";
import {
  newArrivals,
  trendingProducts,
  topRatedProducts,
} from "../../utils/ProductShowcaseData";
import DealOfTheDay from "../../components/product/DealOfTheDay";
import ProductCard from "../../components/product/ProductCard";
import { products } from "../../utils/data";

const Home = () => {
  return (
    <div className="">
      <Banner />
      <CategorySlider />
      <div className="container mx-auto px-4">
        <div className="relative flex items-start gap-8 mb-8">
          {/* Sidebars  */}
          <div className="has-scrollbar hidden  lg:block ">
            <CategorySidebar />
            <ProductShowcaseSidebar />
          </div>
          <div>
            {/* Product box */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              <ProductShowcase title="New Arrivals" products={newArrivals} />
              <ProductShowcase
                title="Trending Now"
                products={trendingProducts}
              />
              <ProductShowcase title="Top Rated" products={topRatedProducts} />
            </div>

            {/* PRODUCT FEATURED */}
            <DealOfTheDay />

            {/* PRODUCT GRID */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold capitalize mb-4">
                New Products
              </h2>
              <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[25px] ">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
