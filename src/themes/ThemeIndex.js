import defaultTheme from "./default";
import defaultDark from "./default_dark";
import ocean from "./ocean";
import oceanDark from "./ocean_dark";
import eucalyptus from "./eucalyptus";
import eucalyptusDark from "./eucalyptus_dark";
import sandyCove from "./sandyCove";
import sandyCoveDark from "./sandyCove_dark";

const themeNames = ["Default", "Ocean", "Eucalyptus", "Sandy Cove"];

const themeIcon = {
  default: { small: "default32.ico", large: "default192.png" },
  ocean: { small: "ocean32.ico", large: "ocean192.png" },
  eucalyptus: { small: "eucalyptus32.ico", large: "eucalyptus192.png" },
  "sandy cove": { small: "sandyCove32.ico", large: "sandyCove192.png" },
};

const themes = {
  default: defaultTheme,
  ocean: ocean,
  eucalyptus: eucalyptus,
  "sandy cove": sandyCove,
};

const darkThemes = {
  default: defaultDark,
  ocean: oceanDark,
  eucalyptus: eucalyptusDark,
  "sandy cove": sandyCoveDark,
};

export { themes, darkThemes, themeIcon, themeNames };
