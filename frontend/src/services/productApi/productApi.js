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
  }),
});

export const { useCreateProductMutation, useGetAllProductsQuery } = productApi;
