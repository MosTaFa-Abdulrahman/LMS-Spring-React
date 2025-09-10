import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const sectionSlice = createApi({
  reducerPath: "sectionsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/sections" }),
  tagTypes: ["Section"],

  endpoints: (builder) => ({
    // Create new Section
    createSection: builder.mutation({
      query: (sectionData) => ({
        url: "",
        method: "POST",
        data: sectionData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Section"],
    }),

    // Update Section
    updateSection: builder.mutation({
      query: ({ sectionId, ...sectionData }) => ({
        url: `/${sectionId}`,
        method: "PUT",
        data: sectionData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { sectionId }) => [
        { type: "Section", id: sectionId },
        "Section",
      ],
    }),

    // Delete Section
    deleteSection: builder.mutation({
      query: (sectionId) => ({
        url: `/${sectionId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Section"],
    }),

    // Get all sections with pagination (for infinite scroll)
    getSections: builder.query({
      query: ({ courseId, page = 1, size = 10 }) => ({
        url: `/course/${courseId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Section"],
    }),
  }),
});

export const {
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetSectionsQuery,
} = sectionSlice;
