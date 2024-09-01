import { axiosInstance } from "./axios";

export const getMe = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};
