import request from "../services/axios.service";

export const getAddresses = async (userId) => {
  const res = await request.get(`/address?userId=${userId}`);
  return res;
};

export const createAddress = async (data) => {
  const res = await request.post("/address/create", data);
  return res;
};
export const updateAddress = async (data) => {
  const res = await request.post(`/address/edit`, data);
  return res;
};

export const deleteAddress = async (data) => {
  const res = await request.post(`/address/remove`, data);
  return res;
};
