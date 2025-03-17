import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
        credentials: "include", // Required for cookies
      }),
    }),

    activateUser: builder.mutation({
      query: (data) => ({
        url: "/user/activate_user",
        method: "POST",
        body: data,
        credentials: "include", // Required for sending cookies
      }),
    }),
    resendActivationToUser: builder.mutation({
      query: (data) => ({
        url: "/user/resend_activation_code",
        method: "POST",
        body: data,
        credentials: "include", // Required for sending cookies
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
        credentials: "include", // Required for sending cookies
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "/user/me", // Your backend route for getting user data
        method: "GET",
        credentials: "include",
      }),
    }),
    updateAccessToken: builder.query({
      query: () => ({
        url: "/user/refresh_Token", // Your backend route for updating access token
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 0, // Ensure the token is always fresh
      providesTags: ["User"],
    }),
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: "/user/update_avatar",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"], // Invalidate cache to refresh user data
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update_me", // Adjust based on your backend route
        method: "PUT",
        body: data,
        credentials: "include", // Required for sending cookies
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/user/forgot_password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset_password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "GET",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useActivateUserMutation,
  useResendActivationToUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateAccessTokenQuery,
  useUpdateAvatarMutation,
  useUpdateUserProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
} = authApi;
