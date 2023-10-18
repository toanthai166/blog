import * as request from "../services/axios.service";

export const getFaqIsActive = async () => {
  const res = await request.get("/faq?isActive=true");
  return res;
};
export const getFaqs = async () => {
  const res = await request.get("/faq");
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
  const res = await request.get(`/faq/${id}`);
  return res;
};
