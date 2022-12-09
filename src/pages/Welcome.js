import "../styles/welcome.css";
import React from "react";
import WelcomeButton from "../components/WelcomeButton.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import Footer from "../components/Footer";
import { ThemeLoader } from "../themes/Themes";
import { ItemCard } from "../components/ItemCards";
import riley from "../images/riley.png";
import ted from "../images/ted.jpg";
import luke from "../images/luke.jpg";
import jude from "../images/jude.jpg";
import daniel from "../images/daniel.png";
import { Spacer } from "../components/Spacer";

const exampleItems = [
  {
    _id: 1,
    name: "The Eiffel Tower",
    type: "",
    city: "Paris",
    country: "France",
    imgLink:
      "https://www.qantas.com/content/travelinsider/en/trending/eiffel-tower-paris-france-new-park-plans-garden-city/_jcr_content/parsysTop/hero.img.full.medium.jpg/1565313584143.jpg",
    desc: "I've always wanted to visit The Eiffel Tower! I'm hoping to go next June with Susan, though we're still yet to book our flights!",
  },
  {
    _id: 2,
    name: "Mjolner",
    type: "",
    city: "Melbourne",
    country: "Australia",
    imgLink:
      "https://imgix.theurbanlist.com/content/article/mjolner-melbourne-bar.jpg",
    desc: "A Viking and Norse-inspired restaurant? In the heart of Melbourne? And you get to choose your own knife to eat with? Sign me up.",
  },
];

function TeamCard({ name, photo, roles }) {
  return (
    <div className="team">
      <div className="team__photo--container">
        <img className="team__photo" src={photo} alt={name} />
      </div>
      <div className="team__name">{name}</div>
      {roles.map((role) => {
        return (
          <div className="team__role" key={role}>
            {role}
          </div>
        );
      })}
    </div>
  );
}

// Return a div containing relevant redirect buttons
function WelcomeButtons() {
  const { authenticated, loadedAuth } = useAuth();
  const navigate = useNavigate();

  // Determine which buttons are needed on the page
  let buttons = <></>;
  if (!loadedAuth) {
    buttons = (
      <WelcomeButton className="welcome-button welcome-button__loading">
        Loading...
      </WelcomeButton>
    );
  } else if (authenticated) {
    buttons = (
      <WelcomeButton onClick={() => navigate("/destinations")}>
        My Destinations
      </WelcomeButton>
    );
  } else {
    buttons = (
      <>
        <WelcomeButton onClick={() => navigate("/signup")}>
          Get Started
        </WelcomeButton>
      </>
    );
  }

  // Return page buttons
  return <div className="welcome__content__buttons">{buttons}</div>;
}

function NavbarButton() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  if (authenticated === true) {
    return (
      <div
        onClick={() => navigate("/destinations")}
        className="welcome__navbar-button"
      >
        Home
      </div>
    );
  }
  return (
    <div onClick={() => navigate("/signup")} className="welcome__navbar-button">
      Sign Up
    </div>
  );
}

// Welcome page content
function HeaderSection() {
  return (
    <>
      <div className="welcome">
        <div className="welcome__navbar">
          <h1 className="welcome__navbar__title">Bucket List</h1>
          <NavbarButton />
        </div>
        <div className="welcome__content">
          <div>
            <h1 className="welcome__header__heading">
              Where will you go next?
            </h1>
            <p className="welcome__header__text">
              Plan your next trip or record the restaurants you've tried. Making
              a Bucket List has never been easier
            </p>
          </div>
          <WelcomeButtons />
        </div>
      </div>
    </>
  );
}

function ExampleSection() {
  return (
    <>
      <div className="welcome__example--bg">
        <div className="welcome__example">
          <div className="welcome__example__content">
            <div className="welcome__example__padding">
              <h1 className="welcome__example__header">
                Choose your next destination
              </h1>
              <p className="welcome__example__text">
                Do you want to travel aboard? Go sightseeing? Or maybe try out
                that new restaurant down the street?
              </p>
            </div>
          </div>

          <div className="welcome__separator" />

          <div className="welcome__example__content">
            <div className="welcome__example__padding">
              <h1 className="welcome__example__header">Track your goals</h1>
              <p className="welcome__example__text">
                Whether you want to plan your trip to France or remember the
                next restaurant to try, you can plan it with Bucket List
              </p>
              <br />
              <div className="welcome__example__items">
                <Spacer>
                  <ItemCard item={exampleItems[0]} disabled={true} />
                  <ItemCard item={exampleItems[1]} disabled={true} />
                </Spacer>
              </div>
              <br />
            </div>
          </div>

          <div className="welcome__separator" />

          <div className="welcome__example__content">
            <div className="welcome__example__padding">
              <h1 className="welcome__example__header">Organise your goals</h1>
              <p className="welcome__example__text">
                Maybe you have a trip planned to Europe or a list of local
                restaurants you want to try. Group these together and start
                checking them off!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AttributionSection() {
  return (
    <>
      <div className="welcome__attribution">
        <h1 className="welcome__attribution__header">The Team</h1>
        <div className="welcome__attribution__team-card-holder">
          <TeamCard
            name="Riley Bell"
            roles={["Product Owner", "Frontend Lead"]}
            photo={riley}
          />
          <TeamCard name="Luke Russo" roles={["Backend Lead"]} photo={luke} />
          <TeamCard
            name="Ted Barrett"
            roles={["Scrum Master", "QA Lead"]}
            photo={ted}
          />
          <TeamCard
            name="Jude Offord"
            roles={["Google API Expert"]}
            photo={jude}
          />
          <TeamCard
            name="Daniel Chen"
            roles={["Imgur API Expert"]}
            photo={daniel}
          />
        </div>
      </div>
    </>
  );
}

// Overall Page Attributes
function WelcomePage() {
  document.title = "Bucket List";
  return (
    <>
      <div className="welcome__globals">
        <Footer className="welcome__footer">
          <ThemeLoader />
          <HeaderSection />
          {/* <AboutSection />
          <div className="welcome__separator" /> */}
          <ExampleSection />
          <div className="welcome__separator" />
          <AttributionSection />
          <div className="welcome__separator" />
        </Footer>
      </div>
    </>
  );
}

export default WelcomePage;
