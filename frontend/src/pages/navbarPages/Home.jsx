//Local Imports
import Banner from "../../components/common/Banner";
import CategorySlider from "../../components/common/CategorySlider";
import {
  CategorySidebar,
  ProductShowcaseSidebar,
} from "../../components/common/Sidebars";
import ProductShowcase from "../../components/common/ProductShowcase";
import {
  newArrivals,
  trendingProducts,
  topRatedProducts,
} from "../../utils/ProductShowcaseData";
import DealOfTheDay from "../../components/common/DealOfTheDay";

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
