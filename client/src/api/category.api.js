import request from "../services/axios.service";
export const createCategory = async (data) => {
  const res = await request.post("/blogs", data, { timeout: 5000 });
  return res;
};
export const updateBlog = async (data) => {
  const res = await request.put(`/blogs/${data.blogId}`, data);
  return res;
};
export const publishBlog = async (data) => {
  const res = await request.put(`/blogs/${data.blogId}/publish`, data);
  return res;
};
export const getAllBlog = async () => {
  const res = await request.get("/blog?isActive=true");
  return res;
};
export const getCategories = async () => {
  const res = await request.get("/category?isActive=true");
  return res;
};
export const getDetails = async (blogId) => {
  const res = await request.get(`/blogs/${blogId}/details`);
  return res;
};
export const upLoadTitleImage = async (formData) => {
  const res = await request.post(`/blogs/upload-title-image`, formData, {
    timeout: 5000,
  });
  return res;
};
