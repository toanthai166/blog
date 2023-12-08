import { Outlet, createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app-routes";
import { Faq, Home, Login, Profile, Register } from "../screens";
import PrivateRoute from "../components/PrivateRoute";
import { roles } from "../ultis/role";
import BlogManagement from "../screens/admin/blog";
import UserManagement from "../screens/admin/user";
import CategoryManagement from "../screens/admin/category";
import ProfileManagement from "../screens/admin/profile-management";
import FormCreateBlog from "../screens/admin/blog/form";
import FormCategory from "../screens/admin/category/form";
import Layouts from "../layouts/main-layout";
import FaqManagement from "../screens/admin/faq-management";
import ContactManagement from "../screens/admin/contact";
import FormFaq from "../screens/admin/faq-management/form";
import ProductManagement from "../screens/admin/product";
import FormProduct from "../screens/admin/product/form";
import OrderManagement from "../screens/admin/order";
import DetailOrder from "../screens/admin/order/detail";
import ContactDetail from "../screens/admin/contact/detail";
import Contact from "../screens/contact";
import Product from "../screens/product";
import ProductDetail from "../screens/product/detail";
import MyAddress from "../screens/profile/component/address";
import DiscountManagement from "../screens/admin/discount";
import FormDiscount from "../screens/admin/discount/form";
import Payment from "../screens/payment";
import PostDetail from "../screens/home/post-detail";
import Search from "../screens/home/search";

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
    // Layouts

    {
      path: AppRoutes.home,
      element: (
        <Layouts>
          <Outlet></Outlet>
        </Layouts>
      ),
      children: [
        {
          path: AppRoutes.home,
          element: <Home />,
        },
        {
          path: AppRoutes.search,
          element: <Search />,
        },

        {
          path: AppRoutes.postDetail,
          element: <PostDetail />,
        },
        {
          path: AppRoutes.product,
          element: <Product />,
        },
        {
          path: AppRoutes.payment,
          element: <Payment />,
        },
        {
          path: AppRoutes.productDetail,
          element: <ProductDetail />,
        },
        // address
        // {
        //   path: AppRoutes.myAddress,
        //   element: <Profile />,
        // },
        {
          path: AppRoutes.profile,
          element: <Profile />,
        },
        {
          path: AppRoutes.contact,
          element: <Contact />,
        },
      ],
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
          path: AppRoutes.productManagement,
          element: <ProductManagement />,
        },
        {
          path: AppRoutes.createProduct,
          element: <FormProduct />,
        },
        {
          path: AppRoutes.productManagementDetail,
          element: <FormProduct isDetail />,
        },
        {
          path: AppRoutes.productEdit,
          element: <FormProduct isEdit />,
        },
        {
          path: AppRoutes.profile_management,
          element: <ProfileManagement />,
        },
        {
          path: AppRoutes.orderManagement,
          element: <OrderManagement />,
        },
        {
          path: AppRoutes.adminOrderDetail,
          element: <DetailOrder />,
        },
        {
          path: AppRoutes.faqManagement,
          element: <FaqManagement />,
        },

        {
          path: AppRoutes.createFaq,
          element: <FormFaq />,
        },
        {
          path: AppRoutes.faqDetail,
          element: <FormFaq isDetail />,
        },
        {
          path: AppRoutes.faqEdit,
          element: <FormFaq isEdit />,
        },
        {
          path: AppRoutes.contactManagement,
          element: <ContactManagement />,
        },
        {
          path: AppRoutes.contactDetail,
          element: <ContactDetail />,
        },

        //
        {
          path: AppRoutes.discountManagement,
          element: <DiscountManagement />,
        },

        {
          path: AppRoutes.createDiscount,
          element: <FormDiscount />,
        },
        // {
        //   path: AppRoutes.faqDetail,
        //   element: <FormFaq isDetail />,
        // },
        // {
        //   path: AppRoutes.faqEdit,
        //   element: <FormFaq isEdit />,
        // },
        // {
        //   path: AppRoutes.contactManagement,
        //   element: <ContactManagement />,
        // },
        // {
        //   path: AppRoutes.contactDetail,
        //   element: <ContactDetail />,
        // },
      ],
    },
  ]);
};
