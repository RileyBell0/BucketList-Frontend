import "../styles/welcome.css";
import React from "react";
import WelcomeButton from "../components/WelcomeButton.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { isDarkTheme, ThemeLoader } from "../themes/Themes";
import PageContent from "../components/PageContent";

// Return a div containing relevant redirect buttons
function WelcomeButtons() {
  const { authenticated, loadedAuth } = useAuth();
  const navigate = useNavigate();

  // Determine which buttons are needed on the page
  let buttons = <></>;
  if (!loadedAuth) {
    buttons = (
      <WelcomeButton className="welcome-button welcome-button__loading">
        Loading...
      </WelcomeButton>
    );
  } else if (authenticated) {
    buttons = (
      <WelcomeButton onClick={() => navigate("/destinations")}>
        My Destinations
      </WelcomeButton>
    );
  } else {
    buttons = (
      <>
        <WelcomeButton onClick={() => navigate("/login")}>Log In</WelcomeButton>
        <WelcomeButton onClick={() => navigate("/signup")}>
          Sign Up
        </WelcomeButton>
      </>
    );
  }

  // Return page buttons
  return <div className="welcome__content__buttons">{buttons}</div>;
}

function AboutSection() {
  return (
    <>
      <PageContent>
        <h1>About Placeholder</h1>
        <br />
        <p className="welcome__about__text--highlighted">Bucket List </p>
        <p className="welcome__about__text">
          was founded in 1202 by a small group of travel enthusiasts who
          discovered javascript engraved on a stone in their village.
          <br />
          <br />
          They wanted to make an easy way to plan what they wanted to do in
          their life and the destinations they wanted to visit.
        </p>
        <p className="welcome__about__text">A </p>
        <p className="welcome__about__text--highlighted">Bucket List </p>
        <p className="welcome__about__text">
          is a list of experiences or achievements that you might want to
          accomplish during your lifetime.
          <br />
          <br />
        </p>
        <p className="welcome__about__text--highlighted">BucketListApp.org </p>
        <p className="welcome__about__text">
          will help you get done what you want most, by keeping track of all the
          things you've
        </p>
        <p className="welcome__about__text--highlighted">
          {" "}
          always wanted to do.
        </p>
      </PageContent>
    </>
  );
}

// Welcome page content
function Welcome() {
  return (
    <div className="welcome__globals">
      <div className="welcome__bg" />
      <div
        className={
          "welcome__header-bg" +
          (isDarkTheme() ? " welcome__header-bg--dark" : "")
        }
      />
      <div className="welcome__content">
        <div>
          <h1 className="welcome__content__header">Bucket List</h1>
          <h1 className="welcome__content__subheader">Destination Tracker</h1>
        </div>
        <WelcomeButtons />
      </div>
      <AboutSection />
    </div>
  );
}

// Overall Page Attributes
function WelcomePage() {
  document.title = "Bucket List";
  return (
    <>
      <Footer className="welcome__footer">
        <ThemeLoader />
        <Navbar transparent={true} fixed={false}>
          <Welcome />
        </Navbar>
      </Footer>
    </>
  );
}

export default WelcomePage;
