import "../../styles/destination.css";
import { useEffect, useState } from "react";
import { Spacer } from "../Spacer";
import {
  GenericButton,
  GenericDropdown,
  GenericImageInput,
  GenericInputParagraph,
} from "../GenericComponents";
import Card from "../Card";
import Globals from "../../Globals";
import TextAreaAutosize from "react-textarea-autosize";
import { ReactComponent as Delete } from "../../images/delete.svg";
import { ReactComponent as Pin } from "../../images/location_pin.svg";
import { useForm } from "../../validation/useForm";
import { usePlacesWidget } from "react-google-autocomplete";
import globals from "../../Globals";
import { useHelp } from "./HelpContext";

function Destination({ dest }) {
  const { next, onNext, setContent, content } = useHelp();

  // Properties
  const [name, setName] = useState(dest.name);
  const [location, setLocation] = useState(dest.location);
  const [city, setCity] = useState(dest.city);
  const [country, setCountry] = useState(dest.country);
  const [continent, setContinent] = useState(dest.continent);
  const [position, setPosition] = useState(dest.position);
  const [trip, setTrip] = useState(dest.trip);
  const [type, setType] = useState(dest.type);
  const [desc, setDesc] = useState(dest.desc);

  // Image
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState(dest.imgLink);

  // Location autofill
  const [libraries] = useState(["places"]);
  const [locationChosen, setLocationChosen] = useState(false);

  // Update location on locationChosen change
  useEffect(() => {
    if (locationChosen) {
      onAutofillSelect("editLocation");
      setLocationChosen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationChosen]);

  // The Google API places widget (for autofill location)
  const { ref: placesRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
    onPlaceSelected: (place) => {
      setLocation(place.formatted_address);
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

  // Validation
  const { onChange, onBlur, onAutofillSelect, validity } = useForm({
    title: name,
    editLocation: "",
  });

  const imageUpdate = (e) => {
    setPrevImage(null);
    setImage(e);
  };

  return (
    <>
      <br />
      <Spacer>
        <Card className="formContent">
          <Spacer>
            <div className="destination__name--container">
              <TextAreaAutosize
                defaultValue={name}
                className="destination__name destination__text--header"
                type="text"
                name="title"
                onChange={(e) => {
                  onChange(e);
                  setName(e.target.value.trim());
                }}
                placeholder="Enter a Name"
                onBlur={(e) => onBlur(e)}
              />
              {validity.title.errorMsg && (
                <div className="generic-input__error">
                  {validity.title.errorMsg}
                </div>
              )}
            </div>
            <div className="destination__name--container">
              <TextAreaAutosize
                id="location-autofill"
                className="destination__name destination__text--subheader"
                title="Location"
                ref={placesRef}
                type="text"
                name="editLocation"
                error={validity.editLocation.errorMsg}
                onChange={(e) => {
                  onChange(e);
                }}
                onBlur={(e) => {
                  onBlur(e);
                }}
                defaultValue={location}
              />
            </div>

            <div>
              <GenericImageInput
                image={image}
                prevImage={prevImage}
                onChange={imageUpdate}
                loading={null}
                seamless={true}
              />
            </div>
            <div className="formContent">
              <div>
                <GenericDropdown
                  title="Trip"
                  onChange={(e) => {
                    setTrip(e.target.value);
                  }}
                  defaultOption={"None"}
                  options={["None"]}
                />
              </div>
              <div>
                <GenericDropdown
                  title={"Type"}
                  defaultOption={Globals.typeOptions.indexOf(dest.type)}
                  options={Globals.typeOptions}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                />
              </div>
              <div className="destination__desc--container">
                <GenericInputParagraph
                  className="destination__desc destination__text--body"
                  title="Description"
                  defaultValue={desc}
                  onChange={(e) => {
                    setDesc(e.target.value.trim());
                  }}
                />
              </div>
            </div>
            <div className="destination__icons">
              <div
                className="destination__icons__icon--container"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button className="destination__icons__icon">
                  <Pin className="destination__icons__icon--map" />
                </button>
                <p className="destination__icons__icon--text">View on Map</p>
              </div>
              <div
                className="destination__icons__icon--container"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button className="destination__icons__icon">
                  <Delete className="destination__icons__icon--delete" />
                </button>
                <p className="destination__icons__icon--text">Delete</p>
              </div>
            </div>
            <div>
              <GenericButton
                className="destination__button--visited"
                onClick={() => {}}
              >
                Mark as Unvisited
              </GenericButton>
            </div>
          </Spacer>
        </Card>
        <br />
        <GenericButton
          className={
            "destination__button--home" + (next === "back" ? " emphasised" : "")
          }
          onClick={() => {
            if (next === "back") {
              let newContent = [
                {
                  _id: content._id,
                  name: name,
                  city: city,
                  country: country,
                  continent: continent,
                  location: location,
                  type: type,
                  trip: trip,
                  position: position,
                },
              ];
              console.log(newContent);
              setContent(newContent);
              onNext();
            }
          }}
        >
          Back
        </GenericButton>
      </Spacer>
    </>
  );
}

export default Destination;
