// import * as request from "../services/axios.service";
import request from "../services/axios.service";

export const login = async ({ email, password }) => {
  const data = await request.post("/auth/login", {
    email,
    password,
  });
  return data;
};

export const register = async ({ email, name, password }) => {
  const data = await request.post("/auth/register", {
    email,
    name,
    password,
  });
  return data;
};
