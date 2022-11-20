import "../styles/addTrip.css";
import React, { useState } from "react";
import {
  GenericButton,
  GenericInput,
  GenericInputParagraph,
} from "../components/GenericComponents.js";
import Navbar from "../components/Navbar";
import { Spacer } from "../components/Spacer";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import Card from "../components/Card.js";
import LoadingIcon from "../components/LoadingIcon";
import backendFetch from "../axios/backendFetch";
import Globals from "../Globals.js";
import { useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function AddTrip() {
  const [tripName, setTripName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const addNewTrip = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      backendFetch
        .post("/newTrip", { name: tripName, desc: description })
        .then((res) => {
          if (res.response && res.response.data) {
            if (res.response.data.message) {
              setErrorMessage(res.response.data.message);
            } else if (res.response.data.error) {
              setErrorMessage(res.response.data.error);
            }
          } else if (res.status === Globals.statusCodes.OK) {
            const id = res.data.id;

            navigate("/trips/" + id);
          } else {
            setErrorMessage("Error: an unknown error occured");
          }
          setIsLoading(false);
        });
    } catch (e) {
      setErrorMessage("Error: Internal server error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={addNewTrip}>
        <Spacer>
          <h1>Add New Trip</h1>
          <Card className="formContent">
            <div>
              <GenericInput
                title="Trip Name"
                placeholder="Enter Name Here"
                onChange={(e) => {
                  setTripName(e.target.value);
                }}
              />
            </div>
            <div>
              <GenericInputParagraph
                title={"Description"}
                defaultValue={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <br />
            <br />
            <div>
              {isLoading && <LoadingIcon />}
              {isLoading === false && (
                <GenericButton
                  className="add-trip__button--submit"
                  onClick={addNewTrip}
                >
                  Save
                </GenericButton>
              )}
            </div>
            {errorMessage !== "" && <p>{errorMessage}</p>}
          </Card>
          <br />
          <Link to="/trips">
            <GenericButton className="add-trip__back-button">
              Back to Trips
            </GenericButton>
          </Link>
        </Spacer>
      </form>
    </>
  );
}

function AddTagPage() {
  document.title = "Bucket List - Add Trip";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <AddTrip />
        </PageContent>
      </Footer>
    </>
  );
}

export default AddTagPage;
