import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const fileSlice = createApi({
  reducerPath: "filesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/files" }),
  tagTypes: ["File"],

  endpoints: (builder) => ({
    // Create new File
    createFile: builder.mutation({
      query: (fileData) => ({
        url: "",
        method: "POST",
        data: fileData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["File"],
    }),

    // Update File
    updateFile: builder.mutation({
      query: ({ fileId, ...fileData }) => ({
        url: `/${fileId}`,
        method: "PUT",
        data: fileData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { fileId }) => [
        { type: "File", id: fileId },
        "File",
      ],
    }),

    // Delete File
    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `/${fileId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["File"],
    }),

    // Get all files with pagination
    getFiles: builder.query({
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
      providesTags: ["File"],
    }),
  }),
});

export const {
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useGetFilesQuery,
} = fileSlice;
