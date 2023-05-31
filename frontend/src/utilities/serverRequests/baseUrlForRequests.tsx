import axios from "axios";
const PORT = process.env.PORT || 8080;

export let url = `http://localhost:${PORT}/api/v1`;

if(process.env.NODE_ENV === "production") {
  url = "/api/v1";
}

export const API = axios.create({
  baseURL: url,
});

export default API;