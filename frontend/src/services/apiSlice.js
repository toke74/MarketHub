import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  tagTypes: ["User"], // Helps with cache invalidation
  endpoints: () => ({}), // Extend in separate files (e.g., authApi.js, productApi.js)
});

export default apiSlice;
