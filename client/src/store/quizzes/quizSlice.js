import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const quizSlice = createApi({
  reducerPath: "quizsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/quizzes" }),
  tagTypes: ["Quiz"],

  endpoints: (builder) => ({
    // Create quiz ((Transactional 😎))
    createQuiz: builder.mutation({
      query: (quizData) => ({
        url: "",
        method: "POST",
        data: quizData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Quiz"],
    }),

    // Update quiz
    updateQuiz: builder.mutation({
      query: ({ quizId, ...quizData }) => ({
        url: `/${quizId}`,
        method: "PUT",
        data: quizData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Quiz", id: quizId },
        "Quiz",
      ],
    }),

    // Delete quiz
    deleteQuiz: builder.mutation({
      query: (quizId) => ({
        url: `/${quizId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Quiz"],
    }),

    // Get all quizs with pagination
    getQuizzes: builder.query({
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
      providesTags: ["Quiz"],
    }),

    // Get single quiz by ID for ((Take 🤞))
    getQuizById: builder.query({
      query: (quizId) => ({
        url: `/${quizId}/take`,
        method: "GET",
      }),
      providesTags: (result, error, quizId) => [{ type: "Quiz", id: quizId }],
    }),

    // Get single quiz by ID for ((Update 🤞))
    getSingleQuizById: builder.query({
      query: (quizId) => ({
        url: `/${quizId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, quizId) => [{ type: "Quiz", id: quizId }],
    }),

    // Get All Finished For ((Specific-User)) not paginated for (ADMIN || INSTRUCTOR)
    getAllQuizzesForUser: builder.query({
      query: (userId) => ({
        url: `/user/${userId}/attempts`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, userId) => [
        { type: "Quiz", id: `user-${userId}` },
      ],
    }),
    // Get All Finished For ((Current-User)) not paginated
    getAllQuizzesForCurrentUser: builder.query({
      query: () => ({
        url: `/my-attempts`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error) => [{ type: "Quiz" }],
    }),

    // Submit All
    submitAnswers: builder.mutation({
      query: ({ quizId, answers }) => ({
        url: `/${quizId}/submit`,
        method: "POST",
        data: answers,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { quizId }) => [
        { type: "Quiz", id: quizId },
        "Quiz",
      ],
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetQuizzesQuery,
  useGetQuizByIdQuery, // for take
  useGetSingleQuizByIdQuery, // for update
  useGetAllQuizzesForUserQuery, // for specificUser
  useGetAllQuizzesForCurrentUserQuery, // for currentUser
  useSubmitAnswersMutation,
} = quizSlice;
