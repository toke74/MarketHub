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
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
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
  useLogoutUserMutation,
} = authApi;
