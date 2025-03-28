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
import Testimonials from "../../components/common/Testimonials";
import CTAService from "../../components/common/CTAService";
import Blog from "../../components/common/Blog";

const Home = () => {
  return (
    <div className="">
      <Banner />
      <CategorySlider />
      <div className="container mx-auto px-4 ">
        <div className="relative flex items-start gap-8 mb-8 ">
          {/* Sidebars  */}
          <div className="has-scrollbar hidden  lg:block  ">
            <CategorySidebar />
            <ProductShowcaseSidebar />
            <Testimonials />
          </div>

          {/* contents */}
          <div className="flex-1">
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
              <h2 className="text-xl font-semibold capitalize mb-8 border-b border-gray-100 pb-3 ">
                New Products
              </h2>
              <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[25px] ">
                  {products &&
                    products
                      .slice(0, 6)
                      .map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                </div>
              </div>
            </div>
            <CTAService />
          </div>
        </div>
        {/* Blog */}
        <Blog />
      </div>
    </div>
  );
};

export default Home;
