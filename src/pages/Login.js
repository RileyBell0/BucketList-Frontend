import "../styles/login.css";
import React from "react";
import { Link } from "react-router-dom";
import { GenericButton, GenericInput } from "../components/GenericComponents";
import { useState } from "react";
import { Spacer } from "../components/Spacer";
import Card from "../components/Card";
import { useAuth } from "../auth/auth";
import Navbar from "../components/Navbar";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import { useForm } from "../validation/useForm";
import LoadingIcon from "../components/LoadingIcon";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";

function Login() {
  const { form, onChange, onBlur, validity, checkValidity, displayAllErrors } =
    useForm({
      email: "",
      password: "",
    });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useAuth();

  // Attempts to login to the backend using the provided credentials
  const attemptLogin = async (event) => {
    event.preventDefault();
    await setIsLoading(true);
    if (!checkValidity(validity)) {
      displayAllErrors();
      await setIsLoading(false);
      return;
    }

    const error = await handleLogin({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErrorMessage(error);
      console.log(`error: ${error}`);
    }

    await setIsLoading(false);
  };

  return (
    <>
      <form className="formContent" onSubmit={attemptLogin}>
        <Spacer>
          <h1 className="login__header">Log in</h1>
          {/* Login form */}
          <Card>
            <GenericInput
              title="Email"
              type="text"
              name="email"
              error={validity.email.errorMsg}
              value={form.email}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />
            <GenericInput
              title="Password"
              type="password"
              name="password"
              error={validity.password.errorMsg}
              value={form.password}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />

            {errorMessage !== "" && (
              <>
                <p className="login__error-message">{errorMessage}</p>
              </>
            )}
            <br />

            {isLoading && <LoadingIcon />}
            {isLoading === false && (
              <GenericButton
                type="submit"
                className={
                  !checkValidity(validity) ? "generic-button--disabled" : ""
                }
              >
                Continue
              </GenericButton>
            )}
            <br />
            <Link to="/forgot">
              <button className="login__form__text-button">
                Forgot Password?
              </button>
            </Link>
          </Card>

          {/* Redirect to signup */}
          <div>
            <h3>Don't have an account yet?</h3>
            <Link to="/signup">
              <GenericButton className="login__link-to-sign-up">
                Create Account
              </GenericButton>
            </Link>
          </div>
          <br />
        </Spacer>
      </form>
    </>
  );
}

function LoginPage() {
  document.title = "Bucket List - Log In";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <Login />
        </PageContent>
      </Footer>
    </>
  );
}

export default LoginPage;
