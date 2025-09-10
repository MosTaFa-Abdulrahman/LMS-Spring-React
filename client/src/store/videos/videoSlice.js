import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const videoSlice = createApi({
  reducerPath: "videosApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/videos" }),
  tagTypes: ["Video"],

  endpoints: (builder) => ({
    // Create new Video
    createVideo: builder.mutation({
      query: (videoData) => ({
        url: "",
        method: "POST",
        data: videoData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Video"],
    }),

    // Update Video
    updateVideo: builder.mutation({
      query: ({ videoId, ...videoData }) => ({
        url: `/${videoId}`,
        method: "PUT",
        data: videoData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { videoId }) => [
        { type: "Video", id: videoId },
        "Video",
      ],
    }),

    // Delete Video
    deleteVideo: builder.mutation({
      query: (videoId) => ({
        url: `/${videoId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Video"],
    }),

    // Get all videos with pagination
    getVideos: builder.query({
      query: ({ sectionId, page = 1, size = 10 }) => ({
        url: `/section/${sectionId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Video"],
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useGetVideosQuery,
} = videoSlice;
