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
  }),
});

export const {
  useRegisterSellerMutation,
  useActivateSellerMutation,
  useResendSellerVerificationTokenMutation,
} = sellerApi;
