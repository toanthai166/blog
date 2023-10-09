import * as request from "../services/axios.service";

export const getFaqs = async () => {
  const res = await request.get("/faq?isActive=true");
  return res;
};
