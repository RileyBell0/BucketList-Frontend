import backendFetch from "./backendFetch";
import { useAuth } from "../auth/auth";
import Globals from "../Globals";
import { Outlet } from "react-router-dom";

function FetchAuthHook() {
  const { unauthenticateUser } = useAuth();

  // If a 401 error is received, unauthenticate the user
  backendFetch.interceptors.response.use(
    (res) => {
      if (
        res.response &&
        res.response.status === Globals.statusCodes.UNAUTHENTICATED
      ) {
        unauthenticateUser();
      }
      return res;
    },
    (error) => {
      if (error.status === Globals.statusCodes.UNAUTHENTICATED) {
        unauthenticateUser();
      }
      return error;
    }
  );

  return <Outlet />;
}

export default FetchAuthHook;
