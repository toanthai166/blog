import * as request from "../services/searchAddress.service";

export const getCity = async () => {
  const res = await request.get(`/provinces/getAll?limit=-1`);
  return res;
};
export const changeIsDefaultAddress = async (data) => {
  const res = await request.patch(`/address/${data.id}/default`, data);
  return res;
};
export const createAddress = async (data) => {
  const res = await request.post("/address/create", data);
  return res;
};
export const updateAddress = async (data) => {
  const res = await request.patch(`/address/${data.id}`, data);
  return res;
};
export const getAddressById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/address/${id}`);
  return res;
};
export const deleteAddress = async (id) => {
  console.log(id);
  const res = await request.delete(`/address/${id}`);
  return res;
};
