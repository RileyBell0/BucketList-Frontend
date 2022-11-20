import "../styles/addDestination.css";
import "../styles/GenericComponents.css";
import React, { useEffect } from "react";
import {
  GenericInput,
  GenericDropdown,
  GenericButton,
  GenericInputParagraph,
  GenericImageInput,
  GenericParagraph,
} from "../components/GenericComponents.js";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { Spacer } from "../components/Spacer";
import backendFetch from "../axios/backendFetch";
import { useForm } from "../validation/useForm";
import { usePlacesWidget } from "react-google-autocomplete";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import globals from "../Globals";
import LoadingIcon from "../components/LoadingIcon";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function AddDestination() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const suppliedTrip = searchParams.get("trip");

  const typeOptions = globals.typeOptions;

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
  const [locationName, setLocationName] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [trips, setTrips] = useState([]);
  const [tripNames, setTripNames] = useState(["None"]);
  const [trip, setTrip] = useState(suppliedTrip ? suppliedTrip : "None");
  const [libraries] = useState(["places"]);
  const [associatedTrip, setAssociatedTrip] = useState(null);
  const relevantTrip = trips.filter(
    (currentTrip) => currentTrip.name === suppliedTrip
  )[0];

  const newAssociatedTrip = trips.filter(
    (currentTrip) => currentTrip.name === trip
  )[0];
  if (newAssociatedTrip !== associatedTrip) {
    setAssociatedTrip(newAssociatedTrip);
  }

  // Output from Autofill Widget
  const [locationOutput, setLocationOutput] = useState("");
  const [locationNameOutput, setLocationNameOutput] = useState("");

  /*
   * Take outputs from onPlaceSelected, if the location has changed, save
   * the new Location Name
   */
  useEffect(() => {
    if (locationOutput !== "" && locationOutput !== location) {
      setLocationName(locationNameOutput);
      setLocation(locationOutput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationOutput, locationNameOutput]);

  useEffect(() => {
    backendFetch.get("/getTrips").then((res) => {
      const tripNames = res.data.trips.map((trip) => trip.name);
      setTripNames(["None"].concat(tripNames));
      setTrips(res.data.trips);
      setLoadingData(false);
    });
  }, []);

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
    onPlaceSelected: (place, textElem) => {
      setLocationNameOutput(textElem.value.replace("\n", ""));
      setLocationOutput(place.formatted_address);
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
      await setIsLoading(false);
      return;
    }
    await setIsLoading(true);

    const destination = {
      name: form.title,
      placeID: Math.floor(Math.random() * 1000000),
      location: location,
      locationName: locationName,
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

    console.log(destination);
    try {
      const response = await backendFetch.post("addDestination/", destination, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);

      if (associatedTrip) {
        navigate("/trips/" + associatedTrip._id);
      } else {
        navigate("/destinations");
      }
    } catch (e) {
      console.log(e);
    }
    await setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="formContent">
        <Spacer>
          <h1>Add Destination</h1>
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
            {loadingData && (
              <GenericParagraph title="Trip">Loading...</GenericParagraph>
            )}
            {loadingData === false && tripNames.length === 0 && (
              <GenericParagraph title="Trip">No trips yet</GenericParagraph>
            )}
            {loadingData === false && tripNames.length !== 0 && (
              <GenericDropdown
                title="Trip"
                options={tripNames}
                defaultOption={tripNames.indexOf(trip)}
                onChange={(e) => setTrip(e.target.value)}
              />
            )}

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
            {isLoading && <LoadingIcon />}
            {isLoading === false && (
              <GenericButton
                type="submit"
                className={
                  !checkValidity(validity) ? "generic-button--disabled" : ""
                }
              >
                Save
              </GenericButton>
            )}
          </Card>
          {!relevantTrip && (
            <Link to="/destinations">
              <GenericButton className="add-destination__back-button">
                Back
              </GenericButton>
            </Link>
          )}
          {relevantTrip && (
            <Link to={"/trips/" + relevantTrip._id}>
              <GenericButton className="add-destination__back-button">
                Back
              </GenericButton>
            </Link>
          )}
        </Spacer>
      </form>
    </>
  );
}

function AddDestinationPage() {
  document.title = "Bucket List - Add Destination";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <AddDestination />
        </PageContent>
      </Footer>
    </>
  );
}

export default AddDestinationPage;
