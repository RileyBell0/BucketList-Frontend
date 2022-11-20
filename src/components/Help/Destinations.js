import React, { useState } from "react";
import { ItemCardList } from "./ItemCards";
import { ItemCardLoading } from "../Templates";
import { ReactComponent as FiltersIcon } from "../../images/filters.svg";
import "../../styles/destinations.css";
import "../../styles/GenericComponents.css";
import "../../styles/filters.css";
import {
  GenericButton,
  GenericDropdown,
  GenericInput,
  GenericParagraph,
} from "../GenericComponents";
import { DeletionModal } from "../DeletionModal";
import globals from "../../Globals";
import WideToggle from "../WideToggle";
import { useHelp } from "./HelpContext";

function Destinations() {
  const { enabled, next, onNext, content, setContent } = useHelp();
  const [visited, setVisited] = useState(false);
  const [filters, setFilters] = useState([]);
  const [deletionModal, setDeletionModal] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [trips] = useState([]);
  const [focussedTrip, setFocussedTrip] = useState("All");
  const [loadingTrips] = useState(false);
  const [loadingDests] = useState(false);

  // Filter Settings
  const [itemType, setItemType] = useState("Any");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const getFiltered = (visitedState) => {
    // Filter by visited state
    let filteredVisited = content.filter(
      (location) => location.visited === visitedState
    );

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

    // Apply filters
    return filterItems(filteredVisited, filters);
  };

  const getLocationCount = () => {
    const unvisitedCount = getFiltered(false).length;
    const visitedCount = getFiltered(true).length;

    return { unvisitedCount: unvisitedCount, visitedCount: visitedCount };
  };
  const { unvisitedCount, visitedCount } = getLocationCount();

  /*
   * Saves the provided item in the place of the item with the matching item id
   */
  const updateItem = (newItemState) => {
    setContent(
      content.map((item) => {
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
    setContent(content.filter((location) => location._id !== item._id));
  };

  /*
   * Mark item as visited here, and in the backend
   */
  const onMarkVisitedClick = (item) => {
    item.visited = true;
    updateItem(item);
  };

  /*
   * Mark item as unvisited here, and in the backend
   */
  const onMarkUnvisitedClick = (item) => {
    item.visited = false;
    updateItem(item);
  };

  /*
   * On confirmation, remove the item from the items list, and request its
   * deletion from the database
   */
  const onDeletionModalConfirmation = () => {
    removeItem(deletionModal);

    onDeletionModalCancel();
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

  console.log(content);
  return (
    <>
      <div className="destinations-content">
        {deletionModal && (
          <DeletionModal
            itemName={deletionModal.name}
            onDeletionModalCancel={onDeletionModalCancel}
            onDeletionModalConfirmation={onDeletionModalConfirmation}
          />
        )}
        <WideToggle
          state={visited}
          setState={setVisited}
          stateNames={{
            enabled: "Planned (" + unvisitedCount + ")",
            disabled: "Visited (" + visitedCount + ")",
          }}
        />
        <div className="destinations__trip-selector">
          <button
            className="filters"
            onClick={() => {
              if (enabled.includes("filters")) {
                if (filtersOpen) {
                  setFilters([]);
                  setFiltersOpen(false);
                } else {
                  setFiltersOpen(true);
                }
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
          <div className="destinations__trip-selector__buttons">
            <GenericButton
              className={
                "destinations__trip-selector__buttons__newdest" +
                (next === "add" ? " emphasised" : "")
              }
              disabled={!enabled.includes("add")}
              onClick={
                next === "add"
                  ? () => onNext()
                  : () => {
                      console.log("no");
                    }
              }
            >
              New Destination
            </GenericButton>
          </div>
        </div>
        <br />
        {filtersOpen && (
          <FilterSettings
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            filters={filters}
            setFilters={setFilters}
            loadingData={loadingTrips}
            trips={trips}
            focussedTrip={focussedTrip}
            setFocussedTrip={setFocussedTrip}
            itemType={itemType}
            setItemType={setItemType}
            name={name}
            setName={setName}
            location={location}
            setLocation={setLocation}
          />
        )}
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
            items={content}
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

function FilterSettings(props) {
  return (
    <>
      <div className={"filters-container"}>
        <div className={"filters-option"}>
          <GenericDropdown
            value={props.itemType}
            title={"Type"}
            options={["Any"].concat(globals.typeOptions)}
            onChange={(e) => props.setItemType(e.target.value)}
          />
        </div>
        <div className={"filters-option"}>
          <GenericInput
            value={props.name}
            title={"Name contains"}
            onChange={(e) => props.setName(e.target.value)}
          />
        </div>
        <div className={"filters-option"}>
          <GenericInput
            value={props.location}
            title={"Location contains"}
            onChange={(e) => props.setLocation(e.target.value)}
          />
        </div>
        <div className="filters-option">
          {props.loadingData ? (
            <GenericParagraph
              title="Trip"
              className="destinations__trip-selector__dropdown"
            >
              Loading trips info...
            </GenericParagraph>
          ) : (
            <>
              {props.trips && props.trips.length !== 0 ? (
                <GenericDropdown
                  title="Trip"
                  options={["All", "None"].concat(
                    props.trips.map((location) => location.name)
                  )}
                  defaultOption={["All", "None"]
                    .concat(props.trips.map((trip) => trip.name))
                    .indexOf(props.focussedTrip)}
                  onChange={(e) => {
                    props.setFocussedTrip(e.target.value);
                  }}
                />
              ) : (
                <GenericParagraph title="Trip">
                  No trips yet...
                </GenericParagraph>
              )}
            </>
          )}
        </div>
      </div>
      <GenericButton
        onClick={() => {
          let f = [
            { key: "name", value: props.name, strict: false },
            { key: "city", value: props.location, strict: false },
          ];

          if (props.itemType !== "Any") {
            f = f.concat({ key: "type", value: props.itemType, strict: true });
          }

          let filters = [];
          for (let i in f) {
            const filter = f[i];
            if (filter.value !== "") {
              filters.push(f[i]);
            }
          }

          props.setUpdatedFilters(true);
          props.setFilters(filters);
        }}
        className="filters__button--save"
      >
        Filter
      </GenericButton>
    </>
  );
}

export default Destinations;
