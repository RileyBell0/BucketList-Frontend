import "../styles/itemPopup.css";
import "../styles/ItemCards.css";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ReactComponent as Delete } from "../images/delete.svg";
import { ReactComponent as Edit } from "../images/edit.svg";
import { GenericButton, GenericParagraph } from "./GenericComponents";
import Popup from "./Popup";

function DestinationImage({ imgLink }) {
  return (
    <>
      {/* Draw the location's image next */}
      {imgLink ? (
        <>
          <br />
          <div className="item-popup__content_image-container">
            <img
              src={imgLink}
              alt="destination"
              className="item-popup__content__image"
            />
          </div>
        </>
      ) : (
        //image when there is no image in the backend
        <></>
      )}
    </>
  );
}

function ItemPopup({ item, disablePopup, onDeletionIconClick }) {
  const navigate = useNavigate();

  return (
    <>
      <Popup disablePopup={disablePopup}>
        <div className="item-popup__content">
          <Card className="item-popup__content__card">
            {/* Headings */}
            <h1 className="item-popup__content_name">{item.name}</h1>
            <h2>
              {item.city}
              {
                // If a city/country doesn't exist, the string is just whitespace
                String(item.city).replace(" ", "") !== "" &&
                String(item.country).replace(" ", "") !== ""
                  ? ", "
                  : ""
              }
              {item.country}
            </h2>
            <DestinationImage imgLink={item.imgLink} />

            {/* Description */}
            <h3>
              {item.type} - {item.trip ? item.trip : "None"}
            </h3>
            <GenericParagraph
              className="item-popup__content__description"
              defaultValue={"No description was provided"}
            >
              {item.desc}
            </GenericParagraph>

            {/* Buttons and Close */}
            <br />
            {/* Draw the buttons for editing this destination */}
            <div className="item-popup__icons">
              {/* Edit */}
              <div
                className="item-popup__icons__icon--container"
                onClick={() => {
                  navigate("/destinations/" + item._id);
                }}
              >
                <button className="item-popup__icons__icon">
                  <Edit className="item-popup__icons__icon--edit" />
                </button>
                <p className="item-popup__icons__icon--text">
                  Edit Destination
                </p>
              </div>

              {/* Delete */}
              <div
                className="item-popup__icons__icon--container"
                onClick={() => onDeletionIconClick(item)}
              >
                <button className="item-popup__icons__icon">
                  <Delete className="item-popup__icons__icon--delete" />
                </button>
                <p className="item-popup__icons__icon--text">Delete</p>
              </div>
            </div>

            {/* Close window */}
            <br />
            <GenericButton onClick={disablePopup}>Close</GenericButton>
          </Card>
        </div>
      </Popup>
    </>
  );
}

export { ItemPopup };
