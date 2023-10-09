import axios from "axios";
// import { errorToast } from "../utils/toast";
const apiUrl = "http://localhost:3000/v1/";
const request = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: {
    Accept: "application/json",
  },
});

request.interceptors.request.use(async (config) => {
  const customHeaders = {};
  const auth = localStorage.getItem("auth");
  const accessToken = JSON.parse(auth)?.token;
  console.log({ accessToken: accessToken });
  if (accessToken) {
    customHeaders.authorization = `Bearer ${accessToken}`;
  }
  console.log("run interceptor");

  return {
    ...config,
    headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
});

request.interceptors.response.use(
  (response) => {
    // Handle response data here
    return response;
  },
  (error) => {
    // Handle response error here
    console.log(error);
    // errorToast(
    //   error?.response?.data?.message || "Có lỗi xảy ra vui lòng thử lại"
    // );
    return Promise.reject(error);
  }
);
async function get(url, params) {
  try {
    const { data, status } = await request.get(url, params);

    // console.log(JSON.stringify(data, null, 4));

    // 👇️ "response status is: 200"
    // console.log("response status is: ", status);

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function post(url, params) {
  try {
    const { data, status } = await request.post(url, params);

    // 👇️ "response status is: 200"
    // console.log("response status is: ", status);
    // 👇️ "data response"

    // console.log(JSON.stringify(data, null, 4));

    return data;
  } catch (error) {
    console.log(error.message);
    // TODO: cần kiểm tra lại
    // throw new Error(error);
  }
}
export { get, post };
export default request;
