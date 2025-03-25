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

          {/* Product box */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            <ProductShowcase title="New Arrivals" products={newArrivals} />
            <ProductShowcase title="Trending Now" products={trendingProducts} />
            <ProductShowcase title="Top Rated" products={topRatedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

// fixed top-0 left-0 bottom-0 w-full max-w-[320px] p-8  overflow-y-scroll overscroll-contain z-20 transition
export default Home;
