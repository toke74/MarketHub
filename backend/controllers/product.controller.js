// Import dependencies
import Product from "../model/product.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import cloudinary from "../config/cloudinary.config.js";

// @desc    Create Product
// @route   POST /api/v1/product/create_product
// @access  Private (Vendor Only)
export const createProduct = asyncErrorHandler(async (req, res, next) => {
  // Destructure fields from req.body
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    variations,
    tags,
    isFeatured,
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

  // Create product
  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    images: uploadedImages,
    variations,
    tags,
    isFeatured,
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
  // Extract product ID from request parameters
  const { id } = req.params;

  // Find product by ID
  const product = await Product.findById(id);

  // Check if product exists, if not, return error
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Ensure the product belongs to the authenticated vendor
  if (product.vendor.toString() !== req.vendor._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this product", 403)
    );
  }

  // Update fields from req.body
  const updatableFields = [
    "name",
    "description",
    "price",
    "discountPrice",
    "category",
    "brand",
    "stock",
    "variations",
    "tags",
    "isFeatured",
  ];

  // Update product fields
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  // Handle image updates if new images are uploaded
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    await Promise.all(
      product.images.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );

    // Upload new images
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

    product.images = uploadedImages;
  }

  // Save updated product
  await product.save();

  // Respond with success message and updated product details
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
