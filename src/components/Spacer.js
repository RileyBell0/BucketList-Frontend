import "../styles/spacer.css";
import React from "react";

function Spacer({ children, className }) {
  return (
    <div className={"spacer " + (className ? className : "")}>{children}</div>
  );
}

export { Spacer };
