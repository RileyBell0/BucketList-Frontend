import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import React from "react";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import { useAuth } from "../auth/auth";

function NotFound() {
  const [counter, setCounter] = useState(2);
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  // Return to the home page after 5 seconds
  useEffect(() => {
    if (counter === 0) {
      if (authenticated) {
        navigate("/destinations");
      } else {
        navigate("/");
      }
    }
    counter > 0 &&
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  return (
    <>
      <h1>Error 404 - Page not found</h1>
      <br />
      <h2>Redirecting in {counter} seconds...</h2>
    </>
  );
}

function NotFoundPage() {
  document.title = "Bucket List - Not Found";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <NotFound />
        </PageContent>
      </Footer>
    </>
  );
}

export default NotFoundPage;
