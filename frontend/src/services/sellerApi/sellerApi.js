import { apiSlice } from "../apiSlice";

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerSeller: builder.mutation({
      query: (data) => ({
        url: "/vendor/register",
        method: "POST",
        body: data,
        credentials: "include", // Required for cookies
      }),
    }),

    activateSeller: builder.mutation({
      query: (token) => ({
        url: `/vendor/verify_email/${token}`,
        method: "GET",
        credentials: "include", // Required for sending cookies
      }),
    }),

    resendSellerVerificationToken: builder.mutation({
      query: (data) => ({
        url: "/vendor/resend_vendor_verify_email_token",
        method: "POST",
        body: data,
        credentials: "include", // Required for sending cookies
      }),
    }),

    loginSeller: builder.mutation({
      query: (data) => ({
        url: "/vendor/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    loadSeller: builder.query({
      query: () => ({
        url: "/vendor/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Seller"],
    }),

    updateSellerAccessToken: builder.query({
      query: () => ({
        url: "/vendor/vendor_refresh_token",
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 0, // Ensure token is always fresh
      providesTags: ["Seller"],
    }),
  }),
});

export const {
  useRegisterSellerMutation,
  useActivateSellerMutation,
  useResendSellerVerificationTokenMutation,
  useLoginSellerMutation,
  useLoadSellerQuery,
  useUpdateSellerAccessTokenQuery,
} = sellerApi;
