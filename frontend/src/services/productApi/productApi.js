import { apiSlice } from "../apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create_product",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getAllProducts: builder.query({
      query: () => ({
        url: "/product/get_all_products",
        method: "GET",
        credentials: "include",
      }),
    }),

    editProduct: builder.mutation({
      query: ({ productID, formData }) => ({
        url: `/product/update_product/${productID}`,
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productID) => ({
        url: `/product/delete_product/${productID}`, // Dynamically inject productID
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useEditProductMutation,
  useDeleteProductMutation,
} = productApi;
