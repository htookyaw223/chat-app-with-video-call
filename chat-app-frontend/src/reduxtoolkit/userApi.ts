import { mainApi } from "./mainApi";
const Tags = Object.freeze({
  AUTH: "AUTH",
});

const apiWithTags = mainApi.enhanceEndpoints({
  addTagTypes: [Tags.AUTH],
});
export const userApi = apiWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<any, string>({
      query: (userId: string) => ({
        url: "/friends/" + userId,
        method: "GET"
      }),
    }),
    getUserProfile: builder.query<any, string>({
      query: () => ({
        url: "/user/me",
        method: "GET"
      }),
    }),
    getFriendProfile: builder.query<any, string>({
      query: (friendId: string) => ({
        url: `/user/friends/${friendId}`,
        method: "GET"
      }),
    }),
  }),
});

export const { useGetFriendsQuery, useGetUserProfileQuery, useGetFriendProfileQuery } = userApi;
