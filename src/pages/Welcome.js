import "../styles/welcome.css";
import React from "react";
import WelcomeButton from "../components/WelcomeButton.js";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth";

function WelcomeImageText() {
  return (
    <>
      <div id="welcome__content__text-container">
        <Link to="/about" className="welcome__content__about-link">
          About
        </Link>
        <p id="welcome__content__image-attribution">
          {" • "}
          <a
            className="welcome__content__image-attribution-link"
            href="https://www.flickr.com/photos/gomera/32486971398/in/photostream/"
          >
            Sunrise @ Playa de Caleta
          </a>{" "}
          by{" "}
          <a
            className="welcome__content__image-attribution-link"
            href="https://www.flickr.com/photos/gomera/"
          >
            Jörg Bergmann
          </a>
          {" - "}
          <a
            className="welcome__content__image-attribution-link"
            href="https://creativecommons.org/licenses/by-nc-nd/2.0/"
          >
            (CC BY-NC-ND 2.0)
          </a>
        </p>
      </div>
    </>
  );
}

function Welcome() {
  const { authenticated, loadedAuth } = useAuth();

  return (
    <>
      <div className="welcome__bg" />
      <div className="welcome__content">
        <div>
          <h1 className="welcome__content__header">Bucket List</h1>
          <h1 className="welcome__content__subheader">Destination Tracker</h1>
        </div>
        {loadedAuth && (
          <>
            {authenticated === false && (
              <>
                <div className="welcome__content__buttons">
                  <Link to="/login">
                    <WelcomeButton>Log In</WelcomeButton>
                  </Link>
                  <Link to="/signup">
                    <WelcomeButton>Sign Up</WelcomeButton>
                  </Link>
                </div>
              </>
            )}
            {authenticated && (
              <div className="welcome__content__buttons">
                <Link to="/destinations">
                  <WelcomeButton className="welcome-button__home">
                    My Destinations
                  </WelcomeButton>
                </Link>
              </div>
            )}
          </>
        )}
        {loadedAuth === false && (
          <>
            <div className="welcome__content__buttons">
              <WelcomeButton className="welcome-button__loading">
                Loading...
              </WelcomeButton>
            </div>
          </>
        )}
        <WelcomeImageText />
      </div>
    </>
  );
}

function WelcomePage() {
  document.title = "Bucket List";
  return (
    <>
      <Welcome />
    </>
  );
}

export default WelcomePage;
