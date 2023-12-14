import request from "../services/axios.service";
export const createReview = async (data) => {
  const res = await request.post("/reviews/create", data);
  return res;
};

export const getReviews = async (filter) => {
  const res = await request.get(
    `/reviews?page=${filter.page}&limit=${filter.limit}${
      filter.productId ? `&productId=${filter.productId}` : ""
    }${
      filter.rating != undefined && filter.rating != 0
        ? `&rating=${filter.rating}`
        : ""
    }`
  );
  return res;
};
