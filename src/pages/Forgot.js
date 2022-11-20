import "../styles/login.css";
import React from "react";
import { GenericButton, GenericInput } from "../components/GenericComponents";
import Card from "../components/Card";
import { Spacer } from "../components/Spacer";
import Navbar from "../components/Navbar";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import { useForm } from "../validation/useForm";
import { useAuth } from "../auth/auth";
import { useState } from "react";
import LoadingIcon from "../components/LoadingIcon";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";

function Forgot() {
  const { form, onChange, onBlur } = useForm({
    email: "",
  });

  const [message, setMessage] = useState("");
  const { forgot } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (event) => {
    event.preventDefault();
    await setIsLoading(true);

    const error = await forgot({
      email: form.email,
    });

    if (error) {
      console.log(`error: ${error}`);
      setMessage(error);
    } else {
      setMessage(
        "We have sent an email with a new password to that email. Please ensure to change your password in the settings page once you log in again."
      );
      await setIsLoading(false);
    }
  };

  return (
    <>
      <form className="formContent" onSubmit={resetPassword}>
        <Spacer>
          <h1>Reset password</h1>
          <Card>
            <GenericInput
              title="Email"
              type="text"
              name="email"
              value={form.email}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />
            <br />
            {message !== "" && (
              <>
                <p>{message}</p>
              </>
            )}
          </Card>
          {isLoading && <LoadingIcon />}
          {isLoading === false && <GenericButton>Submit</GenericButton>}
        </Spacer>
      </form>
    </>
  );
}

function ForgotPage() {
  document.title = "Bucket List - Forgot Password";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <Forgot />
        </PageContent>
      </Footer>
    </>
  );
}

export default ForgotPage;
