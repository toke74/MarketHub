import React from "react";

const ProductShowcase = ({ title, products }) => {
  return (
    <div className="mb-6 ">
      <h2 className="text-lg font-semibold uppercase tracking-wide mb-8 pb-2 border-b border-gray-100">
        {title}
      </h2>

      <div className="container mx-auto px-2 min-[600px]:ml-8 md:ml-0">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg mb-4 w-[300px] min-[390px]:w-[350px]
            min-[430px]:w-[380px] min-[520px]:w-[480px] md:w-[350px] lg:w-[300px] xl:w-[380px] 2xl:w-[350px]"
          >
            {/* Product Image */}
            <a href="#" className="w-20 h-20 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </a>

            {/* Product Details */}
            <div className="flex-1">
              <a href="#">
                <h4
                  className="text-lg font-semibold text-gray-800 truncate  w-44 min-[390px]:w-52 min-[520px]:w-72 
                md:w-56 lg:w-44 2xl:w-52"
                >
                  {product.name}
                </h4>
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-red-500 capitalize"
              >
                {product.category}
              </a>

              {/* Price Section */}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-red-500 font-bold">${product.price}</p>
                <del className="text-gray-400 text-sm">
                  ${product.originalPrice}
                </del>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;
