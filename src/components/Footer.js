import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth";
import "../styles/footer.css";

function Footer({ children, textClass, footerClass }) {
  const { handleLogout, authenticated } = useAuth();

  const text = "footer__text " + (textClass ? textClass : "");

  return (
    <>
      <div className="footer__placement">
        <div className="footer__children-container">{children}</div>
        <div
          className={"footer__container " + (footerClass ? footerClass : "")}
        >
          <div className="footer__content">
            <Link to="/" className="footer__link">
              <p className={text}>Welcome</p>
            </Link>
            <p className={text}> • </p>
            <Link to="/about" className="footer__link">
              <p className={text}>About Us</p>
            </Link>
            {authenticated && (
              <>
                <p className={text}> • </p>
                <Link to="/destinations" className="footer__link">
                  <p className={text}>Destinations</p>
                </Link>
                <p className={text}> • </p>
                <Link to="/trips" className="footer__link">
                  <p className={text}>Trips</p>
                </Link>
                <p className={text}> • </p>
                <Link to="/map" className="footer__link">
                  <p className={text}>Map</p>
                </Link>
                <p className={text}> • </p>
                <Link to="/help" className="footer__link">
                  <p className={text}>Help</p>
                </Link>
                <p className={text}> • </p>
                <Link to="/settings" className="footer__link">
                  <p className={text}>Settings</p>
                </Link>
                <p className={text}> • </p>

                <Link to="/" className="footer__link" onClick={handleLogout}>
                  <p className={text}>Sign Out</p>
                </Link>
              </>
            )}
            {!authenticated && (
              <>
                <p className={text}> • </p>
                <Link to="/login" className="footer__link">
                  <p className={text}>Log In</p>
                </Link>
                <p className={text}> • </p>
                <Link to="/signup" className="footer__link">
                  <p className={text}>Sign Up</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
