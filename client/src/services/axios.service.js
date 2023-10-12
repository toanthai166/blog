import axios from "axios";
// import { errorToast } from "../utils/toast";
const apiUrl = "http://localhost:3000/v1/";
const request = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    // "Content-Type": "text/html",
  },
});

async function getNewToken() {
  const auth = localStorage.getItem("auth");
  const refreshToken = JSON.parse(auth)?.tokens?.refresh?.token;
  const response = await axios.post(
    "http://localhost:3000/v1/auth/refresh-tokens",
    {
      refreshToken: refreshToken,
    }
  );

  return response.data.accessToken;
}
function isTokenExpired(token) {
  return false;
}

request.interceptors.request.use(
  async (config) => {
    const auth = localStorage.getItem("auth");
    const accessToken = JSON.parse(auth)?.tokens?.access?.token;

    if (isTokenExpired(accessToken)) {
      // Lấy token mới
      const newToken = await getNewToken();

      // Cập nhật header của yêu cầu mới với token mới
      config.headers.Authorization = `Bearer ${newToken}`;
    } else {
      // Sử dụng token hiện tại
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// request.interceptors.request.use(async (config) => {
//   const customHeaders = {};
//   const auth = localStorage.getItem("auth");
//   const accessToken = JSON.parse(auth)?.tokens?.access?.token;
//   if (accessToken) {
//     customHeaders.authorization = `Bearer ${accessToken}`;
//   }
//   return {
//     ...config,
//     headers: {
//       ...customHeaders, // auto attach token
//       ...config.headers, // but you can override for some requests
//     },
//   };
// });

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
