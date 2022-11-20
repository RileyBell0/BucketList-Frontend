import { useState } from "react";
import { useFormValidation } from "./useFormValidation";

export const useForm = (emptyForm) => {
  const [form, setForm] = useState(emptyForm);
  const { validity, validateForm, checkValidity, setValidityState } =
    useFormValidation(form);

  const onChange = (e) => {
    const field = e.target.name;
    const nextFormState = {
      ...form,
      [field]: e.target.value,
    };
    setForm(nextFormState);
    validateForm(nextFormState, [field], validity, true);
  };

  const onBlur = (e) => {
    const field = e.target.name;

    const fieldValidity = validity[field];

    if (fieldValidity.touched) return;

    const updatedValidity = {
      ...validity,
      [field]: {
        ...validity[field],
        touched: true,
      },
    };
    validateForm(form, [field], updatedValidity, false);
  };

  const onAutofillSelect = (field) => {
    setValidityState(field, {
      touched: true,
      errorMsg: null,
      error: false,
      changed: true,
    });
  };

  const setError = (field, errorMsg) => {
    setValidityState(field, {
      touched: true,
      errorMsg: errorMsg,
      error: true,
      changed: true,
    });
  };

  const displayAllErrors = () => {
    let nextValidity = JSON.parse(JSON.stringify(validity));

    for (const item in nextValidity) {
      nextValidity[item].touched = true;
    }

    validateForm(form, Object.keys(form), nextValidity, false);
  };

  return {
    form,
    onChange,
    onBlur,
    onAutofillSelect,
    validity,
    checkValidity,
    displayAllErrors,
    setError,
  };
};
