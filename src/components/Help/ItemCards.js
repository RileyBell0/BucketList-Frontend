import React from "react";
import { ReactComponent as Delete } from "../../images/delete.svg";
import { ReactComponent as Pin } from "../../images/location_pin.svg";
import "../../styles/ItemCards.css";
import Card from "../Card";
import MediaQuery from "react-responsive";
import Globals from "../../Globals";
import { useHelp } from "./HelpContext";

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

function ItemCard({ item, onDeletionIconClick, isExample }) {
  const { enabled, onNext, next, setContent } = useHelp();

  const generateDesktop = () => {
    return (
      <>
        <Card
          className={"item-card" + (next === "card" ? " emphasised" : "")}
          onClick={() => {
            if (enabled.includes("card") && next === "card") {
              setContent(item);
              onNext();
            }
          }}
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
                    String(item.city).trim() !== "" ||
                    String(item.country).trim() !== ""
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
              <div className="item-card__content__header--icons">
                {isExample !== true && (
                  <>
                    <button
                      onClick={(e) => {
                        if (enabled.includes("pin")) {
                          e.stopPropagation();
                          if (next === "pin") {
                            onNext();
                          }
                        }
                      }}
                      className="item-card__icons__icon"
                    >
                      <Pin className="item-card__icons__pin" />
                    </button>
                  </>
                )}
                <button
                  className="item-card__icons__icon"
                  onClick={(e) => {
                    if (enabled.includes("delete")) {
                      e.stopPropagation();
                      onDeletionIconClick();
                    }
                  }}
                >
                  <Delete className="item-card__icons__delete" />
                </button>
              </div>
            </div>
            <div className="item-card__content__desc">
              {(item.desc !== "" && item.desc) ||
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
          className="item-card--mobile"
          onClick={() => {
            if (enabled.includes("card") && next === "card") {
              setContent(item);
              onNext();
            }
          }}
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
                    String(item.city).trim() !== "" ||
                    String(item.country).trim() !== ""
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

          <div className="item-card--mobile__icons">
            <div
              className="item-card__icons__icon--container item-card__icons__icon--container--mobile"
              onClick={(e) => {
                if (enabled.includes("pin")) {
                  e.stopPropagation();
                  if (next === "pin") {
                    onNext();
                  }
                }
              }}
            >
              <button className="item-card__icons__icon--mobile">
                <Pin className="item-card__icons__icon--map" />
              </button>
              <p className="item-card__icons__icon--text">View on Map</p>
            </div>
            <div
              className="item-card__icons__icon--container item-card__icons__icon--container--mobile"
              onClick={(e) => {
                if (enabled.includes("delete")) {
                  e.stopPropagation();
                  onDeletionIconClick();
                }
              }}
            >
              <button className="item-card__icons__icon--mobile">
                <Delete className="item-card__icons__icon--delete" />
              </button>
              <p className="item-card__icons__icon--text">Delete</p>
            </div>
          </div>
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

function ItemCardList({ items, onDeletionIconClick, isExample }) {
  return (
    <div className="item-card-list">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onDeletionIconClick={onDeletionIconClick}
          isExample={isExample}
        />
      ))}
    </div>
  );
}

export { ItemCardList };
