import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import Loading from "../pages/Loading";

const UnauthenticatedRoute = () => {
  const { authenticated, loadedAuth } = useAuth();

  if (loadedAuth === false) {
    // While checking auth for the first time, display a loading page
    return <Loading />;
  } else {
    return authenticated ? (
      <Navigate to="/destinations" replace={true} />
    ) : (
      <Outlet />
    );
  }
};

export default UnauthenticatedRoute;
