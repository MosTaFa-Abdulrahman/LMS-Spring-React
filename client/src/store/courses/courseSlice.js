import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const courseSlice = createApi({
  reducerPath: "coursesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/courses" }),
  tagTypes: ["Course"],

  endpoints: (builder) => ({
    // Create new Course
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "",
        method: "POST",
        data: courseData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Course"],
    }),

    // Create Course ((Transactional 😎))
    createCourseTransaction: builder.mutation({
      query: (courseData) => ({
        url: "/transaction",
        method: "POST",
        data: courseData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Course"],
    }),

    // Update Course
    updateCourse: builder.mutation({
      query: ({ courseId, ...courseData }) => ({
        url: `/${courseId}`,
        method: "PUT",
        data: courseData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        "Course",
      ],
    }),

    // Delete Course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Course"],
    }),

    // Get all courses with pagination
    getCourses: builder.query({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Return the full response structure to access pagination info and content
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Course"],
    }),

    // Get single Course by ID
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Search courses by title with pagination
    searchCourses: builder.query({
      query: ({ title, page = 1, size = 10 } = {}) => ({
        url: `/search?title=${encodeURIComponent(
          title
        )}&page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useCreateCourseTransactionMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useSearchCoursesQuery,
} = courseSlice;
