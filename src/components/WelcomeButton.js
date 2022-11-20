import React from "react";
import "../styles/welcomeButton.css";

function Welcome_Button({ className, children }) {
  return (
    <>
      <p className={"welcome-button " + className}>{children}</p>
    </>
  );
}

export default Welcome_Button;
