import "../styles/popup.css";
import { useState } from "react";

function Popup({ children, disablePopup, z_index }) {
  const [scrollY] = useState(window.scrollY);

  return (
    <>
      {/* Darken the background behind the popup */}
      <div
        className="popup__background"
        style={{ zIndex: z_index ? z_index : 800 }}
        onClick={disablePopup}
      />

      {/* Draw the popup */}
      <div
        className={"popup__container "}
        style={{ zIndex: z_index ? z_index + 1 : 801, top: scrollY }}
      >
        {children}
      </div>
    </>
  );
}

export default Popup;
