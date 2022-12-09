import React, { useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Navbar from "../components/Navbar";
import Globals from "../Globals";
import "../styles/Map.css";
import backendFetch from "../axios/backendFetch";
import { useState } from "react";
import { isDarkTheme, ThemeLoader } from "../themes/Themes";
import { ItemPopup } from "../components/ItemPopup";
import { themes, darkThemes } from "../themes/ThemeIndex";
import { DeletionModal } from "../components/DeletionModal";
import PageBackground from "../components/PageBackground";
import { useSearchParams } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -24,
  lng: 134,
};

var mapStyle = [];

var visitedIcon = {};

var unvisitedIcon = {};

function Map(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [unvisitedLocations, setUnvisited] = useState([]);
  const [visitedLocations, setVisited] = useState([]);
  const [popupItem, setPopupItem] = useState(undefined);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [deletionModal, setDeletionModal] = useState(false);

  const positionSaveDelay = 100;

  const getMarkers = async () => {
    var locationsTemp = [];
    var unvisitedLocationsTemp = [];
    var visitedLocationsTemp = [];

    await backendFetch
      .get(Globals.apiRootUrl + "/getDestinations")
      .then(function (response) {
        response.data.map(async (item) => {
          // Only display valid markers
          let lat = item.position[0].lat;
          let lng = item.position[0].lng;
          if (lat && lng) {
            locationsTemp.push({
              position: {
                lat: item.position[0].lat,
                lng: item.position[0].lng,
              },
              item: item,
            });
          }
        });
      })
      .catch((err) => console.log(err));

    unvisitedLocationsTemp = await locationsTemp.filter(
      (location) => location.item.visited === false
    );
    visitedLocationsTemp = locationsTemp.filter(
      (location) => location.item.visited === true
    );

    setUnvisited(unvisitedLocationsTemp);
    setVisited(visitedLocationsTemp);

    locationsTemp = [];
    unvisitedLocationsTemp = [];
    visitedLocationsTemp = [];
  };

  const [libraries] = useState(["places"]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);

  // Will be toggled whenever the map has been updated
  const [mapUpdated, setMapUpdated] = useState(false);

  // Save the current position and zoom of the map in the URL
  const saveChanges = () => {
    if (map) {
      const newCenter = map.getCenter();
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      const zoom = map.getZoom();

      setSearchParams({ lat: lat, lng: lng, zoom: zoom }, { replace: true });
    }
  };

  useEffect(() => {
    const res = setTimeout(saveChanges, positionSaveDelay);
    return () => clearTimeout(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapUpdated]);

  const handleCenterChanged = () => {
    setMapUpdated(!mapUpdated);
  };

  const onLoad = React.useCallback(function callback(map) {
    var darkMode = isDarkTheme();
    var markerColor = {};
    if (darkMode) {
      mapStyle = Globals.nightMap;
      markerColor =
        darkThemes[localStorage.getItem("theme").toLowerCase()][
          "--map-marker-color"
        ];
    } else {
      mapStyle = [];
      markerColor =
        themes[localStorage.getItem("theme").toLowerCase()]["--color-primary"];
    }

    visitedIcon = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-.727 3.328t-1.758 3.516-2.039 3.07-1.711 2.273l-.75.797q-.281-.328-.75-.867t-1.688-2.156-2.133-3.141-1.664-3.445-.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "grey",
      fillOpacity: 1,
      strokeColor: "black",
      strokeWeight: 1.2,
      scale: 1.6,
      anchor: { x: 12, y: 20 },
    };

    unvisitedIcon = {
      path: "M12 12l3-2 0-3-3-2-3 2 0 3zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-.727 3.328t-1.758 3.516-2.039 3.07-1.711 2.273l-.75.797q-.281-.328-.75-.867t-1.688-2.156-2.133-3.141-1.664-3.445-.75-3.375q0-2.906 2.039-4.945t4.947-2.055z",
      fillColor: markerColor,
      fillOpacity: 1,
      strokeColor: "black",
      strokeWeight: 1.2,
      scale: 1.6,
      anchor: { x: 12, y: 20 },
    };

    getMarkers();
    setMap(map);

    // Center the map on the location provided
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const zoomStr = searchParams.get("zoom");

    // Arbitrary value of 13, just thought it was a nice zoom level
    let zoom = 13;
    if (zoomStr && !isNaN(Number(zoomStr))) {
      zoom = Number(zoomStr);
    }

    // If a position was provided, set to the position
    if (latStr && lngStr) {
      let lat = Number(latStr);
      let lng = Number(lngStr);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.setZoom(zoom);

        map.setCenter({
          lat: lat,
          lng: lng,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const enablePopup = async (item) => {
    console.log("Enabling popup for " + item._id);
    await setPopupItem(item);
    await setPopupEnabled(true);
  };

  const disablePopup = async () => {
    console.log("Disabling popup for " + popupItem._id);
    await setPopupEnabled(false);
  };

  /* Deletes the current destination from the backend and 
     removes it from the map */
  const onDeletionModalConfirmation = async () => {
    // Remove from the backend
    console.log("Deleting " + popupItem._id);
    backendFetch.post("/deleteDestination/" + popupItem._id);

    // Remove the marker
    if (popupItem.visited) {
      const locations = await visitedLocations.filter(
        (location) => location.item._id !== popupItem._id
      );
      await setVisited(locations);
    } else {
      const locations = await unvisitedLocations.filter(
        (location) => location.item._id !== popupItem._id
      );
      await setUnvisited(locations);
    }

    // Close the deletion modal and popup
    await setDeletionModal(false);
    await setPopupEnabled(false);
    setPopupItem(null);
  };

  return isLoaded ? (
    <>
      {/* Display a deletion confirmation box if requested */}
      {deletionModal && (
        <DeletionModal
          itemName={popupItem.name}
          onDeletionModalConfirmation={onDeletionModalConfirmation}
          onDeletionModalCancel={() => {
            setDeletionModal(false);
          }}
        />
      )}
      {/* Display a destination infomration popup when a marker is clicked */}
      {popupEnabled && (
        <ItemPopup
          item={popupItem}
          disablePopup={disablePopup}
          onDeletionIconClick={() => setDeletionModal(true)}
        />
      )}

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          onCenterChanged={handleCenterChanged}
          options={{
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
              },
            },
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,

            styles: mapStyle,
          }}
          zoom={2.8}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {unvisitedLocations.map(({ position, item }) => (
            <Marker
              icon={unvisitedIcon}
              position={position}
              item={item}
              key={item._id}
              onClick={() => enablePopup(item)}
            ></Marker>
          ))}
          {visitedLocations.map(({ position, item }) => (
            <Marker
              icon={visitedIcon}
              position={position}
              item={item}
              key={item._id}
              onClick={() => enablePopup(item)}
            ></Marker>
          ))}
        </GoogleMap>
      </div>
    </>
  ) : (
    <></>
  );
}

function MapPage() {
  document.title = "Bucket List - Map";
  return (
    <>
      <div className="map__page-bounds">
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <Map />
      </div>
    </>
  );
}

export default MapPage;
