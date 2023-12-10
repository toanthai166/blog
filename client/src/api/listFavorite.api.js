import request from "../services/axios.service";

export const listFavorite = async (userId) => {
  const res = await request.get(`/favorites?userId=${userId}`);
  return res;
};

export const addToListFavorite = async (data) => {
  const res = await request.post("/favorites/create", data);
  return res;
};
export const removeToListFavorite = async (data) => {
  const res = await request.post(`/favorites/remove`, data);
  return res;
};
