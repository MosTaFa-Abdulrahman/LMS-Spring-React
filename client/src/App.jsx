import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";

// Context
import { AuthContext } from "./context/AuthContext";

// Navbar & Footer
import Navbar from "./components/global/navbar/Navbar";
import Footer from "./components/global/footer/Footer";

// Pages ((User))
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/notFound/NotFound";
import Home from "./pages/home/Home";
import Courses from "./pages/courses/Courses";
import Course from "./pages/course/Course";
import SingleUser from "./pages/singleUser/SingleUser";
import Quizzes from "./pages/Quizzes/Quizzes";
import Quiz from "./pages/quiz/Quiz";

// Pages ((Admin))
import AdminCourses from "./pages/admin/adminCourses/AdminCourses";
import CreateCourse from "./pages/admin/createCourse/CreateCourse";
import EditCourse from "./pages/admin/editCourse/EditCourse";
import AdminUsers from "./pages/admin/adminUsers/AdminUsers";

// Dashboard layout
const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </>
  );
};

// Simple layout for auth pages
const SimpleLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Protected ((ADMIN))
const AdminRoute = ({ element }) => {
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData.userInfo;

  if (!currentUser || currentUser?.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return element;
};

// Protected ((USER))
const AuthenticatedRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return element;
};

function App() {
  const { currentUser } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        // Authenticated ((USER))
        {
          path: "/",
          element: <AuthenticatedRoute element={<Home />} />,
        },
        {
          path: "/courses",
          element: <AuthenticatedRoute element={<Courses />} />,
        },
        {
          path: "/courses/:id",
          element: <AuthenticatedRoute element={<Course />} />,
        },
        {
          path: "/users/:userId",
          element: currentUser ? <SingleUser /> : <Navigate to="/" />,
        },
        {
          path: "/quizzes",
          element: <AuthenticatedRoute element={<Quizzes />} />,
        },
        {
          path: "/quizzes/:id",
          element: <AuthenticatedRoute element={<Quiz />} />,
        },

        // Authenticated ((ADMIN ))
        {
          path: "/admin/courses",
          element: <AdminRoute element={<AdminCourses />} />,
        },
        {
          path: "/admin/create/course",
          element: <AdminRoute element={<CreateCourse />} />,
        },
        {
          path: "/admin/edit/:courseId/course",
          element: <AdminRoute element={<EditCourse />} />,
        },
        {
          path: "/admin/users",
          element: <AdminRoute element={<AdminUsers />} />,
        },
      ],
    },

    {
      path: "/",
      element: <SimpleLayout />,
      children: [
        {
          path: "/auth",
          element: !currentUser ? <Auth /> : <Navigate to="/" />,
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
