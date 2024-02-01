// import { AuthClient } from "../context/AuthContext";
import inMemoryJWT from "../service/inMemoryJWT";
// import showErrorMessage from "../utils/showErrorMessage";
import { reloadAuthToken } from "./refreshToken";

export const addAuthTokenInterceptors = async (config) => {
  const token = inMemoryJWT.getToken();

  config.headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    Accept: "application/json",
  };

  return config;
};

export const errorResponseInterceptors = (axios) => async (error) => {
  const res = error.response;

  if (res?.status === 401) {
    console.log("Here");
    const originalRequest = error.response.config;

    await reloadAuthToken();

    return axios(originalRequest);
  }

  // TODO: make norifier
  console.log(error);
  // showErrorMessage(error);

  throw error;
};
