import React, { useEffect, useState } from "react";
import "../styles/trips.css";
import Navbar from "../components/Navbar";
import backendFetch from "../axios/backendFetch";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import { TripCardList } from "../components/TripCard";
import { Link } from "react-router-dom";
import { GenericButton } from "../components/GenericComponents";
import { Spacer } from "../components/Spacer";
import Footer from "../components/Footer";
import { TripCardLoading } from "../components/Templates";

function Trips() {
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [trips, setTrips] = useState([]);

  /*
   * Load in destinations data
   */
  useEffect(() => {
    backendFetch.get("/getTrips").then((res) => {
      setTrips(res.data.trips);
      setLoadingTrips(false);
    });
  }, []);

  return (
    <>
      <Spacer>
        <h1>Trips</h1>
        <Link to="/addTrip">
          <GenericButton className="trips__header__buttons--button">
            New Trip
          </GenericButton>
        </Link>
        {loadingTrips ? (
          <>
            <div className="trips__loading__trip-card-list">
              <TripCardLoading />
              <TripCardLoading />
              <TripCardLoading />
              <TripCardLoading />
              <TripCardLoading />
            </div>
          </>
        ) : (
          <TripCardList trips={trips} />
        )}
      </Spacer>
    </>
  );
}

function TripsPage() {
  document.title = "Bucket List - Trips";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <Trips />
        </PageContent>
      </Footer>
    </>
  );
}

export default TripsPage;
