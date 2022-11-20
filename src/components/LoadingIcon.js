import "../styles/loadingIcon.css";
import { ReactComponent as Loading } from "../images/loading.svg";

function LoadingIcon({ className }) {
  return (
    <>
      <Loading className={"loading-icon " + className} />
    </>
  );
}

export default LoadingIcon;
