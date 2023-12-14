import request from "../services/axios.service";
export const createOrder = async (data) => {
  const res = await request.post("/order/create", data);
  return res;
};
export const updateOrder = async (data) => {
  const res = await request.patch(`/order/${data.id}`, data);
  return res;
};

export const getOrders = async (filter) => {
  const res = await request.get(
    `/order?page=${filter.page}&limit=${filter.limit}${
      filter.userId ? `&userId=${filter.userId}` : ""
    }${filter.status ? `&status=${filter.status}` : ""}`
  );
  return res;
};

export const getOrderById = async (id) => {
  if (!id) return null;
  const res = await request.get(`/order/${id}`);
  console.log("res :>> ", res);
  return res;
};
