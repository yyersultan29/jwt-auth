import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  keepUnusedDataFor: 60,
  tagTypes: ["Auth", "Login", "Register", "Refresh"],
  endpoints: (builder) => ({
    // login
    signIn: builder.query({
      query: ({ userName, password }) => ({
        url: "/auth/sign-in",
        method: "POST",
        data: { userName, password },
      }),
      providesTags: ["Login"],
    }),

    // register
    signUp: builder.query({
      query: () => ({
        url,
      }),
      providesTags: ["Register"],
    }),
  }),
});
