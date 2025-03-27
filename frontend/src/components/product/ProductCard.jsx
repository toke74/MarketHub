import {
  IoHeartOutline,
  IoEyeOutline,
  IoRepeatOutline,
  IoBagAddOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";

const ProductCard = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden transition-shadow hover:shadow-lg group">
      <div className="relative">
        <img
          src={product.imageDefault}
          alt={product.title}
          className="w-full h-auto object-cover transition-transform transform group-hover:scale-110"
        />
        <img
          src={product.imageHover}
          alt={product.title}
          className="absolute top-0 left-0 w-full h-auto object-cover opacity-0 transition-opacity group-hover:opacity-100"
        />
        {/* Badge */}
        {product.discount && (
          <div
            className={`showcase-badge absolute top-4 left-4 bg-green-500 text-xs font-medium text-white px-2 py-0.5 rounded-sm z-30`}
          >
            {product.discount}
          </div>
        )}
        {product.badge === "Sale" && (
          <div className="showcase-badge angle black absolute top-2 -left-8 bg-black text-white text-[11px] font-medium uppercase px-10 py-1 -rotate-45 z-30">
            sale
          </div>
        )}
        {product.badge === "New" && (
          <div className="showcase-badge angle black absolute top-2 -left-8 bg-red-500 text-white text-[11px] font-medium uppercase px-10 py-1 -rotate-45 z-30">
            {product.badge}
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 transform translate-x-12 transition-transform group-hover:translate-x-0">
          <button className="bg-white text-gray-600 border border-gray-200 p-2 rounded-sm hover:bg-black hover:text-white cursor-pointer">
            <IoHeartOutline size={20} />
          </button>
          <button className="bg-white text-gray-600 border border-gray-200 p-2 rounded-sm hover:bg-black hover:text-white cursor-pointer">
            <IoEyeOutline size={20} />
          </button>
          <button className="bg-white text-gray-600 border border-gray-200 p-2 rounded-sm hover:bg-black hover:text-white cursor-pointer">
            <IoRepeatOutline size={20} />
          </button>
          <button className="bg-white text-gray-600 border border-gray-200 p-2 rounded-sm hover:bg-black hover:text-white cursor-pointer">
            <IoBagAddOutline size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <a
          href="#"
          className="text-primary text-[16px] font-medium uppercase mb-2 block"
        >
          {product.category}
        </a>
        <h3 className="text-text text-lg font-light capitalize tracking-wide mb-2 truncate">
          <a href="#" className="hover:text-black">
            {product.title}
          </a>
        </h3>
        <div className="flex text-xl text-yellow-500 mb-2">
          {[...Array(5)].map((_, index) =>
            index < product.rating ? (
              <IoStar key={index} />
            ) : (
              <IoStarOutline key={index} />
            )
          )}
        </div>
        <div className="flex items-center space-x-2 text-lg text-gray-900 mb-2">
          <p className="font-bold">${product.price}</p>
          {product.originalPrice && (
            <del className="text-gray-500">${product.originalPrice}</del>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
