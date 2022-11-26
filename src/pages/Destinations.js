import "../styles/destinations.css";
import "../styles/GenericComponents.css";
import "../styles/filters.css";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import globals from "../Globals";
import backendFetch from "../axios/backendFetch";
import { ThemeLoader } from "../themes/Themes";
import Navbar from "../components/Navbar";
import { ItemCardList } from "../components/ItemCards";
import { ItemCardLoading } from "../components/Templates";
import { ReactComponent as FiltersIcon } from "../images/filters.svg";
import PageContent from "../components/PageContent";
import { DeletionModal } from "../components/DeletionModal";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import WideToggle from "../components/WideToggle";
import {
  GenericButton,
  GenericDropdown,
  GenericInput,
  GenericParagraph,
} from "../components/GenericComponents";

function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visited, setVisited] = useState(false);
  const [filters, setFilters] = useState([]);
  const [deletionModal, setDeletionModal] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [focussedTrip, setFocussedTrip] = useState("All");
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingDests, setLoadingDests] = useState(true);

  // Filter Settings
  const [itemType, setItemType] = useState("Any");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [updatedFilters, setUpdatedFilters] = useState(false);
  const [continent, setContinent] = useState("Any");

  // Sort Settings
  const [sortType, setSortType] = useState(globals.sortOptionsDisplay[0]);
  const [sortDir, setSortDir] = useState("Descending");
  const [sort, setSort] = useState({ type: sortType, direction: sortDir });

  /*
   * Load in destinations data
   */
  useEffect(() => {
    // Load in filters from the URL
    let filters = [];
    const filterType = searchParams.get("type");
    if (filterType && globals.typeOptions.includes(filterType)) {
      setItemType(filterType);
      filters.push({ key: "type", value: filterType, strict: true });
    }
    const filterName = searchParams.get("name");
    if (filterName) {
      setName(filterName);
      filters.push({ key: "name", value: filterName, strict: false });
    }
    const filterCity = searchParams.get("city");
    if (filterCity) {
      setLocation(filterCity);
      filters.push({ key: "city", value: filterCity, strict: false });
    }
    const filterContinent = searchParams.get("continent");
    if (filterContinent && globals.typeOptions.includes(filterContinent)) {
      setContinent(filterContinent);
      filters.push({ key: "continent", value: filterContinent, strict: true });
    }
    const filterSort = searchParams.get("sortType");
    if (filterSort) {
      setSortType(filterSort);
    } else {
      setSortType(globals.sortOptionsDisplay[0]);
    }
    const filterSortDir = searchParams.get("sortDir");
    if (filterSortDir) {
      setSortDir(filterSortDir);
    } else {
      setSortDir("Descending");
    }
    setSort({ type: sortType, direction: sortDir });

    const filterVisited = searchParams.get("visited");
    if (filterVisited === "true") {
      setVisited(true);
    } else {
      setVisited(false);
    }
    setFilters(filters);

    backendFetch.get("/getDestinations").then((res) => {
      let items = res.data;
      items.forEach(
        (e) =>
          (e.compositeLocation = e.city + e.country + e.continent + e.location)
      );
      setItems(items);
      setLoadingDests(false);
    });
    backendFetch.get("/getTrips").then((res) => {
      setTrips(res.data.trips);
      setLoadingTrips(false);

      // Set the focussed trip IF the trip name exists
      const filterTrip = searchParams.get("trip");
      if (
        res.data.trips
          .map((trip) => trip.name)
          .concat(["All", "None"])
          .includes(filterTrip)
      ) {
        setFocussedTrip(filterTrip);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFiltersURL = () => {
    // Create a dict of all filters
    let params = { trip: focussedTrip };
    filters.forEach((item) => (params[item.key] = item.value));
    params["visited"] = visited;
    params["sortType"] = sortType;
    params["sortDir"] = sortDir;

    // Load into the filters
    setSearchParams(params, { replace: true });
    setUpdatedFilters(false);
  };

  // Update filters when these change
  useEffect(() => {
    updateFiltersURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focussedTrip, visited]);

  // Update filters in the search box when they change
  useEffect(() => {
    if (updatedFilters) {
      updateFiltersURL();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, updatedFilters]);

  /*
   * Returns the current list of locations. If visited = true -> all visited
   * locations, otherwise sends back unvisited locations
   */
  const getLocations = () => {
    return items.filter((location) => location.visited === visited);
  };

  const getFiltered = () => {
    // Filter by visited state
    let filteredVisited = getLocations();

    // Filter by Trip
    if (focussedTrip !== "All") {
      filteredVisited = filteredVisited.filter((location) => {
        let tripName = location.trip;
        if (!tripName) {
          tripName = "None";
        }
        return tripName.toLowerCase() === focussedTrip.toLowerCase();
      });
    }

    // Sort Items

    let sortedFilteredVisited = sortItems(
      filteredVisited,
      sort.type,
      sort.direction
    );

    // Apply filters
    return filterItems(sortedFilteredVisited, filters);
  };

  const getLocationCount = () => {
    const unvisitedCount = items.filter((e) => {
      return e.visited === false;
    }).length;
    const visitedCount = items.filter((e) => {
      return e.visited === true;
    }).length;

    return { unvisitedCount: unvisitedCount, visitedCount: visitedCount };
  };
  const { unvisitedCount, visitedCount } = getLocationCount();

  /*
   * Saves the provided item in the place of the item with the matching item id
   */
  const updateItem = (newItemState) => {
    setItems(
      items.map((item) => {
        if (item._id === newItemState._id) {
          return newItemState;
        } else {
          return item;
        }
      })
    );
  };

  /*
   * Removes the given item from "items" (note - just checks the attached item
   * ID)
   */
  const removeItem = (item) => {
    setItems(items.filter((location) => location._id !== item._id));
  };

  /*
   * Mark item as visited here, and in the backend
   */
  const onMarkVisitedClick = (item) => {
    item.visited = true;
    updateItem(item);

    backendFetch.post("updateDestination/" + item._id, {
      visited: true,
    });
  };

  /*
   * Mark item as unvisited here, and in the backend
   */
  const onMarkUnvisitedClick = (item) => {
    item.visited = false;
    updateItem(item);

    backendFetch.post("updateDestination/" + item._id, {
      visited: false,
    });
  };

  /*
   * On confirmation, remove the item from the items list, and request its
   * deletion from the database
   */
  const onDeletionModalConfirmation = () => {
    removeItem(deletionModal);

    onDeletionModalCancel();

    backendFetch.post("deleteDestination/" + deletionModal._id);
  };

  /*
   * Attach the given item to the deletion modal
   */
  const onDeletionIconClick = (item) => {
    setDeletionModal(item);
  };

  /*
   * Remove the attached item from the deletion modal
   */
  const onDeletionModalCancel = () => {
    setDeletionModal(null);
  };

  const FiltersToggle = () => {
    return (
      <button
        className="filters"
        onClick={() => {
          if (filtersOpen) {
            setFilters([]);
            setFiltersOpen(false);
          } else {
            setFiltersOpen(true);
          }
        }}
      >
        <FiltersIcon className="filters__icon"></FiltersIcon>
        <div className="filters__title">Filters:</div>
        <div className="filters__enabled">
          {filters.length === 0 && focussedTrip === "None"
            ? "None"
            : filters.length === 0
            ? "Trip"
            : "Enabled"}
        </div>
      </button>
    );
  };

  const FilterSettings = (props) => {
    if (!filtersOpen) {
      return <></>;
    }

    return (
      <>
        <div className={"filters-container"}>
          <GenericDropdown
            className="filters-option"
            value={itemType}
            title={"Type"}
            options={["Any"].concat(globals.typeOptions)}
            onChange={(e) => setItemType(e.target.value)}
          />
          <GenericInput
            className="filters-option"
            value={name}
            title={"Name contains"}
            onChange={(e) => setName(e.target.value)}
          />
          <GenericInput
            className="filters-option"
            value={location}
            title={"Location contains"}
            onChange={(e) => setLocation(e.target.value)}
          />
          {loadingTrips ? (
            <GenericParagraph
              title="Trip"
              className="destinations__trip-selector__dropdown filters-option"
            >
              Loading trips info...
            </GenericParagraph>
          ) : (
            <>
              {trips && trips.length !== 0 ? (
                <GenericDropdown
                  className="filters-option"
                  title="Trip"
                  options={["All", "None"].concat(
                    trips.map((location) => location.name)
                  )}
                  defaultOption={["All", "None"]
                    .concat(trips.map((trip) => trip.name))
                    .indexOf(focussedTrip)}
                  onChange={(e) => {
                    setFocussedTrip(e.target.value);
                  }}
                />
              ) : (
                <GenericParagraph title="Trip" className="filters-option">
                  No trips yet...
                </GenericParagraph>
              )}
            </>
          )}
          <GenericDropdown
            className="filters-option"
            title={"Sort By"}
            options={globals.sortOptionsDisplay}
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          />
          <GenericDropdown
            className="filters-option"
            title={"Sort Direction"}
            options={["Ascending", "Descending"]}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          />
          <GenericDropdown
            className="filters-option"
            title={"Continent"}
            options={["Any"].concat(globals.continentsList)}
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
          />
          {/*Filler div so that the above option isn't twice as wide as all the others*/}
        </div>
        <GenericButton
          onClick={() => {
            let f = [
              { key: "name", value: name, strict: false },
              {
                key: "compositeLocation",
                value: location,
                strict: false,
              },
            ];

            if (itemType !== "Any") {
              f = f.concat({
                key: "type",
                value: itemType,
                strict: true,
              });
            }
            if (continent !== "Any") {
              f = f.concat({
                key: "continent",
                value: continent,
                strict: true,
              });
            }

            let filters = [];
            for (let i in f) {
              const filter = f[i];
              if (filter.value !== "") {
                filters.push(f[i]);
              }
            }

            setUpdatedFilters(true);
            setFilters(filters);
            setSort({ type: sortType, direction: sortDir });
          }}
          className="filters__button--save"
        >
          Filter
        </GenericButton>
      </>
    );
  };

  return (
    <>
      {deletionModal && (
        <DeletionModal
          itemName={deletionModal.name}
          onDeletionModalCancel={onDeletionModalCancel}
          onDeletionModalConfirmation={onDeletionModalConfirmation}
        />
      )}

      <div className="destinations-content">
        <WideToggle
          state={visited}
          setState={setVisited}
          stateNames={{
            enabled: "Planned (" + unvisitedCount + ")",
            disabled: "Visited (" + visitedCount + ")",
          }}
        />

        <div className="destinations__trip-selector">
          <FiltersToggle />
          <Link to="/add_destination">
            <GenericButton>New Destination</GenericButton>
          </Link>
        </div>

        <br />
        <FilterSettings />

        {loadingDests ? (
          <>
            <div className="destinations__loading__item-card-list">
              <ItemCardLoading />
              <ItemCardLoading />
              <ItemCardLoading />
              <ItemCardLoading />
              <ItemCardLoading />
            </div>
          </>
        ) : (
          <ItemCardList
            items={getFiltered(visited)}
            onDeletionIconClick={onDeletionIconClick}
            onMarkVisitedClick={onMarkVisitedClick}
            onMarkUnvisitedClick={onMarkUnvisitedClick}
          />
        )}
      </div>
    </>
  );
}

/*
 * Apply user filters to the provided items
 */
function filterItems(items, filters) {
  for (const f of filters) {
    if (f.strict === true) {
      items = items.filter((x) => x[f.key] === f.value);
    } else {
      items = items.filter((x) =>
        x[f.key].toLowerCase().includes(f.value.toLowerCase())
      );
    }
  }

  return items;
}

function sortItems(items, sortBy, sortDir) {
  let keyIndex = globals.sortOptionsDisplay.indexOf(sortBy);
  if (keyIndex === -1) {
    return items;
  }
  let sortKey = globals.sortOptionsKey[keyIndex];

  items.sort((a, b) => {
    return a[sortKey].toLowerCase().localeCompare(b[sortKey].toLowerCase());
  });

  if (sortDir === "Descending") {
    items.reverse();
    return items;
  }
  return items;
}

function DestinationsPage() {
  document.title = "Bucket List - Destinations";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <Destinations />
        </PageContent>
      </Footer>
    </>
  );
}

export default DestinationsPage;
