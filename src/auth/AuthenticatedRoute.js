import { Navigate, Outlet } from "react-router-dom";
import Loading from "../pages/Loading";
import { useAuth } from "./auth";

const AuthenticatedRoute = () => {
  const { authenticated, loadedAuth } = useAuth();
  if (loadedAuth === false) {
    // While checking auth for the first time, display a loading page
    return <Loading />;
  } else {
    return authenticated ? <Outlet /> : <Navigate to="/login" replace={true} />;
  }
};

export default AuthenticatedRoute;
