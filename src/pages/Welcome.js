import "../styles/welcome.css";
import React from "react";
import WelcomeButton from "../components/WelcomeButton.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

function Welcome() {
  const { authenticated, loadedAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="welcome__bg">
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
                    <WelcomeButton onClick={() => navigate("/login")}>
                      Log In
                    </WelcomeButton>
                    <WelcomeButton onClick={() => navigate("/signup")}>
                      Sign Up
                    </WelcomeButton>
                  </div>
                </>
              )}
              {authenticated && (
                <div className="welcome__content__buttons">
                  <WelcomeButton onClick={() => navigate("/destinations")}>
                    My Destinations
                  </WelcomeButton>
                </div>
              )}
            </>
          )}
          {loadedAuth === false && (
            <>
              <div className="welcome__content__buttons">
                <WelcomeButton className="welcome-button welcome-button__loading">
                  Loading...
                </WelcomeButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function WelcomePage() {
  document.title = "Bucket List";
  return (
    <>
      <Footer>
        <Navbar />
        <Welcome />
      </Footer>
    </>
  );
}

export default WelcomePage;
