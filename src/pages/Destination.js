import "../styles/destination.css";
import { useEffect, useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import backendFetch from "../axios/backendFetch";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Spacer } from "../components/Spacer";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import PageContent from "../components/PageContent";
import {
  GenericButton,
  GenericDropdown,
  GenericImageInput,
  GenericInputParagraph,
  GenericParagraph,
} from "../components/GenericComponents";
import Card from "../components/Card";
import Globals from "../Globals";
import TextAreaAutosize from "react-textarea-autosize";
import { ReactComponent as Delete } from "../images/delete.svg";
import { ReactComponent as Pin } from "../images/location_pin.svg";
import { DeletionModal } from "../components/DeletionModal";
import DeletingPopup from "../components/DeletingPopup";
import { useForm } from "../validation/useForm";
import { DestinationLoading } from "../components/Templates";
import { usePlacesWidget } from "react-google-autocomplete";
import globals from "../Globals";

function Destination({ dest, back }) {
  const navigate = useNavigate();

  // const locationName = document
  // .getElementById("location-autofill")
  // .value.trim();
  // Properties
  const [name, setName] = useState(dest.name);
  const [location, setLocation] = useState(dest.location);
  const [city, setCity] = useState(dest.city);
  const [country, setCountry] = useState(dest.country);
  const [continent, setContinent] = useState(dest.continent);
  const [visited, setVisited] = useState(dest.visited);
  const [position, setPosition] = useState(dest.position);
  const [trip, setTrip] = useState(dest.trip);
  const [type, setType] = useState(dest.type);
  const [desc, setDesc] = useState(dest.desc);
  const [locationName, setLocationName] = useState(dest.locationName);

  // Image
  const [image, setImage] = useState("");
  const [changedImage, setChangedImage] = useState(false);
  const [prevImage, setPrevImage] = useState(dest.imgLink);
  const [loadingImage, setLoadingImage] = useState(false);

  // Trip names
  const [loading, setLoading] = useState(true);
  const [tripNames, setTripNames] = useState(["None"]);

  // Delete / Save stuff
  const [unsavedState, setUnsavedState] = useState(dest);
  const [deletionModal, setDeletionModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  const [savingType, setSavingType] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [savingVisited, setSavingVisited] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const saveDelay = 500;

  // Output from Autofill Widget
  const [locationOutput, setLocationOutput] = useState("");
  const [locationNameOutput, setLocationNameOutput] = useState("");

  /*
   * Take outputs from onPlaceSelected, if the location has changed, save
   * the new Location Name
   */
  useEffect(() => {
    if (locationOutput !== "" && locationOutput !== unsavedState.location) {
      setLocationName(locationNameOutput);
      setLocation(locationOutput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationOutput, locationNameOutput]);

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
    onPlaceSelected: (place, textElem) => {
      if (place && place.formatted_address) {
        setLocationNameOutput(textElem.value.replace("\n", ""));
        setSavingLocation(true);
        setLocationOutput(place.formatted_address);
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
      }
    },
    options: {
      types: ["establishment"],
    },
  });

  // Validation
  const {
    form,
    onChange,
    onBlur,
    onAutofillSelect,
    validity,
    displayAllErrors,
  } = useForm({
    title: name,
    editLocation: "",
  });

  // Load the trip names in
  useEffect(() => {
    backendFetch.get("/getTrips").then((res) => {
      const tripNames = res.data.trips.map((trip) => trip.name);
      setTripNames(["None"].concat(tripNames));
      setLoading(false);
    });
  }, []);

  const saveChanges = () => {
    let updateInfo = {};
    console.log("Saving...");

    // Determine which variables have been updated
    if (desc !== unsavedState.desc) {
      updateInfo.desc = desc.trim();
    } else {
      setSavingDesc(false);
    }
    if (trip !== unsavedState.trip) {
      updateInfo.trip = trip;
    } else {
      setSavingTrip(false);
    }
    if (type !== unsavedState.type) {
      updateInfo.type = type;
    } else {
      setSavingType(false);
    }
    if (visited !== unsavedState.visited) {
      updateInfo.visited = visited;
    } else {
      setSavingVisited(false);
    }
    if (validity.title.error) {
      setSavingName(false);
    } else if (name !== unsavedState.name) {
      updateInfo.name = form.title.trim();
    } else {
      setSavingName(false);
    }

    // Setup location vars
    if (location !== unsavedState.location) {
      updateInfo.placeID = Math.floor(Math.random() * 1000000);
      updateInfo.locationName = locationName;
      updateInfo.location = location;
      updateInfo.city = city;
      updateInfo.country = country;
      updateInfo.continent = continent;
      updateInfo.position = position;
    } else {
      setSavingLocation(false);
    }

    if (changedImage) {
      updateInfo.img = image;
      setChangedImage(false);
    }
    displayAllErrors();

    // Mark the sent off variables as saved
    let newState = unsavedState;
    for (const key in updateInfo) {
      newState[key] = updateInfo[key];
    }
    setUnsavedState(newState);

    // Update the changed variables in the backend
    if (Object.keys(updateInfo).length !== 0) {
      console.log("Sent the following data");
      console.log(updateInfo);
      backendFetch
        .post(
          "/updateDestination/" + dest._id + "/" + changedImage,
          updateInfo,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((res) => {
          if (changedImage) {
            setLoadingImage(false);
          }
          setSavingVisited(false);
          setSavingName(false);
          setSavingDesc(false);
          setSavingTrip(false);
          setSavingType(false);
          setSavingImage(false);
          setSavingLocation(false);
        })
        .catch(() => {
          console.log("error");
          if (changedImage) {
            setLoadingImage(false);
          }
        });
    }

    if (!changedImage) {
      setLoadingImage(false);
    }
  };

  const imageUpdate = (e) => {
    setChangedImage(true);
    setPrevImage(null);
    setImage(e);
    setLoadingImage(true);
    setSavingImage(true);
  };

  // Save changes {saveDelay} after any changes
  useEffect(() => {
    const res = setTimeout(saveChanges, saveDelay);
    return () => clearTimeout(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, type, trip, visited, name, image, locationChosen]);

  // Determine the index of the current trip
  let tripIndex = 0;
  if (trip && trip !== "None") {
    let result = tripNames.indexOf(trip);
    if (result !== -1) {
      tripIndex = result;
    }
  }

  if (!trip) {
    setTrip("None");
  }

  const onDeletionModalCancel = () => {
    setDeletionModal(null);
  };
  const onDeletionModalConfirmation = () => {
    console.log("Deleting Destination...");
    console.log(dest);

    setDeletionModal(null);
    setDeleting(true);
    backendFetch.post("/deleteDestination/" + deletionModal._id).then(() => {
      setDeleting(false);
      navigate(back);
    });
  };

  return (
    <>
      {deleting && <DeletingPopup />}
      {deletionModal && (
        <DeletionModal
          itemName={deletionModal.name}
          onDeletionModalCancel={onDeletionModalCancel}
          onDeletionModalConfirmation={onDeletionModalConfirmation}
        />
      )}
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
                  setSavingName(true);
                }}
                placeholder="Enter a Name"
                onBlur={(e) => onBlur(e)}
              />
              {savingName && (
                <p className="destination__saving-text">Saving...</p>
              )}
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
                defaultValue={locationName}
              />
              {savingLocation && (
                <p className="destination__saving-text">Saving...</p>
              )}
            </div>

            <div>
              <GenericImageInput
                image={image}
                prevImage={prevImage}
                onChange={imageUpdate}
                loading={loadingImage}
                seamless={true}
              />
              {savingImage && (
                <p className="destination__saving-text">Saving...</p>
              )}
            </div>
            <div className="formContent">
              <div>
                {loading && (
                  <GenericParagraph title="Trip">Loading...</GenericParagraph>
                )}
                {!loading && (
                  <GenericDropdown
                    title="Trip"
                    onChange={(e) => {
                      setTrip(e.target.value);
                      setSavingTrip(true);
                    }}
                    defaultOption={tripIndex}
                    options={tripNames}
                  />
                )}
                {savingTrip && (
                  <p className="destination__saving-text">Saving...</p>
                )}
              </div>
              <div>
                <GenericDropdown
                  title={"Type"}
                  defaultOption={Globals.typeOptions.indexOf(dest.type)}
                  options={Globals.typeOptions}
                  onChange={(e) => {
                    setType(e.target.value);
                    setSavingType(true);
                  }}
                />
                {savingType && (
                  <p className="destination__saving-text">Saving...</p>
                )}
              </div>
              <div className="destination__desc--container">
                <GenericInputParagraph
                  className="destination__desc destination__text--body"
                  title="Description"
                  defaultValue={desc}
                  onChange={(e) => {
                    setDesc(e.target.value.trim());
                    setSavingDesc(true);
                  }}
                />
                {savingDesc && (
                  <p className="destination__saving-text">Saving...</p>
                )}
              </div>
            </div>
            <div className="destination__icons">
              <div
                className="destination__icons__icon--container"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    pathname: "/map",
                    search: `?${createSearchParams({
                      lat: position[0].lat,
                      lng: position[0].lng,
                      zoom: 13,
                    })}`,
                  });
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
                  setDeletionModal(dest);
                }}
              >
                <button className="destination__icons__icon">
                  <Delete className="destination__icons__icon--delete" />
                </button>
                <p className="destination__icons__icon--text">Delete</p>
              </div>
            </div>
            <div>
              {!visited && (
                <GenericButton
                  className="destination__button--visited"
                  onClick={() => {
                    setVisited(true);
                    setSavingVisited(true);
                  }}
                >
                  Mark as Visited!
                </GenericButton>
              )}
              {visited && (
                <GenericButton
                  className="destination__button--visited"
                  onClick={() => {
                    setSavingVisited(true);
                    setVisited(false);
                  }}
                >
                  Mark as Unvisited
                </GenericButton>
              )}
              {savingVisited && (
                <p className="destination__saving-text">Saving...</p>
              )}
            </div>
          </Spacer>
        </Card>
        <br />
        <GenericButton
          className="destination__button--home"
          onClick={() => {
            navigate(back);
          }}
        >
          Back
        </GenericButton>
      </Spacer>
    </>
  );
}

