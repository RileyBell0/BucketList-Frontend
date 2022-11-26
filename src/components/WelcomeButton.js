import React from "react";
import "../styles/welcomeButton.css";

function WelcomeButton({ className, children, loading, onClick }) {
  return (
    <>
      <div className="welcome-button" onClick={onClick}>
        <p
          className={
            "welcome-button__text" +
            (className ? " " + className : "") +
            (loading ? " welcome-button__loading" : "")
          }
        >
          {children}
        </p>
      </div>
    </>
  );
}

export default WelcomeButton;
