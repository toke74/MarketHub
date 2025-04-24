// Package Imports
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// React Icons
import {
  FaTag,
  FaDollarSign,
  FaStore,
  FaCamera,
  FaList,
  FaSortAmountDown,
  FaBoxOpen,
  FaPlus,
  FaTrash,
  FaPercent,
} from "react-icons/fa";

// Local Imports
import { useCreateProductMutation } from "../../services/productApi/productApi";
import RichTextEditor from "../../components/common/RichTextEditor";

// Validation schema using Zod
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountInPercent: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  tags: z.string().optional(),
  colors: z.string().optional(), // Changed to string for input handling
  sizes: z.string().optional(), // Changed to string for input handling
  productDetails: z
    .array(z.string().min(1, "Each detail must have content"))
    .min(1, "At least one product detail is required"),
  variations: z
    .array(
      z.object({
        color: z.string(),
        size: z.string(),
        quantity: z.number(),
      })
    )
    .optional(),
});

const CreateProductModal = ({ onClose }) => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      variations: [],
      discountInPercent: 0,
      colors: "", // Initialize as string
      sizes: "", // Initialize as string
      productDetails: [""],
    },
  });

  const {
    fields: productDetailFields,
    append: appendProductDetail,
    remove: removeProductDetail,
  } = useFieldArray({
    control,
    name: "productDetails",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const price = parseFloat(data.price);
    const discountInPercent = parseFloat(data.discountInPercent || 0);

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", price);
    formData.append("discountInPercent", discountInPercent || 0);
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock);
    formData.append("tags", data.tags || "");

    // Transform colors and sizes from comma-separated strings to arrays
    const colors = data.colors
      ? data.colors
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c)
      : [];
    const sizes = data.sizes
      ? data.sizes
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    colors.forEach((color, i) => formData.append(`colors[${i}]`, color));
    sizes.forEach((size, i) => formData.append(`sizes[${i}]`, size));

    (data.productDetails || []).forEach((detail, i) => {
      formData.append(`productDetails[${i}]`, detail);
    });

    data.variations.forEach((v, i) => {
      formData.append(`variations[${i}][color]`, v.color);
      formData.append(`variations[${i}][size]`, v.size);
      formData.append(`variations[${i}][quantity]`, v.quantity);
    });

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await createProduct(formData).unwrap();
      toast.success(response.message || "Product created successfully");
      navigate("/product_management");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 z-52 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaTag /> Product Name
            </label>
            <input
              {...register("name")}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaList /> Description
            </label>
            <textarea
              {...register("description")}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Product Details Rich Text */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-text">
              <FaList /> Product Details
            </label>
            {productDetailFields.map((field, index) => (
              <div key={field.id} className="border p-2 rounded relative">
                <RichTextEditor
                  value={getValues(`productDetails.${index}`) || ""}
                  onChange={(content) =>
                    setValue(`productDetails.${index}`, content, {
                      shouldValidate: true,
                    })
                  }
                />
                {errors.productDetails?.[index] && (
                  <p className="text-red-500 text-sm">
                    {errors.productDetails[index].message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => removeProductDetail(index)}
                  className="text-red-500 absolute top-2 right-2 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendProductDetail("")}
              className="mt-2 text-primary hover:underline flex items-center gap-2 cursor-pointer"
            >
              <FaPlus /> Add Detail Block
            </button>
            {errors.productDetails && !errors.productDetails?.[0] && (
              <p className="text-red-500 text-sm">
                {errors.productDetails.message}
              </p>
            )}
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-text">
                <FaDollarSign /> Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="w-full border p-2 rounded mt-1 input"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-text">
                <FaPercent /> Discount Price In Percent
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discountInPercent", { valueAsNumber: true })}
                className="w-full border p-2 rounded mt-1 input"
              />
            </div>
          </div>

          {/* Category, Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-text">
                <FaList /> Category
              </label>
              <input
                {...register("category")}
                className="w-full border p-2 rounded mt-1 input"
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-text">
                <FaStore /> Brand
              </label>
              <input
                {...register("brand")}
                className="w-full border p-2 rounded mt-1 input"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaBoxOpen /> Stock
            </label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          {/* Colors */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaTag /> Colors (comma-separated)
            </label>
            <input
              placeholder="e.g. Red, Blue, Green"
              {...register("colors")}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.colors && (
              <p className="text-red-500 text-sm">{errors.colors.message}</p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaTag /> Sizes (comma-separated)
            </label>
            <input
              placeholder="e.g. S, M, L, XL"
              {...register("sizes")}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.sizes && (
              <p className="text-red-500 text-sm">{errors.sizes.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaTag /> Tags (comma-separated)
            </label>
            <input
              {...register("tags")}
              className="w-full border p-2 rounded mt-1 input"
            />
            {errors.tags && (
              <p className="text-red-500 text-sm">{errors.tags.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-text">
              <FaCamera /> Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 input"
            />
            <div className="flex flex-wrap mt-3 gap-3">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  className="w-20 h-20 object-cover border rounded"
                />
              ))}
            </div>
          </div>

          {/* Variations */}
          <div className="mb-8">
            <div className="space-y-4 border border-gray-100 p-4 rounded-lg">
              <label className="flex items-center gap-2 text-text">
                <FaSortAmountDown /> Product Variations
              </label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2"
                >
                  <input
                    placeholder="Color"
                    {...register(`variations.${index}.color`)}
                    className="border p-2 rounded input"
                  />
                  <input
                    placeholder="Size"
                    {...register(`variations.${index}.size`)}
                    className="border p-2 rounded input"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    {...register(`variations.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="border p-2 rounded input"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 text-xl hover:text-red-800 cursor-pointer flex items-center justify-center"
                  >
                    <FaTrash /> <span className="md:hidden ml-5">Remove</span>
                  </button>
                  <span className="md:hidden border-b border-gray-200"></span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ color: "", size: "", quantity: 0 })}
              className="mt-3 flex items-center gap-2 text-primary hover:underline cursor-pointer"
            >
              <FaPlus /> Add Variation
            </button>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <img
                  src="loading.gif"
                  alt="loading"
                  className="w-8 h-8 mx-auto"
                />
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
