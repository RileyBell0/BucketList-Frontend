import "../../styles/addDestination.css";
import "../../styles/GenericComponents.css";
import React, { useEffect } from "react";
import {
  GenericInput,
  GenericDropdown,
  GenericButton,
  GenericInputParagraph,
  GenericImageInput,
} from "../GenericComponents.js";
import { useState } from "react";
import Card from "../Card";
import { Spacer } from "../Spacer";
import { useForm } from "../../validation/useForm";
import { usePlacesWidget } from "react-google-autocomplete";
import globals from "../../Globals";
import { useHelp } from "./HelpContext";

function AddDestination() {
  const typeOptions = globals.typeOptions;
  const { enabled, next, onNext, onPrev, prev, setContent } = useHelp();

  const {
    form,
    onChange,
    onBlur,
    onAutofillSelect,
    validity,
    checkValidity,
    displayAllErrors,
  } = useForm({
    title: "",
    location: "",
  });

  const [city, setCity] = useState("");
  const [locationChosen, setLocationChosen] = useState(false);
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [trips] = useState([]);
  const [tripNames] = useState(["None"]);
  const [trip, setTrip] = useState("None");
  const [libraries] = useState(["places"]);
  const [associatedTrip, setAssociatedTrip] = useState(null);
  const relevantTrip = null;

  const newAssociatedTrip = trips.filter(
    (currentTrip) => currentTrip.name === trip
  )[0];
  if (newAssociatedTrip !== associatedTrip) {
    setAssociatedTrip(newAssociatedTrip);
  }

  useEffect(() => {
    if (locationChosen) {
      onAutofillSelect("location");
      setLocationChosen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationChosen]);

  const { ref: placesRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
    onPlaceSelected: (place, input) => {
      setLocation(place.formatted_address);
      console.log("place selected");
      setLocationChosen(true);
      setCity(" ");
      setCountry(" ");
      setContinent(" ");
      for (let i = 0; i < place.address_components.length; i++) {
        if (place.address_components[i].types.includes("country")) {
          setCountry(place.address_components[i].long_name);
          setContinent(
            globals.continents[place.address_components[i].short_name]
          );
        } else if (
          place.address_components[i].types.includes("locality") ||
          place.address_components[i].types.includes(
            "administrative_area_level_3"
          )
        ) {
          setCity(place.address_components[i].long_name);
        }
      }

      setPosition([
        {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      ]);
    },
    options: {
      types: ["establishment"],
    },
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!checkValidity(validity)) {
      displayAllErrors();
      return;
    }

    const destination = {
      _id: 2,
      name: form.title,
      location: location,
      city: city,
      country: country,
      continent: continent,
      type: type,
      visited: false,
      desc: description,
      img: image,
      position: position,
      trip: trip,
    };

    if (next === "save") {
      setContent((prevContent) => {
        let x = prevContent;
        x.push(destination);
        return x;
      });
      onNext();
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="formContent">
        <Spacer>
          <h1 style={{ marginTop: 0 }}>Add Destination</h1>
          <Card>
            <GenericInput
              title="Title"
              type="text"
              name="title"
              error={validity.title.errorMsg}
              value={form.title}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />
            <GenericInput
              title="Location"
              reference={placesRef}
              type="text"
              name="location"
              error={validity.location.errorMsg}
              onChange={(e) => onChange(e)}
              onBlur={(e) => onBlur(e)}
            />
            <GenericDropdown
              title="Trip"
              options={tripNames}
              defaultOption={tripNames.indexOf(trip)}
              onChange={(e) => setTrip(e.target.value)}
            />

            <GenericDropdown
              title="Type"
              options={typeOptions}
              onChange={(e) => setType(e.target.value)}
            />

            <GenericInputParagraph
              title="Description"
              onChange={(e) => setDescription(e.target.value)}
            />

            <GenericImageInput
              title="Image"
              onChange={(e) => setImage(e)}
              image={image}
            />
            <br />
            <br />
            <GenericButton
              type="submit"
              className={
                (!checkValidity(validity) ? "generic-button--disabled" : "") +
                (next === "save" ? " emphasised" : "")
              }
            >
              Save
            </GenericButton>
          </Card>
          {!relevantTrip && (
            <GenericButton
              className="add-destination__back-button"
              onClick={
                enabled.includes("back")
                  ? prev === "back"
                    ? () => onPrev()
                    : () => {
                        console.log(prev);
                      }
                  : () => {}
              }
            >
              Back to Destinations
            </GenericButton>
          )}
          {relevantTrip && (
            <GenericButton className="add-destination__back-button">
              Back to - {relevantTrip.name}
            </GenericButton>
          )}
        </Spacer>
      </form>
    </>
  );
}

export default AddDestination;
