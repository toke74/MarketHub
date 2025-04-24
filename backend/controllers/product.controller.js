// Import dependencies
import Product from "../model/product.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import cloudinary from "../config/cloudinary.config.js";
import Vendor from "../model/vendor.model.js";

// @desc    Create Product
// @route   POST /api/v1/product/create_product
// @access  Private (Vendor Only)
export const createProduct = asyncErrorHandler(async (req, res, next) => {
  // Destructure fields from req.body
  const {
    name,
    description,
    price,
    discountInPercent,
    category,
    brand,
    stock,
    variations,
    colors,
    sizes,
    tags,
    isFeatured,
    productDetails,
  } = req.body;

  // Check authenticated vendor
  const vendor = req.vendor;

  // Ensure vendor is verified and email is confirmed
  if (!vendor.isVerified || !vendor.isEmailVerified) {
    return next(
      new ErrorHandler(
        "Your account must be verified and email confirmed to create products.",
        403
      )
    );
  }

  // Validate required fields
  if (!name || !description || !price || !category || !brand || !stock) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  // Check if images are uploaded
  if (!req.files || req.files.length === 0) {
    return next(
      new ErrorHandler("Please upload at least one product image.", 400)
    );
  }

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    })
  );

  // Convert colors and sizes to arrays if they come as comma-separated strings
  const parsedColors = Array.isArray(colors)
    ? colors
    : typeof colors === "string"
    ? colors.split(",").map((color) => color.trim())
    : [];

  const parsedSizes = Array.isArray(sizes)
    ? sizes
    : typeof sizes === "string"
    ? sizes.split(",").map((size) => size.trim())
    : [];

  // Convert productDetails to an array if necessary
  const parsedProductDetails = Array.isArray(productDetails)
    ? productDetails
    : typeof productDetails === "string"
    ? productDetails.split(",").map((detail) => detail.trim())
    : [];

  // Create product
  const product = await Product.create({
    name,
    description,
    price,
    discountInPercent,
    category,
    brand,
    stock,
    images: uploadedImages,
    variations,
    colors: parsedColors,
    sizes: parsedSizes,
    tags,
    isFeatured,
    productDetails: parsedProductDetails,
    vendor: vendor._id,
  });

  // Increment vendor's totalProducts
  vendor.totalProducts += 1;
  // Save vendor
  await vendor.save();

  // Respond with success message and product details
  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product,
  });
});

// @desc    Update Product
// @route   PUT /api/v1/product/update_product/:id
// @access  Private (Vendor Only)
export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (product.vendor.toString() !== req.vendor._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this product", 403)
    );
  }

  // Parse variations if sent as JSON string
  if (req.body.variations && typeof req.body.variations === "string") {
    try {
      req.body.variations = JSON.parse(req.body.variations);
    } catch (error) {
      return next(new ErrorHandler("Invalid variations format", 400));
    }
  }

  // Optional: Filter out empty variation objects
  if (Array.isArray(req.body.variations)) {
    req.body.variations = req.body.variations.filter(
      (v) => v.color && v.size && v.quantity > 0
    );
  }

  // Parse productDetails from FormData
  let productDetails = [];
  if (req.body.productDetails) {
    // If productDetails is already an array (unlikely, but handle just in case)
    if (Array.isArray(req.body.productDetails)) {
      productDetails = req.body.productDetails;
    } else {
      // FormData sends productDetails as productDetails[0], productDetails[1], etc.
      productDetails = Object.keys(req.body)
        .filter((key) => key.startsWith("productDetails["))
        .map((key) => req.body[key])
        .filter((detail) => detail); // Filter out empty strings
    }
  }

  const updatableFields = [
    "name",
    "description",
    "price",
    "discountInPercent",
    "category",
    "brand",
    "stock",
    "variations",
    "tags",
    "isFeatured",
    "productDetails", // Add productDetails to updatable fields
  ];

  updatableFields.forEach((field) => {
    if (field === "productDetails") {
      if (productDetails.length > 0) {
        product[field] = productDetails;
      }
    } else if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    await Promise.all(
      product.images.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );

    // Parse existing images from request body
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        // Support multiple values
        if (Array.isArray(req.body.existingImages)) {
          existingImages = req.body.existingImages.map((img) =>
            typeof img === "string" ? JSON.parse(img) : img
          );
        } else {
          existingImages = [JSON.parse(req.body.existingImages)];
        }
      } catch (error) {
        return next(new ErrorHandler("Invalid existing images format", 400));
      }
    }

    // Merge new uploads with existing images
    if (req.files && req.files.length > 0) {
      const newUploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          });
          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );

      product.images = [...existingImages, ...newUploadedImages];
    } else {
      product.images = existingImages; // Only existing if no new ones
    }
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// @desc    Get Single Product
// @route   GET /api/v1/product/get_product/:id
// @access  Public
export const getProduct = asyncErrorHandler(async (req, res, next) => {
  // Extract product ID from request parameters
  const { id } = req.params;

  // Find product by ID and populate vendor details
  const product = await Product.findById(id).populate(
    "vendor",
    "name storeName"
  );

  // Check if product exists, if not, return error
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Respond with product details
  res.status(200).json({
    success: true,
    product,
  });
});

