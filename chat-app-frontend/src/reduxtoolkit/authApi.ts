import { mainApi } from "./mainApi";
const Tags = Object.freeze({
  AUTH: "AUTH",
});

const apiWithTags = mainApi.enhanceEndpoints({
  addTagTypes: [Tags.AUTH],
});
export const authAPi = apiWithTags.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [Tags.AUTH],
    }),
    register: builder.mutation({
      query: credentials => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [Tags.AUTH],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authAPi;
