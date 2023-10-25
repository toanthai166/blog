import request from "../services/axios.service";
export const createContact = async (data) => {
  const res = await request.post("/feedback/create", data);
  return res;
};
export const updateContact = async (data) => {
  const res = await request.patch(`/feedback/${data.id}`, data);
  return res;
};

export const getContacts = async (filter) => {
  const res = await request.get(
    `/feedback?page=${filter.page}&limit=${filter.limit}`
  );
  return res;
};

export const getContactById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/feedback/${id}`);
  return res;
};
