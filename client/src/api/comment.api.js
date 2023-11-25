import request from "../services/axios.service";
export const createComment = async (data) => {
  const res = await request.post("/comment/create", data);
  return res;
};
export const updateComment = async (data) => {
  const res = await request.patch(`/comment/${data.id}`, data);
  return res;
};

export const getComments = async (id) => {
  const res = await request.get(`/comment/all/${id}`);
  return res;
};
export const deleteComment = async (id) => {
  const res = await request.delete(`/comment/${id}`);
  return res;
};
