//Package Imports
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

//Local Imports
import { useEditProductMutation } from "../../services/productApi/productApi";

// Zod schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0, "Price must be positive"),
  discountInPercent: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  tags: z.string().optional().or(z.literal("")),
  variations: z
    .array(
      z.object({
        color: z.string(),
        size: z.string(),
        quantity: z.number(),
      })
    )
    .optional(),
  images: z.any().optional(), // Will handle image files separately
});

const EditProductModal = ({ onClose, product, onSave }) => {
  const [editProduct, { isLoading }] = useEditProductMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
      price: product.price || 0,
      discountInPercent: product.discountInPercent || 0,
      stock: product.stock || 0,
      tags: product.tags || "",
    },
  });

  const [previewImages, setPreviewImages] = useState(product.images || []);

  useEffect(() => {
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        setValue(key, value);
      });
      setPreviewImages(product.images || []);
    }
  }, [product, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  //   const onSubmit = async (data) => {
  //     const productID = product?._id;
  //     const finalImages = previewImages.map(
  //       (img) => (img.file ? img.file : img) // send file if newly added, or existing URL if already uploaded
  //     );
  //     const payload = { ...data, images: finalImages };

  //     console.log("Edited product data:", payload);
  //     try {
  //       const response = await editProduct({ productID, ...payload }).unwrap();
  //       toast.success(response.message || "Product updated successfully");
  //       onClose(); // Close modal after success
  //     } catch (err) {
  //       toast.error(err?.data?.message || "An error occurred");
  //     }
  //   };

  const onSubmit = async (data) => {
    const productID = product?._id;

    // 🔁 Clean up the tags field
    if (!data.tags?.trim()) {
      delete data.tags;
    }
    const formData = new FormData();

    formData.append("name", String(data.name));
    formData.append("description", String(data.description));
    formData.append("price", String(data.price));
    formData.append("discountInPercent", String(data.discountInPercent || 0));
    formData.append("category", String(data.category));
    formData.append("brand", String(data.brand));
    formData.append("stock", String(data.stock));
    formData.append("tags", String(data.tags || ""));

    // Variations (assuming it's an array of objects)
    if (data.variations) {
      formData.append("variations", JSON.stringify(data.variations));
    }

    // Handle images
    let hasNewImages = false;
    previewImages.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
        hasNewImages = true;
      }
      if (!img.file && img.url) {
        formData.append("existingImages", JSON.stringify(img)); // send existing image info
      }
    });

    if (!hasNewImages && previewImages.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      const response = await editProduct({ productID, formData }).unwrap();
      toast.success(response.message || "Product updated successfully");
      window.location.reload(true);
      // navigate("/product_management");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 z-52 bg-black/40 flex justify-center items-center ">
      <div className="bg-white p-10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input {...register("name")} className="input" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea {...register("description")} className="input" />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="input"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Discount (%)</label>
              <input
                type="number"
                {...register("discountInPercent", { valueAsNumber: true })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <input {...register("category")} className="input" />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Brand</label>
              <input {...register("brand")} className="input" />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="input"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <input
              {...register("tags")}
              onBlur={(e) => (e.target.value = e.target.value.trim())}
              className="input"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block mb-1 font-medium">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mb-2"
            />
            <div className="flex flex-wrap gap-3">
              {previewImages.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={img.url || img}
                    alt={`product-img-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-black text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 w-full cursor-pointer border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 w-full cursor-pointer bg-primary text-white rounded hover:bg-primary/70"
              disabled={isLoading}
            >
              {isLoading ? (
                <img
                  src="loading.gif"
                  alt="loading"
                  className="w-8 h-8 mx-auto"
                />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
