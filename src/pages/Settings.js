import "../styles/settings.css";
import "../styles/GenericComponents.css";
import React, { useEffect } from "react";
import {
  GenericInput,
  GenericDropdown,
  GenericButton,
  GenericParagraph,
  GenericToggle,
} from "../components/GenericComponents";
import { Spacer } from "../components/Spacer";
import Card from "../components/Card";
import { useForm } from "../validation/useForm";
import { useState } from "react";
import Navbar from "../components/Navbar";
import PageContent from "../components/PageContent";
import { themeNames } from "../themes/Themes";
import { ThemeLoader, refreshTheme } from "../themes/Themes";
import backendFetch from "../axios/backendFetch";
import LoadingIcon from "../components/LoadingIcon";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";

function Settings() {
  const { form, onChange, onBlur, validity, checkValidity, displayAllErrors } =
    useForm({
      password: "",
      confirmPassword: "",
    });
  const [email, setEmail] = useState("");
  const [themeIndex, setThemeIndex] = useState(undefined);
  const [changeMessage, setChangeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [useSystemTheme, setUseSystemTheme] = useState(false);

  useEffect(() => {
    backendFetch.get("/getSettings").then((response) => {
      setThemeIndex(themeNames.indexOf(response.data.theme));
      setEmail(response.data.email);
      setDarkMode(response.data.darkMode);
      setUseSystemTheme(response.data.useSystemTheme);
      setLoadingSettings(false);
    });
  }, []);

  const setThemeBackend = async (e) => {
    // Set the theme locally and in the backend
    let themeName = e.target.value;

    // reload theme to match
    localStorage.setItem("theme", themeName);
    refreshTheme();

    // Update new theme choice in the database
    await backendFetch.post("/updateTheme", { theme: themeName });
  };

  const changePassword = async (event) => {
    event.preventDefault();
    await setIsLoading(true);
    if (!checkValidity(validity)) {
      displayAllErrors();
      await setIsLoading(false);
      return;
    }

    const body = {
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      const res = await backendFetch.post("/changePassword", body, {
        withCredentials: true,
        headers: { crossDomain: true, "Content-Type": "application/json" },
      });

      if (res.error) {
        setChangeMessage("ERROR: " + res.error);
      } else {
        setChangeMessage("Password changed sucessfully");
      }
    } catch (error) {
      setChangeMessage("Something went wrong, Please try again");
    }
    await setIsLoading(false);
  };

  const toggleDarkMode = async () => {
    // Update vars and reload theme
    localStorage.setItem("darkMode", !darkMode);
    setDarkMode(!darkMode);
    refreshTheme();

    // Update new theme choice in the database
    await backendFetch.post("/updateTheme", {
      darkMode: !darkMode,
    });
  };

  const toggleUseSystemTheme = async () => {
    // Update vars and reload theme
    localStorage.setItem("useSystemTheme", !useSystemTheme);
    setUseSystemTheme(!useSystemTheme);
    refreshTheme();

    // Update new theme choice in the database
    await backendFetch.post("/updateTheme", {
      useSystemTheme: !useSystemTheme,
    });
  };

  return (
    <div className="formContent">
      <h1>Settings</h1>
      <Spacer>
        {/* Personal Information Card */}
        <h3 className="settings__section-header">Personal information</h3>
        <Card>
          <GenericParagraph title="Email" defaultValue={"Loading..."}>
            {email}
          </GenericParagraph>
        </Card>

        {/* Preferences Card */}
        <h3 className="settings__section-header">Preferences</h3>
        <Card>
          {loadingSettings ? (
            <GenericParagraph title="Theme">
              Loading theme info...
            </GenericParagraph>
          ) : (
            <GenericDropdown
              title="Theme"
              options={themeNames}
              defaultOption={themeIndex}
              onChange={setThemeBackend}
            />
          )}
          {loadingSettings ? (
            <>
              <GenericToggle
                title="Use System Theme"
                state={false}
                disabled={true}
              />
              <GenericToggle title="Dark Mode" state={false} disabled={true} />
            </>
          ) : (
            <>
              <GenericToggle
                title="Use System Theme"
                state={useSystemTheme}
                onClick={toggleUseSystemTheme}
              />
              <GenericToggle
                title="Dark Mode"
                state={darkMode}
                onClick={toggleDarkMode}
                disabled={useSystemTheme}
              />
            </>
          )}
        </Card>

        {/* Security Card */}
        <h3 className="settings__section-header">Security</h3>
        <form onSubmit={changePassword}>
          <Card>
            <Spacer>
              <div>
                <GenericInput
                  title="New password"
                  type="password"
                  name="password"
                  error={validity.password.errorMsg}
                  value={form.password}
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onBlur(e)}
                />
                <GenericInput
                  title="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  error={validity.confirmPassword.errorMsg}
                  value={form.confirmPassword}
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onBlur(e)}
                />
              </div>
              {isLoading && <LoadingIcon />}
              {isLoading === false && (
                <GenericButton
                  type="submit"
                  className={
                    !checkValidity(validity) ? "generic-button--disabled" : ""
                  }
                >
                  Change Password
                </GenericButton>
              )}
            </Spacer>
          </Card>
          <br />

          {changeMessage !== "" && (
            <>
              <p>{changeMessage}</p>
              <br />
            </>
          )}
        </form>
      </Spacer>
    </div>
  );
}

function SettingsPage() {
  document.title = "Bucket List - Settings";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <Settings />
        </PageContent>
      </Footer>
    </>
  );
}

export default SettingsPage;
