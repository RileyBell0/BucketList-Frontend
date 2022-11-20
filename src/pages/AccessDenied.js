import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import React from "react";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";

function AccessDenied() {
  const [counter, setCounter] = useState(3);
  const navigate = useNavigate();

  // Go back after 2 seconds
  useEffect(() => {
    if (counter === 0) {
      navigate("/destinations");
    }
    counter > 0 &&
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  return (
    <>
      <h1>Error 403 - Access Denied</h1>
      <br />
      <h2>Redirecting in {counter} seconds...</h2>
    </>
  );
}

function AccessDeniedPage() {
  document.title = "Bucket List - Not Found";

  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <AccessDenied />
        </PageContent>
      </Footer>
    </>
  );
}

export default AccessDeniedPage;
