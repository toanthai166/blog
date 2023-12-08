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
