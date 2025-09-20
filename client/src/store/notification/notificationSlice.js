import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const notificationSlice = createApi({
  reducerPath: "notificationsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/notifications" }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: ["Notification"],
    }),

    // Get unread count
    getUnreadCount: builder.query({
      query: () => ({
        url: "/unread-count",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || 0;
      },
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Notification"],
    }),

    // Mark single notification as read
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/read/${notificationId}`,
        method: "PUT",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Notification"],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/read-all",
        method: "PUT",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useDeleteNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationSlice;
