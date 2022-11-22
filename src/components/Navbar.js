import "../styles/Navbar.css";
import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import MediaQuery from "react-responsive";
import { ReactComponent as Hamburger } from "../images/hamburger.svg";
import { ReactComponent as Cross } from "../images/hamburger_close.svg";
import Globals from "../Globals";
import { useAuth } from "../auth/auth";

function Navbar() {
  const [hamburgerActive, setHamburgerActive] = useState(false);
  const { authenticated, handleLogout } = useAuth();

  const hamburgerClick = () => {
    setHamburgerActive(!hamburgerActive);
  };

  const generateUnauthenticatedLinks = (isMobile) => {
    return (
      <div
        className={
          isMobile ? "navbar__links navbar__links--mobile" : "navbar__links"
        }
      >
        <NavLink
          to="/about"
          className={(isActive) =>
            isActive ? "navbar__link" : "navbar__link navbar__link--active"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/signup"
          className={(isActive) =>
            isActive ? "navbar__link" : "navbar__link navbar__link--active"
          }
        >
          Sign Up
        </NavLink>
        <NavLink
          to="/login"
          className={(isActive) =>
            isActive ? "navbar__link" : "navbar__link navbar__link--active"
          }
        >
          Log In
        </NavLink>
      </div>
    );
  };

  const generateLinks = (isMobile) => {
    return (
      <div
        className={
          isMobile ? "navbar__links navbar__links--mobile" : "navbar__links"
        }
      >
        <NavLink
          to="/destinations"
          className={({ isActive }) =>
            "navbar__link" + (isActive ? " navbar__link--active" : "")
          }
        >
          Destinations
        </NavLink>
        <NavLink
          to="/trips"
          className={({ isActive }) =>
            "navbar__link" + (isActive ? " navbar__link--active" : "")
          }
        >
          Trips
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            "navbar__link" + (isActive ? " navbar__link--active" : "")
          }
        >
          Map
        </NavLink>
        <NavLink
          to="/help"
          className={(isActive) =>
            isActive ? "navbar__link" : "navbar__link navbar__link--active"
          }
        >
          Help
        </NavLink>
        <NavLink
          to="/settings"
          className={(isActive) =>
            isActive ? "navbar__link" : "navbar__link navbar__link--active"
          }
        >
          Settings
        </NavLink>
        <Link onClick={handleLogout} to="/" className="navbar__link">
          Sign out
        </Link>
      </div>
    );
  };

  const generateDesktop = () => {
    return (
      <div className="navbar">
        {authenticated && (
          <Link className="navbar__title" to="/destinations">
            Bucket List
          </Link>
        )}
        {authenticated === false && (
          <Link className="navbar__title" to="/">
            Bucket List
          </Link>
        )}
        {authenticated && generateLinks(false)}
        {authenticated === false && generateUnauthenticatedLinks(false)}
      </div>
    );
  };

  const generateMobile = () => {
    return (
      <header className="navbar navbar--mobile">
        {authenticated && (
          <Link className="navbar__title" to="/destinations">
            Bucket List
          </Link>
        )}
        {authenticated === false && (
          <Link className="navbar__title" to="/">
            Bucket List
          </Link>
        )}
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
        {authenticated && hamburgerActive && (
          <div className="navbar-dropdown-mobile">{generateLinks(true)}</div>
        )}
        {authenticated === false && hamburgerActive && (
          <div className="navbar-dropdown-mobile">
            {generateUnauthenticatedLinks(true)}
          </div>
        )}
      </header>
    );
  };

  return (
    <>
      <div className="navbar__container">
        <div className="navbar__background">
          <MediaQuery minWidth={Globals.responsiveWidth + 1}>
            {generateDesktop()}
          </MediaQuery>
          <MediaQuery maxWidth={Globals.responsiveWidth}>
            {generateMobile()}
          </MediaQuery>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
