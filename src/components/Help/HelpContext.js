import React, { useState } from "react";

const HelpContext = React.createContext(null);

const HelpProvider = ({ children }) => {
  const [enabled, setEnabled] = useState([]);
  const [next, setNext] = useState("");
  const [step, setStep] = useState(0);
  const [prev, setPrev] = useState(null);
  const [content, setContent] = useState([]);

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const onPrev = () => {
    setStep((prevStep) => {
      if (prevStep - 1 >= 0) return prevStep - 1;
      return prevStep;
    });
  };

  const setContentField = (field, value) => {
    let x = content;
    x[field] = value;
    setContent(x);
  };

  const value = {
    enabled,
    setEnabled: setEnabled,
    onNext: onNext,
    onPrev: onPrev,
    step: step,
    next,
    prev,
    content,
    setContent: setContent,
    setNext: setNext,
    setPrev: setPrev,
    setContentField: setContentField,
    setStep: setStep,
  };

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
};

const useHelp = () => {
  return React.useContext(HelpContext);
};

export { useHelp, HelpProvider };
