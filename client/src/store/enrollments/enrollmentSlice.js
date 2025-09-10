import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const enrollmentSlice = createApi({
  reducerPath: "enrollmentsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/enrollments" }),
  tagTypes: ["Enrollment"],

  endpoints: (builder) => ({
    // Create new Enrollment
    createEnrollment: builder.mutation({
      query: (enrollmentData) => ({
        url: "",
        method: "POST",
        data: enrollmentData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Enrollment"],
    }),

    // Get all Enrollments with pagination
    getEnrollments: builder.query({
      query: ({ userId, page = 1, size = 10 }) => ({
        url: `/user/${userId}?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Enrollment"],
    }),
  }),
});

export const { useCreateEnrollmentMutation, useGetEnrollmentsQuery } =
  enrollmentSlice;
