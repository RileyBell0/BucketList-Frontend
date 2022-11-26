import defaultTheme from "./default";
import defaultDark from "./default_dark";
import eucalyptus from "./eucalyptus";
import eucalyptusDark from "./eucalyptus_dark";
import sandy from "./sandy";
import sandyDark from "./sandy_dark";

const themeNames = ["Default", "Eucalyptus", "Sandy"];

const themes = {
  default: defaultTheme,
  eucalyptus: eucalyptus,
  sandy: sandy,
};

const darkThemes = {
  default: defaultDark,
  eucalyptus: eucalyptusDark,
  sandy: sandyDark,
};

export { themes, darkThemes, themeNames };
