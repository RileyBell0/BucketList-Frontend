import "../styles/trip.css";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import backendFetch from "../axios/backendFetch";
import { Spacer } from "../components/Spacer";
import Card from "../components/Card";
import {
  GenericButton,
  GenericInputParagraph,
} from "../components/GenericComponents";
import TextAreaAutosize from "react-textarea-autosize";
import Popup from "../components/Popup";
import DeletingPopup from "../components/DeletingPopup";
import { ItemCardList } from "../components/ItemCards";
import { ItemCardLoading, TripLoading } from "../components/Templates";
import WideToggle from "../components/WideToggle";
import { useForm } from "../validation/useForm";
import { DeletionModal } from "../components/DeletionModal";

function Trip({ trip, destinations, tripNames }) {
  const navigate = useNavigate();

  // Properties
  const [name, setName] = useState(trip.name);
  const [desc, setDesc] = useState(trip.desc);
  const [dests, setDests] = useState(destinations);
  const [numComplete, setNumComplete] = useState(undefined);
  const [totalDests, setTotalDests] = useState(undefined);
  const [id] = useState(trip._id);

  // State
  const [unvisitedDests, setUnvisitedDests] = useState(false);
  let unvisitedCount = 0;
  let visitedCount = 0;
  if (totalDests !== undefined) {
    unvisitedCount = totalDests - numComplete;
    visitedCount = numComplete;
  }

  // Deletion
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [destDeletionModal, setDestDeletionModal] = useState(null);

  // Saving
  const [unsavedState, setUnsavedState] = useState(trip);
  const [savingName, setSavingName] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  const saveDelay = 500;

  // Validation
  const { onChange, onBlur, validity, setError } = useForm({
    title: name,
  });

  // Load the trip and its destinations
  useEffect(() => {
    if (destinations) {
      // Load data that was passed down
      setDests(destinations);
      setTotalDests(destinations.length);
      setNumComplete(
        destinations.filter((dest) => dest.visited === true).length
      );
    } else {
      // Fetch data (none was passed down)
      backendFetch
        .get("/getDestinations/" + id)
        .then((res) => {
          setDests(res.data);
          setTotalDests(res.data.length);
          setNumComplete(
            res.data.filter((dest) => dest.visited === true).length
          );
        })
        .catch((e) => {
          console.log("ERROR:");
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save any changes (if any are present)
  const saveChanges = () => {
    console.log("Saving changes...");
    let updateInfo = {};

    // Determine which variables have been updated
    if (desc !== unsavedState.desc) {
      updateInfo.desc = desc;
    } else {
      setSavingDesc(false);
    }

    // Send the title if it's got no errors and is changed
    if (validity.title.error) {
      setSavingName(false);
    } else if (name !== unsavedState.name && name.trim() !== "") {
      updateInfo.name = name;

      // Rename destinations to use the new trip name locally
      setDests(
        dests.map((dest) => {
          let newDest = dest;
          newDest.trip = name;
          return newDest;
        })
      );
    } else {
      setSavingName(false);
    }

    // Mark the sent off variables as saved
    let newState = unsavedState;
    for (const key in updateInfo) {
      newState[key] = updateInfo[key];
    }
    setUnsavedState(newState);

    // Update the changed variables in the backend
    if (Object.keys(updateInfo).length !== 0) {
      console.log(updateInfo);
      backendFetch
        .post("/updateTrip/" + id, updateInfo, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          setSavingName(false);
          setSavingDesc(false);
        })
        .catch((e) => {
          setSavingName(false);
          setSavingDesc(false);
        });
    }
  };

  // Remove the destination from the list
  const removeDest = (dest) => {
    console.log(dests);
    console.log(dest);
    console.log(totalDests);
    console.log(numComplete);
    setDests(dests.filter((item) => item._id !== dest._id));
    setTotalDests(totalDests - 1);
    console.log("Total dests: " + (totalDests - 1));
    console.log(dests.filter((item) => item._id !== dest._id));
    if (dest.visited) {
      console.log("Visited");
      setNumComplete(numComplete - 1);
    }
  };

  const onDestDeletionModalConfirmation = () => {
    setDestDeletionModal(null);
    setDeleting(true);
    removeDest(destDeletionModal);
    backendFetch
      .post("/deleteDestination/" + destDeletionModal._id)
      .then(() => {
        setDeleting(false);
      });
  };
  const onDestDeletionModalCancel = () => {
    setDestDeletionModal(null);
  };

  // Save changes {saveDelay} milliseconds after any changes
  useEffect(() => {
    const res = setTimeout(saveChanges, saveDelay);
    return () => clearTimeout(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, name]);

  // Delete the trip
  const deleteTrip = (deleteDestinations) => {
    const jsonData = {
      name: trip.name,
      deleteDestinations: deleteDestinations,
    };

    setDeletePopup(false);
    setDeleting(true);

    backendFetch.post("/deleteTrip/" + id, jsonData).then(() => {
      setDeleting(false);
      navigate("/trips");
    });
  };

  return (
    <>
      {destDeletionModal && (
        <DeletionModal
          itemName={destDeletionModal.name}
          onDeletionModalConfirmation={onDestDeletionModalConfirmation}
          onDeletionModalCancel={onDestDeletionModalCancel}
        />
      )}
      {deleting && <DeletingPopup />}
      {deletePopup && (
        <>
          <Popup
            disablePopup={() => {
              setDeletePopup(false);
            }}
          >
            <div className="trip__delete--container">
              <Card className="trip__delete">
                <Spacer>
                  <div>
                    <p className="trip__delete__text--body">
                      Are you sure you want to delete{" "}
                    </p>
                    <p className="trip__delete__text--highlight">{trip.name}</p>
                    <p className="trip__delete__text--body">?</p>
                  </div>

                  <div className="trip__delete__buttons">
                    <GenericButton
                      onClick={() => deleteTrip(false)}
                      className="trip__delete__buttons--delete-trip generic-button--warning"
                    >
                      Delete Trip Only
                    </GenericButton>
                    <GenericButton
                      onClick={() => deleteTrip(true)}
                      className="trip__delete__buttons--delete-all generic-button--warning"
                    >
                      Delete Trip + Destinations
                    </GenericButton>
                    <GenericButton
                      className="trip__delete__buttons--cancel"
                      onClick={() => setDeletePopup(false)}
                    >
                      Cancel
                    </GenericButton>
                  </div>
                </Spacer>
              </Card>
            </div>
          </Popup>
        </>
      )}{" "}
      <br />
      <Spacer className="trip__spacer">
        <Card>
          <Spacer>
            {/* Trip Name */}
            <div className="trip__name--container">
              <TextAreaAutosize
                defaultValue={name}
                className="trip__name trip__text--header"
                type="text"
                name="title"
                onChange={(e) => {
                  setName(e.target.value.trim());

                  // Check if this name is taken
                  let newName = e.target.value.trim().toLowerCase();
                  const matchingName = tripNames.filter(
                    (currentName) =>
                      currentName.toLowerCase() === newName.toLowerCase()
                  );
                  if (matchingName.length !== 0) {
                    setError("title", "This name is already taken");
                    setSavingName(false);
                  } else {
                    // Check the name is non-empty
                    if (e.target.value.trim() === "") {
                      setSavingName(false);
                    } else {
                      setSavingName(true);
                    }
                    onChange(e);
                  }
                }}
                onBlur={(e) => onBlur(e)}
              />
              {savingName && <p className="trip__saving-text">Saving...</p>}
              {validity.title.errorMsg && (
                <div className="generic-input__error">
                  {validity.title.errorMsg}
                </div>
              )}
            </div>

            {/* Completion Progress */}
            {numComplete !== undefined ? (
              <>
                {totalDests === 0 ? (
                  <h3 className="trip__text--subheader">No Destinations Yet</h3>
                ) : (
                  <>
                    {numComplete === totalDests ? (
                      <>
                        <h3 className="trip__text--subheader">
                          All Destinations Completed
                        </h3>
                      </>
                    ) : (
                      <h3 className="trip__text--subheader">
                        {numComplete} / {totalDests} Completed
                      </h3>
                    )}
                  </>
                )}
              </>
            ) : (
              <h3 className="trip__text--subheader">? / ? Completed</h3>
            )}

            {/* Description */}
            <div>
              <GenericInputParagraph
                className="trip__desc trip__text--body"
                title="Description"
                defaultValue={desc}
                onChange={(e) => {
                  setDesc(e.target.value.trim());
                  setSavingDesc(true);
                }}
              />
              {savingDesc && <p className="trip__saving-text">Saving...</p>}
            </div>

            <br />
            <br />

            {/* Visited Toggle */}
            <WideToggle
              state={unvisitedDests}
              setState={setUnvisitedDests}
              stateNames={{
                enabled: "Planned (" + unvisitedCount + ")",
                disabled: "Visited (" + visitedCount + ")",
              }}
            />

            {/* Delete / Add Destination Buttons */}
            <div className="trip__buttons">
              <div className="trip__buttons--holder">
                <GenericButton
                  onClick={() => setDeletePopup(true)}
                  className="trip__button__delete "
                >
                  Delete Trip
                </GenericButton>
              </div>
              <div className="trip__buttons--holder">
                <GenericButton
                  className="trip__button__add-destination"
                  onClick={() => {
                    navigate({
                      pathname: "/add_destination",
                      search: `?${createSearchParams({
                        trip: name,
                      })}`,
                    });
                  }}
                >
                  {totalDests === 0
                    ? "Add Your First Destination"
                    : "New Destination"}
                </GenericButton>
              </div>
            </div>

            {/* Draw destinations */}
            {dests ? (
              <ItemCardList
                items={dests.filter((dest) => dest.visited === unvisitedDests)}
                onDeletionIconClick={setDestDeletionModal}
                from={id}
              />
            ) : (
              <>
                <ItemCardLoading />
                <ItemCardLoading />
                <ItemCardLoading />
              </>
            )}
          </Spacer>
        </Card>
        <GenericButton
          onClick={() => navigate("/trips")}
          className="trip__button__home"
        >
          Back to Trips
        </GenericButton>
      </Spacer>
    </>
  );
}

function TripPage() {
  const navigate = useNavigate();
  const { tripID } = useParams();
  const [loading, setLoading] = useState(true);
  const [tripNames, setTripNames] = useState(null);
  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState(null);

  // Fetch the trip if we didn't receive it from navigation
  useEffect(() => {
    backendFetch
      .get("/getTrip/" + tripID)
      .then((res) => {
        setTrip(res.data.trip);
        setDestinations(res.data.destinations);
        setTripNames(
          res.data.tripNames.filter(
            (name) => name.toLowerCase() !== res.data.trip.name.toLowerCase()
          )
        );
        setLoading(false);
      })
      .catch(() => {
        navigate("/access_denied", { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && !trip) {
      navigate("/access_denied", { replace: true });
    }
  }, [loading, trip, navigate]);

  if (loading) {
    document.title = "Bucket List - Loading...";
  } else {
    document.title = "Bucket List - " + trip.name;
  }

  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          {loading ? (
            <TripLoading />
          ) : (
            <Trip
              trip={trip}
              destinations={destinations}
              tripNames={tripNames}
            />
          )}
        </PageContent>
      </Footer>
    </>
  );
}

export default TripPage;
