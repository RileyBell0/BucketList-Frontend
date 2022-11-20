import { useState } from "react";
import { useEffect } from "react";
import validators from "./validators";

export const useFormValidation = (form) => {
  const generateInitialState = (form) => {
    let initial = {};
    for (const key of Object.keys(form)) {
      initial[key] = {
        touched: false,
        errorMsg: null,
        error: true,
        changed: false,
      };
    }

    return initial;
  };

  const [validity, setValidity] = useState(generateInitialState(form));

  const validateForm = (form, fields, validity, onChange) => {
    let nextValidity = JSON.parse(JSON.stringify(validity));

    for (const field of fields) {
      if (field in validators) {
        nextValidity = validators[field](form, nextValidity, onChange);
      }
    }

    setValidity(nextValidity);
  };

  useEffect(() => {
    validateForm(form, Object.keys(form), validity, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkValidity = (nextValidity) => {
    for (const item in nextValidity) {
      if (nextValidity[item].error) return false;
    }

    return true;
  };

  const setValidityState = (field, state) => {
    let nextValidity = JSON.parse(JSON.stringify(validity));
    nextValidity[field] = state;
    setValidity(nextValidity);
    return nextValidity;
  };

  return { validity, validateForm, checkValidity, setValidityState };
};
