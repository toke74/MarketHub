import React from "react";
import DOMPurify from "dompurify";

// Component to render product details
const ProductDetailsRenderer = ({ productDetails }) => {
  // If productDetails is not an array or is empty, render a fallback
  if (!Array.isArray(productDetails) || productDetails.length === 0) {
    return <p>No product details available.</p>;
  }

  return (
    <div className="product-details">
      {productDetails.map((detail, index) => {
        // Sanitize the HTML content
        const sanitizedHTML = DOMPurify.sanitize(detail);

        return (
          <div
            key={index}
            className="product-detail-section mb-4 text-[18px] text-gray-700"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      })}
    </div>
  );
};

export default ProductDetailsRenderer;
