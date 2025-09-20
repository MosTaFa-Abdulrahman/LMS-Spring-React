import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const replySlice = createApi({
  reducerPath: "repliesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/replies" }),
  tagTypes: ["Reply"],
  endpoints: (builder) => ({
    // Get replies for a specific comment
    getReplies: builder.query({
      query: ({ commentId, page = 1, size = 10 }) => ({
        url: `/comment/${commentId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: (result, error, { commentId }) => [
        { type: "Reply", id: `COMMENT_${commentId}` },
        "Reply",
      ],
    }),

    // Create reply
    createReply: builder.mutation({
      query: (replyData) => ({
        url: "",
        method: "POST",
        data: replyData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, replyData) => [
        { type: "Reply", id: `COMMENT_${replyData.commentId}` },
        "Reply",
      ],
    }),

    // Delete reply
    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/${replyId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Reply"],
    }),

    // Toggle like on reply
    toggleReplyLike: builder.mutation({
      query: (replyId) => ({
        url: `/${replyId}/like`,
        method: "POST",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Reply"],
    }),
  }),
});

export const {
  useGetRepliesQuery,
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useToggleReplyLikeMutation,
} = replySlice;
