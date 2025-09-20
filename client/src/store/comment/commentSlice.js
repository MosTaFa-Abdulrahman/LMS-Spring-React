import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const commentSlice = createApi({
  reducerPath: "commentsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/comments" }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    // Get comments for a specific post
    getComments: builder.query({
      query: ({ postId, page = 1, size = 10 }) => ({
        url: `/post/${postId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: (result, error, { postId }) => [
        { type: "Comment", id: `POST_${postId}` },
        "Comment",
      ],
    }),

    // Create comment
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "",
        method: "POST",
        data: commentData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, commentData) => [
        { type: "Comment", id: `POST_${commentData.postId}` },
        "Comment",
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Comment"],
    }),

    // Toggle like on comment
    toggleCommentLike: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}/like`,
        method: "POST",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
} = commentSlice;
