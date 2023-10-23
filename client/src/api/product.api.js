import request from "../services/axios.service";
export const createProduct = async (data) => {
  const res = await request.post("/product/create", data);
  return res;
};
export const updateProduct = async (data) => {
  const res = await request.patch(`/product/${data.id}`, data);
  return res;
};

export const changeIsActiveProduct = async (data) => {
  const res = await request.patch(`/product/${data.id}/active`, data);
  return res;
};
export const getproducs = async (filter) => {
  const res = await request.get(
    `/product?page=${filter.page}&limit=${filter.limit}${
      filter.isActive ? `&isActive=true` : ""
    }${filter.categoryId ? `&categoryId=${filter.categoryId}` : ""}`
  );
  return res;
};
export const deleteProduct = async (id) => {
  const res = await request.delete(`/product/${id}`);
  return res;
};
export const getproducById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/product/${id}`);
  return res;
};
