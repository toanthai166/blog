import request from "../services/axios.service";

export const getFaqs = async (filter) => {
  const res = await request.get(
    `/faq?page=${filter.page}&limit=${filter.limit}${
      filter.isActive ? `&isActive=true` : ""
    }`
  );
  return res;
};
export const changeIsActiveFaq = async (data) => {
  const res = await request.patch(`/faq/${data.id}/active`, data);
  return res;
};
export const createFaq = async (data) => {
  const res = await request.post("/faq/create", data);
  return res;
};
export const updateFaq = async (data) => {
  const res = await request.patch(`/faq/${data.id}`, data);
  return res;
};
export const getFaqById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/faq/${id}`);
  return res;
};
export const deleteFaq = async (id) => {
  const res = await request.delete(`/faq/${id}`);
  return res;
};
