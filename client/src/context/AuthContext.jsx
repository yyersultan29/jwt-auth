import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders";
import inMemoryJWT from "../service/inMemoryJWT";
import config from "../config";
import style from "../app.module.scss";
import showErrorMessage from "../utils/showErrorMessage";
import { instance } from "../http";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [data, setData] = useState();

  const handleFetchProtected = () => {
    instance
      .get("/resource/protected")
      .then((res) => {
        setData(res.data);
      })
      .catch(showErrorMessage);
  };

  const handleLogOut = () => {
    instance
      .post("/auth/logout")
      .then(() => {
        setIsUserLogged(false);
        inMemoryJWT.deleteToken();

        setData();
      })
      .catch(showErrorMessage);
  };

  const handleSignUp = (data) => {
    instance
      .post("/auth/sign-up", data)
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;

        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        setIsUserLogged(true);
      })
      .catch(showErrorMessage);
  };

  const handleSignIn = (data) => {
    instance
      .post("/auth/sign-in", data)
      .then((res) => {
        console.log(res.data);
        const { accessToken, accessTokenExpiration } = res.data;

        inMemoryJWT.setToken(accessToken, accessTokenExpiration);
        setIsUserLogged(true);
      })
      .catch(showErrorMessage);
  };

  useEffect(() => {
    instance
      .post("/auth/refresh")
      .then((res) => {
        const { accessToken, accessTokenExpiration } = res.data;
        inMemoryJWT.setToken(accessToken, accessTokenExpiration);

        setIsAppReady(true);
        setIsUserLogged(true);
      })
      .catch(() => {
        setIsAppReady(true);
        setIsUserLogged(false);
      });
  }, []);

  useEffect(() => {
    const handlePersistedLogOut = (event) => {
      if (event.key === config.LOGOUT_STORAGE_KEY) {
        inMemoryJWT.deleteToken();
        setIsUserLogged(false);
      }
    };

    window.addEventListener("storage", handlePersistedLogOut);

    return () => {
      window.removeEventListener("storage", handlePersistedLogOut);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        data,
        handleFetchProtected,
        handleSignUp,
        handleSignIn,
        handleLogOut,
        isAppReady,
        isUserLogged,
      }}
    >
      {isAppReady ? (
        children
      ) : (
        <div className={style.centered}>
          <Circle />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
