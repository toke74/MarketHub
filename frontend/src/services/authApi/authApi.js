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
  useLogoutUserMutation,
} = authApi;
