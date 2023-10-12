import { createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app-routes";
import { Faq, Home, Login, Profile, Register, Secret } from "../screens";
import PrivateRoute from "../components/PrivateRoute";
import { roles } from "../ultis/role";
import BlogManagement from "../screens/admin/blog";
import UserManagement from "../screens/admin/user";
import CategoryManagement from "../screens/admin/category";
import BookManagement from "../screens/admin/book";
import ProfileManagement from "../screens/admin/profile-management";
import FormCreateBlog from "../screens/admin/blog/form";
import FormCategory from "../screens/admin/category/form";

export const useRouter = () => {
  return createBrowserRouter([
    {
      path: AppRoutes.login,
      element: <Login />,
    },
    {
      path: AppRoutes.register,
      element: <Register />,
    },
    {
      path: AppRoutes.home,
      element: <Home />,
    },
    {
      path: AppRoutes.faq,
      element: <Faq />,
    },
    {
      path: AppRoutes.secret,
      element: <Secret />,
    },
    {
      path: AppRoutes.profile,
      element: <Profile />,
    },
    //
    {
      path: AppRoutes.admin,
      element: <PrivateRoute role={roles.admin} />,
      children: [
        { path: AppRoutes.blog, element: <BlogManagement /> },
        {
          path: AppRoutes.createBlog,
          element: <FormCreateBlog />,
        },
        {
          path: AppRoutes.blogEdit,
          element: <FormCreateBlog isEdit />,
        },
        {
          path: AppRoutes.blogDetail,
          element: <FormCreateBlog isDetail />,
        },
        {
          path: AppRoutes.user,
          element: <UserManagement />,
        },
        {
          path: AppRoutes.category,
          element: <CategoryManagement />,
        },
        {
          path: AppRoutes.createCate,
          element: <FormCategory />,
        },
        {
          path: AppRoutes.categoryEdit,
          element: <FormCategory isEdit />,
        },
        {
          path: AppRoutes.categoryDetail,
          element: <FormCategory isDetail />,
        },
        {
          path: AppRoutes.book,
          element: <BookManagement />,
        },
        {
          path: AppRoutes.book,
          element: <BookManagement />,
        },
        {
          path: AppRoutes.profile_management,
          element: <ProfileManagement />,
        },
        {
          path: AppRoutes.profile_management,
          element: <ProfileManagement />,
        },
        {
          path: AppRoutes.category,
          element: <CategoryManagement />,
        },
      ],
    },
  ]);
};
