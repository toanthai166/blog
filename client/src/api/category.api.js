import request from "../services/axios.service";
export const createCategory = async (data) => {
  const res = await request.post("/category/create", data);
  return res;
};

export const getCategoriesIsActive = async (data) => {
  const res = await request.get("/category?isActive=true", data);
  return res;
};
export const getCategories = async () => {
  const res = await request.get("/category");
  return res;
};
export const changeIsActiveCategory = async (data) => {
  const res = await request.patch(`/category/${data.categoryId}/active`, data);
  return res;
};
export const deleteCate = async (categoryId) => {
  const res = await request.delete(`/category/${categoryId}`);
  return res;
};
export const updateCategory = async (data) => {
  const res = await request.patch(`/category/${data.id}`, data);
  return res;
};
export const getCategoryById = async (categoryId) => {
  const res = await request.get(`/category/${categoryId}`);
  return res;
};
