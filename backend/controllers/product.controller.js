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
