export const AppRoutes = {
  home: "/",
  search: "/search",
  secret: "/secret",
  postDetail: "/post/detail/:id",
  postDetailId: (id) => `/post/detail/${id}`,
  profile: "/profile",

  orderDetail: "/order/detail/:id",
  orderDetailId: (id) => `/order/detail/${id}`,

  myAddress: "/address",
  addressDetail: "/address/detail/:id",
  addressDetailId: (id) => `/address/detail/${id}`,

  product: "/product",
  productDetail: "/product/detail/:id",
  productDetailId: (id) => `/product/detail/${id}`,
  faq: "/faq",
  login: "/login",
  contact: "/contact",
  register: "/register",
  404: "/404",
  payment: "/payment",

  // Admin
  admin: "/admin",
  user: "/admin/user",
  blog: "/admin/blog",
  createBlog: "/admin/blog/create",
  blogEdit: "/admin/blog/edit/:id",
  blogEditById: (id) => `/admin/blog/edit/${id}`,
  blogDetail: "/admin/blog/detail/:id",
  blogDetailId: (id) => `/admin/blog/detail/${id}`,

  category: "/admin/category",
  createCate: "/admin/category/create",
  categoryEdit: "/admin/category/edit/:id",
  categoryEditById: (id) => `/admin/category/edit/${id}`,
  categoryDetail: "/admin/category/detail/:id",
  categoryDetailId: (id) => `/admin/category/detail/${id}`,
  productManagement: "/admin/product",
  createProduct: "/admin/product/create",
  productEdit: "/admin/product/edit/:id",
  productEditById: (id) => `/admin/product/edit/${id}`,
  productManagementDetail: "/admin/product/detail/:id",
  productManagementDetailId: (id) => `/admin/product/detail/${id}`,
  profile_management: "/admin/profile_management",

  orderManagement: "/admin/order-management",
  adminOrderDetail: "/admin/order-management/detail/:id",
  adminOrderDetailId: (id) => `/admin/order-management/detail/${id}`,

  faqManagement: "/admin/faq-management",
  createFaq: "/admin/faq/create",
  faqEdit: "/admin/faq/edit/:id",
  faqEditById: (id) => `/admin/faq/edit/${id}`,
  faqDetail: "/admin/faq/detail/:id",
  faqDetailId: (id) => `/admin/faq/detail/${id}`,

  discountManagement: "/admin/discount-management",
  createDiscount: "/admin/discount/create",
  discountEdit: "/admin/discount/edit/:id",
  discountEditById: (id) => `/admin/discount/edit/${id}`,
  discountDetail: "/admin/discount/detail/:id",
  discountDetailId: (id) => `/admin/discount/detail/${id}`,

  contactManagement: "/admin/contact-management",
  contactDetail: "/admin/contact-management/detail/:id",
  contactDetailId: (id) => `/admin/contact-management/detail/${id}`,

  revenueManagement: "/admin/contact-management",
};
