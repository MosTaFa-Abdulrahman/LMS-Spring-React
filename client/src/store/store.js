import { configureStore } from "@reduxjs/toolkit";

// Users
import { userSlice } from "./users/userSlice";
// Courses
import { courseSlice } from "./courses/courseSlice";
// Sections
import { sectionSlice } from "./sections/sectionSlice";
// Videos
import { videoSlice } from "./videos/videoSlice";
// Files
import { fileSlice } from "./files/fileSlice";
// Enrollments
import { enrollmentSlice } from "./enrollments/enrollmentSlice";
// Quizzes
import { quizSlice } from "./quizzes/quizSlice";

export const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
    [courseSlice.reducerPath]: courseSlice.reducer,
    [sectionSlice.reducerPath]: sectionSlice.reducer,
    [videoSlice.reducerPath]: videoSlice.reducer,
    [fileSlice.reducerPath]: fileSlice.reducer,
    [enrollmentSlice.reducerPath]: enrollmentSlice.reducer,
    [quizSlice.reducerPath]: quizSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userSlice.middleware)
      .concat(courseSlice.middleware)
      .concat(sectionSlice.middleware)
      .concat(videoSlice.middleware)
      .concat(fileSlice.middleware)
      .concat(enrollmentSlice.middleware)
      .concat(quizSlice.middleware),
});
