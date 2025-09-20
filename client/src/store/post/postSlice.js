import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const postSlice = createApi({
  reducerPath: "postsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/posts" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Get all posts with infinite scroll support
    getPosts: builder.query({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Transform API response to match our expected format
        return {
          content: response.data.content || [],
          hasMore: response.data.hasNext || false,
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          content: [...currentCache.content, ...newItems.content],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["Post"],
    }),

    // Get posts for specific user with infinite scroll support
    getPostsForUser: builder.query({
      query: ({ userId, page = 1, size = 10 }) => ({
        url: `/user/${userId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          content: response.data.content || [],
          hasMore: response.data.hasNext || false,
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return `user-${queryArgs.userId}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          content: [...currentCache.content, ...newItems.content],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.userId !== previousArg?.userId
        );
      },
      providesTags: (result, error, { userId }) => [
        { type: "Post", id: `USER_${userId}` },
        "Post",
      ],
    }),

    // Get single post
    getPost: builder.query({
      query: (postId) => ({
        url: `/${postId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    // Create post
    createPost: builder.mutation({
      query: (postData) => ({
        url: "",
        method: "POST",
        data: postData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Post"],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ postId, ...postData }) => ({
        url: `/${postId}`,
        method: "PUT",
        data: postData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        "Post",
      ],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/${postId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        "Post",
      ],
    }),

    // Toggle like/dislike
    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/${postId}/like`,
        method: "POST",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        "Post",
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsForUserQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
} = postSlice;
