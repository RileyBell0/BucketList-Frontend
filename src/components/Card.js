import "../styles/card.css";
import React from "react";

function Card({ children, className, onClick }) {
  return (
    <div
      className={"card" + (className ? " " + className : "")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
