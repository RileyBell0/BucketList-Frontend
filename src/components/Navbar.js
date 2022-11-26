import "../styles/Navbar.css";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MediaQuery from "react-responsive";
import { ReactComponent as Hamburger } from "../images/hamburger.svg";
import { ReactComponent as Cross } from "../images/hamburger_close.svg";
import Globals from "../Globals";
import { useAuth } from "../auth/auth";

function Navbar({ children, transparent, fixed }) {
  const { authenticated, handleLogout } = useAuth();
  const [hamburgerActive, setHamburgerActive] = useState(false);
  let navbarClass = "navbar";
  let homeLink = "/";
  if (transparent) {
    navbarClass += " navbar--transparent";
  }
  if (authenticated) {
    homeLink = "/destinations";
  }

  // Toggle the mobile dropdown on or off
  const hamburgerClick = () => {
    setHamburgerActive(!hamburgerActive);
  };

  // Function for defining navlink styling when a page is active/inactive
  const linkClass = ({ isActive }) => {
    return "navbar__link" + (isActive ? " navbar__link--active" : "");
  };

  // Links visible in the navbar when unauthenticated
  const generateUnauthenticatedLinks = (isMobile) => {
    return (
      <div
        className={
          isMobile ? "navbar__links navbar__links--mobile" : "navbar__links"
        }
      >
        <NavLink to="/signup" className={linkClass}>
          Sign Up
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <NavLink to="/login" className={linkClass}>
          Log In
        </NavLink>
      </div>
    );
  };

  // Links visible in the navbar authenticated
  const generateLinks = (isMobile) => {
    return (
      <div
        className={
          isMobile ? "navbar__links navbar__links--mobile" : "navbar__links"
        }
      >
        <NavLink to="/destinations" className={linkClass}>
          Destinations
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <NavLink to="/trips" className={linkClass}>
          Trips
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <NavLink to="/map" className={linkClass}>
          Map
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <NavLink to="/help" className={linkClass}>
          Help
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
        {isMobile && <div className="navbar__links--separator" />}
        <Link onClick={handleLogout} to="/" className="navbar__link">
          Sign out
        </Link>
      </div>
    );
  };

  // Navbar contents on desktop
  const generateDesktop = () => {
    return (
      <div className={navbarClass}>
        <Link className="navbar__title" to={homeLink}>
          Bucket List
        </Link>

        {authenticated
          ? generateLinks(false)
          : generateUnauthenticatedLinks(false)}
      </div>
    );
  };

  const dropdown = (authenticated) => {
    if (authenticated) {
      return (
        <div className="navbar-dropdown-mobile">{generateLinks(true)}</div>
      );
    }
    return (
      <div className="navbar-dropdown-mobile">
        {generateUnauthenticatedLinks(true)}
      </div>
    );
  };

  // Navbar contents on Mobile
  const generateMobile = () => {
    navbarClass += " navbar--mobile";
    return (
      <>
        <div className={navbarClass}>
          <Link className="navbar__title" to={homeLink}>
            Bucket List
          </Link>

          {/* Hamburguer menu button */}
          <button
            className="navbar__mobile-button"
            onClick={() => hamburgerClick()}
          >
            {hamburgerActive ? (
              <Cross className="navbar__cross" />
            ) : (
              <Hamburger className="navbar__hamburger" />
            )}
          </button>
        </div>

        {/* Displaying the mobile dropdown menu */}
        {hamburgerActive && dropdown(authenticated)}
      </>
    );
  };

  let overallClass = "navbar__container";
  if (fixed !== false) {
    overallClass += " navbar__container--fixed";
  }
  if (transparent) {
    overallClass += " navbar__container--transparent";
  }

  return (
    <>
      <div className={overallClass}>
        <div className="navbar__background">
          <MediaQuery minWidth={Globals.responsiveWidth + 1}>
            {generateDesktop()}
          </MediaQuery>
          <MediaQuery maxWidth={Globals.responsiveWidth}>
            {generateMobile()}
          </MediaQuery>
        </div>
      </div>

      {fixed !== false && <div className="navbar__padding" />}

      {children}
    </>
  );
}

export default Navbar;
