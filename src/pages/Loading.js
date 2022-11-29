import "../styles/loading.css";
import { loadUserTheme } from "../themes/Themes";
import logo from "../images/logo.png";

function Loading() {
  loadUserTheme(localStorage.getItem("theme"));

  return (
    <>
      <div className="loading">
        <img src={logo} className="loading__image" alt="Bucket List Logo" />
      </div>
    </>
  );
}

export default Loading;
