import "../styles/signUp.css";
import React from "react";
import { GenericButton, GenericInput } from "../components/GenericComponents";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Spacer } from "../components/Spacer";
import Card from "../components/Card";
import { useAuth } from "../auth/auth";
import Navbar from "../components/Navbar";
import { useForm } from "../validation/useForm";
import PageContent from "../components/PageContent";
import LoadingIcon from "../components/LoadingIcon";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";

function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const { form, onChange, onBlur, validity, checkValidity, displayAllErrors } =
    useForm({
      email: "",
      password: "",
      confirmPassword: "",
    });
  const { register, handleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Register the user based on field values
  const sendRegisterRequest = async (event) => {
    event.preventDefault();
    await setIsLoading(true);
    if (!checkValidity(validity)) {
      displayAllErrors();
      await setIsLoading(false);
      return;
    }

    try {
      const error = await register({
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      if (!error) {
        await handleLogin({
          email: form.email,
          password: form.password,
        });
      }

      setErrorMessage(error);
      console.log(`error: ${error}`);
    } catch (e) {
      setErrorMessage("Internal Server Error");
      console.log(`error: internal server error`);
    }
    await setIsLoading(false);
  };

  return (
    <>
      <form className="formContent" onSubmit={sendRegisterRequest}>
        <Spacer>
          <h1 className="sign-up__header">Sign up</h1>
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
            <GenericInput
              title="Confirm Password"
              type="password"
              name="confirmPassword"
              error={validity.confirmPassword.errorMsg}
              value={form.confirmPassword}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />
            <br />

            {errorMessage !== "" && (
              <div>
                <p>{errorMessage}</p>
                <br />
              </div>
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
                Sign up
              </GenericButton>
            )}
          </Card>

          {/* Redirect to login */}
          <div>
            <h3>Have an account?</h3>
            <Link to="/login">
              <GenericButton className="sign-up__link-to-log-in">
                Log in
              </GenericButton>
            </Link>
          </div>
        </Spacer>
      </form>
    </>
  );
}

function SignUpPage() {
  document.title = "Bucket List - Sign Up";
  return (
    <>
      <Footer>
        <Navbar />
        <PageBackground />
        <PageContent>
          <SignUp />
        </PageContent>
      </Footer>
    </>
  );
}

export default SignUpPage;
