import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const userTransactionApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setToken = (token) => {
  userTransactionApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeToken = () => {
  userTransactionApi.defaults.headers.common.Authorization = "";
};
const savedToken = localStorage.getItem("token");
if (savedToken) {
  setToken(savedToken);
}