// @desc    Get All Products with Filtering, Search, and Pagination
// @route   GET /api/v1/product/get_all_products
// @access  Public
export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
  // Pagination
  const resultPerPage = 10;
  const page = Number(req.query.page) || 1;

  // Build query object
  const queryObj = {};

  // Search by product name
  if (req.query.keyword) {
    queryObj.name = { $regex: req.query.keyword, $options: "i" };
  }

  // Filter by category
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  // Filter by price range
  if (req.query.price) {
    const [minPrice, maxPrice] = req.query.price.split("-");
    queryObj.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  // Filter by vendor
  if (req.query.vendorId) {
    queryObj.vendor = req.query.vendorId;
  }

  // Count total products
  const totalProducts = await Product.countDocuments(queryObj);

  // Fetch products with pagination
  const products = await Product.find(queryObj)
    .populate("vendor", "name storeName")
    .skip(resultPerPage * (page - 1))
    .limit(resultPerPage)
    .sort({ createdAt: -1 });

  // Respond with products, total products, and pagination details
  res.status(200).json({
    success: true,
    totalProducts,
    resultPerPage,
    currentPage: page,
    products,
  });
});

// @desc    Delete Product
// @route   DELETE /api/v1/product/delete_product/:id
// @access  Private (Vendor Only)
export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  // Extract product ID from request
  const { id } = req.params;

  // Find product by ID
  const product = await Product.findById(id);

  // Check if product exists
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if the logged-in vendor owns the product
  if (product.vendor.toString() !== req.vendor._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this product", 403)
    );
  }

  // Delete product images from Cloudinary
  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  // Delete product from the database using findByIdAndDelete
  await Product.findByIdAndDelete(id);

  // Respond with success
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// @desc    Get all products by the logged-in vendor
// @route   GET /api/v1/product/vendor_products
// @access  Private (Vendor Only)
export const getVendorProducts = asyncErrorHandler(async (req, res, next) => {
  try {
    // Get vendor ID from authenticated request
    const vendorId = req.vendor._id;

    // Fetch products belonging to this vendor
    const products = await Product.find({ vendor: vendorId });

    // If no products found
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this vendor.",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// @desc    Get all products by a specific vendor
// @route   GET /api/v1/product/vendor/products/:vendor_id
// @access  Public
export const getProductsByVendorId = asyncErrorHandler(
  async (req, res, next) => {
    // Extract vendor ID from the route params
    const { vendor_id } = req.params;

    // Check if the vendor exists
    const vendor = await Vendor.findById(vendor_id);

    // If vendor not found, return error
    if (!vendor) {
      return next(new ErrorHandler("Vendor not found", 404));
    }

    // Fetch products belonging to this vendor
    const products = await Product.find({ vendor: vendor_id });

    // If no products found
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this vendor.",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      count: products.length,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
      products,
    });
  }
);
