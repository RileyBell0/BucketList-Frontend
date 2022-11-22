import defaultTheme from "./default";
import defaultDark from "./default_dark";
import ocean from "./ocean";
import oceanDark from "./ocean_dark";
import purple from "./purple";
import purpleDark from "./purple_dark";
import sandyCove from "./sandyCove";
import sandyCoveDark from "./sandyCove_dark";

const themeNames = ["Default", "Ocean", "Purple", "Sandy Cove"];

const themes = {
  default: defaultTheme,
  ocean: ocean,
  purple: purple,
  "sandy cove": sandyCove,
};

const darkThemes = {
  default: defaultDark,
  ocean: oceanDark,
  purple: purpleDark,
  "sandy cove": sandyCoveDark,
};

export { themes, darkThemes, themeNames };
