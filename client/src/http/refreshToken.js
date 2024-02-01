import { instance } from ".";

export async function reloadAuthToken() {
  const res = await instance.post("/auth/refresh");
  const { accessToken, accessTokenExpiration } = res.data;

  inMemoryJWT.setToken(accessToken, accessTokenExpiration);
}
