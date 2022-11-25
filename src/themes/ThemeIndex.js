import defaultTheme from "./default";
import defaultDark from "./default_dark";
import eucalyptus from "./eucalyptus";
import eucalyptusDark from "./eucalyptus_dark";
import sandyCove from "./sandyCove";
import sandyCoveDark from "./sandyCove_dark";

const themeNames = ["Default", "Eucalyptus", "Sandy Cove"];

const themes = {
  default: defaultTheme,
  eucalyptus: eucalyptus,
  "sandy cove": sandyCove,
};

const darkThemes = {
  default: defaultDark,
  eucalyptus: eucalyptusDark,
  "sandy cove": sandyCoveDark,
};

export { themes, darkThemes, themeNames };
