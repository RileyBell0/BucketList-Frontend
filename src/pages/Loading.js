import "../styles/loading.css";
import { loadUserTheme } from "../themes/Themes";
import LoadingIcon from "../components/LoadingIcon";

function Loading() {
  loadUserTheme(localStorage.getItem("theme"));

  return (
    <>
      <div className="loading">
        <h1 className="loading__text">Loading</h1>
        <LoadingIcon className="loading__loading-icon" />
      </div>
    </>
  );
}

export default Loading;
