import React from "react";
import { ReactComponent as Edit } from "../images/edit.svg";
import { ReactComponent as Pin } from "../images/location_pin.svg";
import "../styles/ItemCards.css";
import { createSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import MediaQuery from "react-responsive";
import Globals from "../Globals";

function DestinationImageDesktop({ imgLink }) {
  return (
    <>
      {imgLink ? (
        //image from backend
        <div className="item-card__image--container">
          <img
            className="item-card__image"
            src={imgLink}
            alt="destination"
          ></img>
        </div>
      ) : null}
    </>
  );
}

function DestinationImageMobile({ imgLink }) {
  return (
    <>
      {imgLink ? (
        //image from backend
        <div className="item-card--mobile__image--container">
          <img
            className="item-card__image"
            src={imgLink}
            alt="destination"
          ></img>
        </div>
      ) : null}
    </>
  );
}

function ItemCard({ item, from, disabled }) {
  const navigate = useNavigate();

  let destSearchParams = {};
  if (from) {
    destSearchParams.from = from;
  }

  const generateDesktop = () => {
    return (
      <>
        <Card
          className={
            "item-card" + (disabled === true ? " item-card--disabled" : "")
          }
          onClick={
            disabled === true
              ? () => {}
              : () => {
                  navigate(
                    {
                      pathname: "/destinations/" + item._id,
                      search: `?${createSearchParams(destSearchParams)}`,
                    },
                    { state: { dest: item } }
                  );
                }
          }
        >
          <DestinationImageDesktop imgLink={item.imgLink} />
          <div className="item-card__content">
            <div className="item-card__content__header">
              <div className="item-card__content__header__text">
                <div className="item-card__content__header__text--name">
                  {item.name}
                </div>
                <div className="item-card__content__header__text--location">
                  {item.type}
                  {
                    // If a city/country doesn't exist, the string is just whitespace
                    (String(item.city).trim() !== "" ||
                      String(item.country).trim() !== "") &&
                    String(item.type).trim() !== ""
                      ? " | "
                      : ""
                  }
                  {item.city}
                  {
                    // If a city/country doesn't exist, the string is just whitespace
                    String(item.city).trim() !== "" &&
                    String(item.country).trim() !== ""
                      ? ", "
                      : ""
                  }
                  {item.country}
                </div>
              </div>
            </div>
            <div className="item-card__content__desc">
              {(item.desc !== "" && item.desc.replace("\n", "|")) ||
                (item.desc === "" && "No description was provided")}
            </div>
          </div>
        </Card>
      </>
    );
  };

  const generateMobile = () => {
    return (
      <>
        <Card
          className={
            disabled === true
              ? "item-card--mobile item-card--disabled"
              : "item-card--mobile"
          }
          onClick={
            disabled === true
              ? () => {}
              : () => {
                  navigate(
                    {
                      pathname: "/destinations/" + item._id,
                      search: `?${createSearchParams(destSearchParams)}`,
                    },
                    { state: { dest: item } }
                  );
                }
          }
        >
          <div className="item-card--mobile__header">
            <DestinationImageMobile imgLink={item.imgLink} />
            <div className="item-card--mobile__header__content">
              <div className="item-card--mobile__header__text">
                <div className="item-card--mobile__header__text__name">
                  {item.name}
                </div>

                <div className="item-card--mobile__header__text__location">
                  {item.type}
                  {
                    // If a city/country doesn't exist, the string is just whitespace
                    (String(item.city).trim() !== "" ||
                      String(item.country).trim() !== "") &&
                    String(item.type).trim() !== ""
                      ? " | "
                      : ""
                  }
                  {item.city}
                  {
                    // If a city/country doesn't exist, the string is just whitespace
                    String(item.city).trim() !== "" &&
                    String(item.country).trim() !== ""
                      ? ", "
                      : ""
                  }
                  {item.country}
                </div>
              </div>
              <div className="item-card--mobile__desc">
                {(item.desc !== "" && item.desc) ||
                  (item.desc === "" && "No description was provided")}
              </div>
            </div>
          </div>

          {/* {disabled === true ? (
            <></>
          ) : (
            <div className="item-card--mobile__icons">
              <div
                className="item-card__icons__icon--container item-card__icons__icon--container--mobile"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    pathname: "/map",
                    search: `?${createSearchParams({
                      lat: item.position[0].lat,
                      lng: item.position[0].lng,
                      zoom: 13,
                    })}`,
                  });
                }}
              >
                <button className="item-card__icons__icon--mobile">
                  <Pin className="item-card__icons__icon--map" />
                </button>
                <p className="item-card__icons__icon--text">View on Map</p>
              </div>
              <div className="item-card__icons__icon--container item-card__icons__icon--container--mobile">
                <button className="item-card__icons__icon--mobile">
                  <Edit className="item-card__icons__icon--edit" />
                </button>
                <p className="item-card__icons__icon--text">Edit</p>
              </div>
            </div>
          )} */}
        </Card>
      </>
    );
  };

  return (
    <>
      <MediaQuery minWidth={Globals.responsiveWidth + 1}>
        {generateDesktop()}
      </MediaQuery>
      <MediaQuery maxWidth={Globals.responsiveWidth}>
        {generateMobile()}
      </MediaQuery>
    </>
  );
}

function ItemCardList({ items, from, disabled }) {
  return (
    <div className="item-card-list">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} from={from} disabled={disabled} />
      ))}
    </div>
  );
}

export { ItemCardList, ItemCard };
