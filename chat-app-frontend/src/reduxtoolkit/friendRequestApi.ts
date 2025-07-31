import { mainApi } from "./mainApi";

const Tags = Object.freeze({
    AUTH: "AUTH",
    FRIEND_REQUEST: "FRIEND_REQUEST",
});

const apiWithTags = mainApi.enhanceEndpoints({
    addTagTypes: [Tags.AUTH, Tags.FRIEND_REQUEST],
});

export const friendRequestApi = apiWithTags.injectEndpoints({
    endpoints: (builder) => ({
        sendFriendRequest: builder.mutation({
            query: (body: { senderId: string; receiverId: string }) => ({
                url: "/friend-requests/send",
                method: "POST",
                body,
            }),
            invalidatesTags: [Tags.FRIEND_REQUEST],
        }),

        respondToFriendRequest: builder.mutation({
            query: (body: { requestId: string; action: "ACCEPT" | "DECLINE" }) => ({
                url: "/friend-requests/respond",
                method: "POST",
                body,
            }),
            invalidatesTags: [Tags.FRIEND_REQUEST],
        }),

        getReceivedFriendRequests: builder.query({
            query: (userId: string) => `/friend-requests/${userId}/received`,
            providesTags: [Tags.FRIEND_REQUEST],
        }),

        getSentFriendRequests: builder.query({
            query: (userId: string) => `/friend-requests/${userId}/sent`,
            providesTags: [Tags.FRIEND_REQUEST],
        }),
        getAvailableFriends: builder.query({
            query: (userId: string) => `/user/${userId}/available-friends`,
            providesTags: [Tags.FRIEND_REQUEST],
        }),
    }),
});

export const {
    useSendFriendRequestMutation,
    useRespondToFriendRequestMutation,
    useGetReceivedFriendRequestsQuery,
    useGetSentFriendRequestsQuery,
    useGetAvailableFriendsQuery
} = friendRequestApi;
