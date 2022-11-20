import axios from "axios";
import Globals from "../Globals";

axios.defaults.withCredentials = true;

function baseURL() {
  const lastChar = Globals.apiRootUrl.charAt(Globals.apiRootUrl.length - 1);
  if (lastChar === "/") {
    return Globals.apiRootUrl.slice(0, -1);
  } else {
    return Globals.apiRootUrl;
  }
}

const instance = axios.create({
  withCredentials: true,
  baseURL: baseURL(),
  secure: true,
});

export default instance;
