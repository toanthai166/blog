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
      element: (
        <PrivateRoute component={<BlogManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.blog,
      element: (
        <PrivateRoute component={<BlogManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.user,
      element: (
        <PrivateRoute component={<UserManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.category,
      element: (
        <PrivateRoute component={<CategoryManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.book,
      element: (
        <PrivateRoute component={<BookManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.book,
      element: (
        <PrivateRoute component={<BookManagement />} role={roles.admin} />
      ),
    },
    {
      path: AppRoutes.profile_management,
      element: (
        <PrivateRoute component={<ProfileManagement />} role={roles.admin} />
      ),
    },
  ]);
};
