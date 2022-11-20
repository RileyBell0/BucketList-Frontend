// based off code from https://www.robinwieruch.de/react-router-authentication/
import backendFetch from "../axios/backendFetch";
import Globals from "../Globals";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { refreshTheme } from "../themes/Themes";

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  // Do not use this setting function, use "setAuthenticated" instead
  const [authenticated, _setAuthenticated] = React.useState(false);
  const [loadedAuth, setLoadedAuth] = React.useState(false);

  useEffect(() => {
    backendFetch
      .post("/checkAuth")
      .then((res) => {
        setAuthenticated(res.data.isAuthenticated);
      })
      .catch((e) => {
        if (
          e &&
          e.response &&
          e.response.status === Globals.statusCodes.UNAUTHORISED
        ) {
          setAuthenticated(false);
        }
      });
  }, []);

  const navigate = useNavigate();

  // Authentication middleware
  const setAuthenticated = (isAuthenticated) => {
    // Set the authentication variable
    _setAuthenticated(isAuthenticated);
    setLoadedAuth(true);

    // Run any related effects
    if (isAuthenticated === false) {
      localStorage.setItem("theme", "Default");
      localStorage.setItem("darkMode", "false");
      localStorage.setItem("useSystemTheme", "true");
      refreshTheme();
    }
  };
  const unauthenticateUser = () => {
    setAuthenticated(false);
  };

  const handleLogin = async (body) => {
    try {
      const res = await backendFetch.post("/login", body, {
        withCredentials: true,
        headers: { crossDomain: true, "Content-Type": "application/json" },
      });

      if (res.status === Globals.statusCodes.OK) {
        setAuthenticated(true);
        console.log("successfully logged in.");

        navigate("/destinations", { replace: true });
      } else {
        return res.response.data.message;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /*
   * Reset the pre-emptive authentication check, end the session,
   * and reset the theme
   */
  const handleLogout = () => {
    try {
      const res = backendFetch.post("/signOut");
      if (res.status === Globals.statusCodes.OK) {
        navigate("/");
      }
    } catch (err) {
      return err.response.data.message;
    }
    setAuthenticated(false);
  };

  const register = async (body) => {
    try {
      const res = await backendFetch.post("/register", body);

      if (res.status === Globals.statusCodes.CREATED) {
        navigate("/login", { replace: true });
      } else {
        return res.response.data.error;
      }
    } catch (err) {
      return err.response.data.message;
    }
  };

  const forgot = async (body) => {
    try {
      await backendFetch.post("/resetPassword", body);
    } catch (err) {
      return err.response.data.message;
    }
  };

  const value = {
    authenticated,
    loadedAuth,
    handleLogin: handleLogin,
    handleLogout: handleLogout,
    register: register,
    forgot: forgot,
    unauthenticateUser: unauthenticateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { useAuth, AuthProvider, AuthContext };
