import request from "../services/axios.service";

export const myCart = async (userId) => {
  const res = await request.get(`/cart?userId=${userId}`);
  return res;
};

export const addToCart = async (data) => {
  const res = await request.post("/cart/create", data);
  return res;
};
export const removeToCart = async (data) => {
  console.log(data);
  const res = await request.post(`/cart/remove`, data);
  return res;
};
