import request from "../services/axios.service";
export const createBlog = async (data) => {
  const res = await request.post("/blog/create", data);
  return res;
};
export const updateBlog = async (data) => {
  const res = await request.patch(`/blog/${data.id}`, data);
  return res;
};

export const changeIsActiveBlog = async (data) => {
  const res = await request.patch(`/blog/${data.blogId}/active`, data);
  return res;
};
export const getBlogs = async (filter) => {
  const res = await request.get(
    `/blog?page=${filter.page}&limit=${filter.limit}${
      filter.isActive ? `&isActive=true` : ""
    }${filter.categoryId ? `&categoryId=${filter.categoryId}` : ""}`
  );
  return res;
};
export const deleteBlog = async (blogId) => {
  const res = await request.delete(`/blog/${blogId}`);
  return res;
};
export const getBlogById = async (blogId) => {
  if (!blogId) return null;
  const res = await request.get(`/blog/${blogId}`);
  return res;
};
