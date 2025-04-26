import { apiSlice } from "../apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/create",
        method: "POST",
        body: orderData,
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
