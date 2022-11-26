import { Outlet } from "react-router-dom";
import backendFetch from "../axios/backendFetch";
import { themes, darkThemes, themeNames } from "./ThemeIndex";
import defaultTheme from "./default";
import Globals from "../Globals";
import { useEffect } from "react";
import { useAuth } from "../auth/auth";

// Load the provided theme
function loadUserTheme(themeName) {
  let themeDict = defaultTheme;
  let useSystemTheme = localStorage.getItem("useSystemTheme");
  let darkMode = localStorage.getItem("darkMode");

  // Convert local storage from strings into booleans
  if (darkMode !== "true") {
    darkMode = false;
  } else {
    darkMode = true;
  }
  if (useSystemTheme !== "true") {
    useSystemTheme = false;
  } else {
    useSystemTheme = true;
  }

  // Ensure the theme name exists
  themeName = String(themeName).toLowerCase();
  if (!(themeName in themes)) {
    themeName = "default";
  }

  // Determine if the system prefers dark mode
  let prefersDarkMode = false;
  if (window.matchMedia) {
    const result = window.matchMedia("(prefers-color-scheme: dark)");
    if (result.matches) {
      prefersDarkMode = true;
    }
  }

  // Determine whether to use dark or light mode
  if (useSystemTheme) {
    if (prefersDarkMode) {
      darkMode = true;
    } else {
      darkMode = false;
    }
  }

  // Get the matching theme style
  if (darkMode) {
    themeDict = darkThemes[themeName];
  } else {
    themeDict = themes[themeName];
  }

  // Set all theme variables
  for (let key in themeDict) {
    document.documentElement.style.setProperty(key, themeDict[key]);
  }
}

// Return the theme of the logged in user, or "Default" on fail
async function getCurrentTheme() {
  try {
    const res = await backendFetch.get("/getTheme");
    if (res.response && res.response.status !== Globals.statusCodes.OK) {
      return { theme: "Default", darkMode: false, useSystemTheme: false };
    }
    return res.data;
  } catch (e) {
    return { theme: "Default", darkMode: false, useSystemTheme: false };
  }
}

function isDarkTheme() {
  let useSystemTheme = localStorage.getItem("useSystemTheme");
  let darkMode = localStorage.getItem("darkMode");

  // Convert local storage from strings into booleans
  if (darkMode !== "true") {
    darkMode = false;
  } else {
    darkMode = true;
  }
  if (useSystemTheme !== "true") {
    useSystemTheme = false;
  } else {
    useSystemTheme = true;
  }

  // Determine if the system prefers dark mode
  let prefersDarkMode = false;
  if (window.matchMedia) {
    const result = window.matchMedia("(prefers-color-scheme: dark)");
    if (result.matches) {
      prefersDarkMode = true;
    }
  }

  if (useSystemTheme) {
    return prefersDarkMode;
  } else {
    return darkMode;
  }
}

function refreshTheme() {
  loadUserTheme(localStorage.getItem("theme"));
}

// Get the user's theme, and load it
function ThemeLoader() {
  const { authenticated } = useAuth();

  // Pre-emptively load the stored theme
  loadUserTheme(localStorage.getItem("theme"));

  // Only try and load the theme if we're authenticated
  if (authenticated) {
    // If the user's theme is different than expected, update the locally
    // stored theme and update the displayed theme
    getCurrentTheme().then((res) => {
      localStorage.setItem("darkMode", res.darkMode);
      localStorage.setItem("useSystemTheme", res.useSystemTheme);
      localStorage.setItem("theme", res.theme);
      loadUserTheme(res.theme);
    });
  }

  useEffect(() => {
    const result = window.matchMedia("(prefers-color-scheme: dark)");
    result.addEventListener("change", () => {
      refreshTheme();
    });
  });

  return <Outlet />;
}

export { ThemeLoader, refreshTheme, themeNames, loadUserTheme, isDarkTheme };
