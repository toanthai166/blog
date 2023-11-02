import axios from "axios";
const apiUrl = "https://vn-public-apis.fpo.vn/";
const request = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    // "Content-Type": "text/html",
  },
});

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

export { get };
export default request;
