//Package Imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//React Icons
import { FaStar, FaHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

//Local Imports
import ImageZoomModal from "../../components/common/ImageZoomModal";
import { useGetProductByIdQuery } from "../../services/productApi/productApi";
import ProductDetailsRenderer from "./ProductDetailsRenderer";

const ProductPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(id);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    if (data) {
      setProduct(data.product);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="p-4">Failed to load product</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  const {
    name = "",
    description = "",
    price = 0,
    discountPrice = 0,
    sizes = [],
    images = [],
    ratings = 0,
    details = [],
    reviews = [],
    numReviews = 0,
    discountInPercent,
    productDetails,
  } = product || {};

  console.log(product);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* PRODUCT TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div
            className="aspect-[2/2] overflow-hidden rounded-2xl shadow-md cursor-zoom-in"
            onClick={() => images?.[0].url && setZoomImage(images[0].url)}
          >
            <img
              src={images?.[0].url || "/placeholder.jpg"}
              alt="Main"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 mt-4">
            {images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumb ${index}`}
                className="w-20 h-28 object-cover rounded-lg border border-gray-200 hover:border-black cursor-pointer"
                onClick={() => img.url && setZoomImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">{name}</h1>
          {/* <div className="flex items-center gap-2 text-[17px]">
            <div className="flex text-xl text-yellow-500 ">
              {[...Array(5)].map((_, index) =>
                index < rating ? (
                  <IoStar key={index} />
                ) : (
                  <IoStarOutline key={index} />
                )
              )}
            </div>
            <span className="mt-1">
              {rating || "0"}{" "}
              <span className="ml-4">({numReviews} Reviews)</span>
            </span>
          </div> */}
          <div className="flex items-center gap-2 text-[17px]">
            <div className="flex text-xl text-yellow-500">
              {[...Array(5)].map((_, index) => {
                const fullStars = Math.floor(ratings);
                const hasHalfStar = ratings - fullStars >= 0.5;

                if (index < fullStars) {
                  return <IoStar key={index} />;
                } else if (index === fullStars && hasHalfStar) {
                  return <IoStarHalf key={index} />;
                } else {
                  return <IoStarOutline key={index} />;
                }
              })}
            </div>
            <span className="mt-1">
              {ratings || "0"}{" "}
              <span className="ml-4">({numReviews} Reviews)</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-2xl font-bold text-red-500">
            {/* ${discountPrice?.toFixed(2)} */}
            {discountPrice > 0 ? (
              <p className="font-bold">${discountPrice}</p>
            ) : (
              <p className="font-bold">${price}</p>
            )}
            {discountPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${price?.toFixed(2)}
              </span>
            )}

            {discountInPercent > 0 && discountInPercent && (
              <span className="bg-yellow-100 text-yellow-600 text-sm px-2 py-1 rounded-full">
                {discountInPercent}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm">{description}</p>

          {/* Sizes */}
          <div>
            <h2 className="font-semibold mb-2">Select Size:</h2>
            <div className="flex gap-2">
              {sizes?.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-full border ${
                    selectedSize === size ? "bg-black text-white" : "bg-white"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <h2 className="font-semibold">Quantity:</h2>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded-lg text-center"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="flex-1 bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <FaBolt /> Buy Now
            </button>
          </div>

          <div className="text-sm text-gray-500 underline hover:text-black cursor-pointer flex items-center gap-1 mt-2">
            <FaHeart className="text-pink-500" /> Add to Wishlist
          </div>
        </div>
      </div>

      {/* MODAL ZOOM */}
      {zoomImage && (
        <ImageZoomModal image={zoomImage} onClose={() => setZoomImage(null)} />
      )}

      {/* PRODUCT DETAILS */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-3">Product Details</h2>
        <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
          {/* {productDetails?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))} */}
          <ProductDetailsRenderer productDetails={productDetails} />
        </ul>
      </div>

      {/* REVIEWS */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>
        {product?.reviews?.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product?.reviews?.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{review.userName}</div>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECOMMENDED */}
      {/* <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-3">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommended.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-2 hover:shadow-lg transition"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-2 text-sm font-medium">{item.name}</div>
              <div className="text-red-500 font-semibold">
                ${item.discountPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProductPage;
