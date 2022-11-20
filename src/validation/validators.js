const required = "This field is required";

const email = (form, validity) => {
  if (form.email === "") {
    if (validity.email.touched) validity.email.errorMsg = required;
    validity.email.error = true;
  } else if (!new RegExp(/\S+@\S+\.\S+/).test(form.email)) {
    if (validity.email.touched)
      validity.email.errorMsg = "Please enter a valid email";
    validity.email.error = true;
  } else {
    validity.email.error = false;
    validity.email.errorMsg = null;
  }

  return validity;
};

const password = (form, validity) => {
  if (form.password === "") {
    validity.password.error = true;
    if (validity.password.touched) validity.password.errorMsg = required;
  } else if (form.password.length < 8) {
    validity.password.error = true;
    if (validity.password.touched)
      validity.password.errorMsg =
        "Your password must be at least 8 characters";
  } else {
    validity.password.errorMsg = null;
    validity.password.error = false;
  }

  if ("confirmPassword" in form && validity.confirmPassword.touched) {
    return confirmPassword(form, validity);
  }
  return validity;
};

const confirmPassword = (form, validity) => {
  if (form.confirmPassword !== form.password) {
    if (validity.confirmPassword.touched)
      validity.confirmPassword.errorMsg = "Passwords must match";
    validity.confirmPassword.error = true;
  } else {
    validity.confirmPassword.errorMsg = null;
    validity.confirmPassword.error = false;
  }

  return validity;
};

const title = (form, validity) => {
  if (form.title === "") {
    if (validity.title.touched) validity.title.errorMsg = required;
    validity.title.error = true;
  } else {
    validity.title.error = false;
    validity.title.errorMsg = null;
  }

  return validity;
};

const location = (form, validity, onChange) => {
  if (!onChange) {
    if (validity.location.error && validity.location.touched)
      validity.location.errorMsg = "Please select location from suggestions";
    else {
      validity.location.errorMsg = null;
    }
  } else {
    validity.location.error = true;
    if (validity.location.touched)
      validity.location.errorMsg = "Please select location from suggestions";
  }
  return validity;
};

const editLocation = (form, validity, onChange) => {
  if (!onChange && !validity.editLocation.changed) {
    validity.editLocation.error = false;
    return validity;
  }

  if (!onChange) {
    if (!validity.editLocation.changed) {
      validity.editLocation.error = false;
    } else if (validity.editLocation.error && validity.editLocation.touched)
      validity.editLocation.errorMsg =
        "Please select location from suggestions";
    else {
      validity.editLocation.errorMsg = null;
    }
  } else {
    validity.editLocation.error = true;
    validity.editLocation.changed = true;
    if (validity.editLocation.touched)
      validity.editLocation.errorMsg =
        "Please select location from suggestions";
  }
  return validity;
};

const validators = {
  email: email,
  password: password,
  confirmPassword: confirmPassword,
  title: title,
  location: location,
  editLocation: editLocation,
};

export default validators;