function DestinationPage() {
  const [searchParams] = useSearchParams();
  const [backLoc, setBackLoc] = useState("/destinations");
  const location = useLocation();
  const navigate = useNavigate();
  const { destination } = useParams();
  const [loading, setLoading] = useState(true);
  const [dest, setDest] = useState(null);

  useEffect(() => {
    const srcPage = searchParams.get("from");
    if (srcPage) {
      setBackLoc("/trips/" + srcPage);
    }
  }, [searchParams]);

  // Fetch the destination if we didn't receive it from navigation
  useEffect(() => {
    if (location && location.state && location.state.dest) {
      // Clear the location state (so that data is reloaded on a refresh)
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
        },
        { replace: true }
      );

      // Load in the dest
      setDest(location.state.dest);
      setLoading(false);
    } else {
      backendFetch
        .get("/getDestination/" + destination)
        .then((res) => {
          setDest(res.data.destination);
          setLoading(false);
        })
        .catch(() => {
          navigate("/access_denied", { replace: true });
        });
    }
  }, [navigate, destination, location]);

  useEffect(() => {
    if (!loading && !dest) {
      navigate("/access_denied", { replace: true });
    }
  }, [loading, dest, navigate]);

  if (loading) {
    document.title = "Bucket List - Loading...";
  } else {
    document.title = "Bucket List - " + dest.name;
  }

  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          {loading ? (
            <DestinationLoading />
          ) : (
            <Destination dest={dest} back={backLoc} />
          )}
        </PageContent>
      </Footer>
    </>
  );
}

export default DestinationPage;
