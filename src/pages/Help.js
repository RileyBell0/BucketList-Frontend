import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import Destinations from "../components/Help/Destinations";
import AddDestination from "../components/Help/AddDestination";
import "../styles/help.css";
import {
  GenericButton,
  GenericDropdown,
} from "../components/GenericComponents";
import { Spacer } from "../components/Spacer";
import { HelpProvider, useHelp } from "../components/Help/HelpContext";
import Destination from "../components/Help/Destination";

function Help() {
  const dropdownOptions = ["Add destination", "Edit destination"];
  const defaultGuide = dropdownOptions[0];
  const [guide, setGuide] = useState(defaultGuide);
  const {
    setEnabled,
    setNext,
    step,
    setPrev,
    setContent,
    content,
    onPrev,
    onNext,
    setStep,
  } = useHelp();

  useEffect(() => {
    setEnabled(guideMap[guide][step].enabled);
    console.log(content);
    setNext(guideMap[guide][step].next);
    console.log(guideMap[guide][step]);
    if (guideMap[guide][step].content) {
      console.log(guideMap[guide][step].content(content));
      setContent(
        JSON.parse(JSON.stringify(guideMap[guide][step].content(content)))
      );
    }
    setPrev(guideMap[guide][step].prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide, step]);

  return (
    <>
      <h1>Help</h1>
      <h3>Please select the topic and follow the guide below</h3>
      <GenericDropdown
        options={dropdownOptions}
        defaultOption={defaultGuide}
        onChange={(e) => {
          setGuide(e.target.value);
          setStep(0);
        }}
      />
      <Spacer className="help__spacer" />
      <h3
        className={
          step + 1 !== guideMap[guide].length
            ? "step-text"
            : "step-text--complete"
        }
      >
        {step + 1 !== guideMap[guide].length ? `Step ${step + 1}:` : ""}{" "}
        {guideMap[guide][step].text}
      </h3>
      {guideMap[guide][step].render(content)}
      <div className="step-buttons">
        <GenericButton
          className={step === 0 ? "generic-button--disabled" : ""}
          disabled={step === 0}
          onClick={() => onPrev()}
        >
          Prev step
        </GenericButton>
        <GenericButton
          className={
            step === guideMap[guide].length - 1
              ? "generic-button--disabled"
              : ""
          }
          disabled={step === guideMap[guide].length - 1}
          onClick={() => onNext()}
        >
          Next step
        </GenericButton>
      </div>
    </>
  );
}

const exampleDest = {
  _id: "1",
  name: "Visit the eiffel tower",
  city: "Paris",
  country: "France",
  continent: "Europe",
  type: "Landmark",
  visited: false,
  desc: "",
  location: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
};

const addedExample = {
  _id: "2",
  name: "A new destination!",
  city: "Warsaw",
  country: "Poland",
  continent: "Europe",
  type: "Landmark",
  visited: false,
  desc: "",
  location:
    "Warsaw Central Railway Station, Lechistan, al. Jerozolimskie 54, 00-024 Warszawa, Poland",
};

const addDestination = [
  {
    render: (props) => (
      <>
        <Destinations />
      </>
    ),
    next: "add",
    prev: null,
    enabled: ["add"],
    content: () => [exampleDest],
    text: "Click the new destinations button on the destinations page",
  },
  {
    render: (props) => (
      <>
        <AddDestination />
      </>
    ),
    next: "save",
    prev: "back",
    enabled: ["back", "save"],
    text: "Fill out the fields and click save",
  },
  {
    render: (props) => (
      <>
        <Destinations />
      </>
    ),
    next: null,
    prev: null,
    enabled: [],
    content: (x) => {
      if (x.length && x.length !== 2) {
        x.push(addedExample);
      }
      return x;
    },
    text: "A destination has been successfully added!",
  },
];

const editDestination = [
  {
    render: (props) => (
      <>
        <Destinations />
      </>
    ),
    next: "card",
    prev: null,
    enabled: ["card"],
    content: (x) => [exampleDest],
    text: "Click on anywhere on the destination card you wish to edit",
  },
  {
    render: (props) => {
      console.log(props);
      return (
        <>
          <Destination dest={exampleDest} />
        </>
      );
    },
    next: "back",
    prev: null,
    enabled: ["back"],
    content: (x) => [exampleDest],
    text: "Edit fields and click back to return to the destinations page",
  },
  {
    render: (props) => (
      <>
        <Destinations />
      </>
    ),
    next: null,
    prev: null,
    enabled: [],
    content: null,
    text: "A destination has been successfully edited!",
  },
];

const guideMap = {
  "Add destination": addDestination,
  "Edit destination": editDestination,
};

function HelpPage() {
  document.title = "Bucket List - Help";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <HelpProvider>
            <Help />
          </HelpProvider>
        </PageContent>
      </Footer>
    </>
  );
}

export default HelpPage;
