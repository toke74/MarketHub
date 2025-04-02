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

    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/user/update_password",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    addUserAddress: builder.mutation({
      query: (data) => ({
        url: "/user/add_address",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    updateUserAddress: builder.mutation({
      query: ({ addressID, ...data }) => ({
        url: `/user/update_address/${addressID}`, // Dynamically inject addressID
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteUserAddress: builder.mutation({
      query: (addressID) => ({
        url: `/user/delete_address/${addressID}`, // Dynamically inject addressID
        method: "DELETE",
        credentials: "include",
      }),
    }),

    deleteUserAccount: builder.mutation({
      query: () => ({
        url: "/user/delete_user", // Dynamically inject addressID
        method: "DELETE",
        credentials: "include",
      }),
    }),

    socialAuth: builder.mutation({
      query: (data) => ({
        url: "/user/social_auth",
        method: "POST",
        body: data,
        credentials: "include", // Required for cookies
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
  useUpdatePasswordMutation,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useDeleteUserAccountMutation,
  useSocialAuthMutation,
  useLogoutUserMutation,
} = authApi;
