import axios from "axios";

const request = axios.create({
  baseURL: "https://650af08bdfd73d1fab093cfb.mockapi.io",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export const sort = ["All", "Low Price", "Increase Price"];

export default request;
