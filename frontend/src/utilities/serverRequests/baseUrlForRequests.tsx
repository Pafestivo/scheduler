import axios from "axios";
const PORT = process.env.NEXT_PUBLIC_PORT || 8080;

export const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

export const API = axios.create({
  baseURL: url,
});

export default API;