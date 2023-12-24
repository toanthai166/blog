import request from "../services/axios.service";

export const getReports = async (filter) => {
  const res = await request.get(
    `/revenue?${filter.time != null ? `time=${filter.time}` : ""}${
      filter.startDate ? `&startDate=${filter.startDate}` : ""
    }${filter.endDate ? `&endDate=${filter.endDate}` : ""}`
  );
  return res;
};
