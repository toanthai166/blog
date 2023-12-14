import request from "../services/axios.service";

export const updateProfile = async (dataUpdate) => {
  const data = await request.patch(`/users/${dataUpdate.id}`, dataUpdate);
  return data;
};

export const getUserById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/users/${id}`);
  return res;
};

export const getUsers = async (filter) => {
  const res = await request.get(
    `/users?page=${filter.page}&limit=${filter.limit}`
  );
  return res;
};

export const changeIsActiveUser = async (data) => {
  const res = await request.patch(`/users/${data.userId}/active`, data);
  return res;
};
