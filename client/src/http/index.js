import axios from "axios";
import config from "../config";
import {
  addAuthTokenInterceptors,
  errorResponseInterceptors,
} from "./interceptors";

const NETWORK_TIMOUT = 60000;

const instance = axios.create({
  baseURL: `${config.API_URL}`,
  responseType: "json",
  timeout: NETWORK_TIMOUT,
  withCredentials: true,
});

instance.interceptors.request.use(addAuthTokenInterceptors);

instance.interceptors.response.use((response) => {
  return response;
}, errorResponseInterceptors(instance));

export { instance };
