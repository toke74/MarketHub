import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaShoppingCart } from "react-icons/fa";

const banners = [
  {
    id: 1,
    image: "images/banner/banner-1.jpg",
    subtitle: "Trending item",
    title: "Women's latest fashion sale",
    price: "20.00",
  },
  {
    id: 2,
    image: "images/banner/banner-2.jpg",
    subtitle: "Trending accessories",
    title: "Modern sunglasses",
    price: "15.00",
  },
  {
    id: 3,
    image: "images/banner/banner-3.jpg",
    subtitle: "Sale Offer",
    title: "New fashion summer sale",
    price: "29.99",
  },
];

const Banner = () => {
  return (
    <div className="my-8">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="rounded-lg overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative min-w-full overflow-hidden  max-h-[500px] aspect-square snap-start">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover object-right"
                />
                <div
                  className="absolute top-1/5 left-1/10 xs:left-15 md:top-25 md:left-5 lg:left-20  bg-white/80 md:bg-transparent 
                 max-w-[280px]  xs:max-w-[360px] lg:max-w-[550px] py-5 px-6 rounded-lg"
                >
                  <p className="text-primary text-xl lg:text-3xl  uppercase tracking-widest font-semibold">
                    {banner.subtitle}
                  </p>
                  <h2 className="text-gray-900 text-xl lg:text-3xl my-4  font-bold uppercase leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-gray-700 mb-2 text-xl lg:text-2xl">
                    Starting at $ <b>{banner.price}</b>
                  </p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-md text-sm md:text-[18px] font-semibold uppercase hover:bg-gray-900 transition"
                  >
                    <FaShoppingCart /> Shop now
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
