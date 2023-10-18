import request from "../services/axios.service";
export const uploadImage = async () => {
  const res = await request.post("/upload-image");
  return res;
};
