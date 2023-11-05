import request from "../services/axios.service";

export const getDiscounts = async (filter) => {
  const res = await request.get(
    `/discount?page=${filter.page}&limit=${filter.limit}${
      filter.isActive ? `&isActive=${filter.isActive}` : ""
    }${filter.productIds ? `&productIds=${filter.productIds}` : ""}`
  );
  return res;
};
export const changeIsActiveDiscount = async (data) => {
  const res = await request.patch(`/discount/${data.id}/active`, data);
  return res;
};
export const createDiscount = async (data) => {
  const res = await request.post("/discount/create", data);
  return res;
};
export const updateDiscount = async (data) => {
  const res = await request.patch(`/discount/${data.id}`, data);
  return res;
};
export const getDiscountById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/discount/${id}`);
  return res;
};
