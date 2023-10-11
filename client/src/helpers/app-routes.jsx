export const AppRoutes = {
  home: "/",
  secret: "/secret",
  profile: "/profile",
  faq: "/faq",
  login: "/login",
  register: "/register",
  404: "/404",

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
  book: "/admin/book",
  contact: "/admin/contact",
  profile_management: "/admin/profile_management",
};
