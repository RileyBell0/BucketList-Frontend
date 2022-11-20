import "../styles/tripCard.css";
import Card from "./Card";
import { ReactComponent as Edit } from "../images/edit.svg";
import { useNavigate } from "react-router-dom";

function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <>
      <Card
        className={"trip-card trip-card--enabled"}
        onClick={() =>
          navigate("/trips/" + trip._id, { state: { trip: trip } })
        }
      >
        <div className="trip-card__content">
          <div className="trip-card__text">
            <h3 className="trip-card__text--name">{trip.name}</h3>
            <p className="trip-card__text--desc">{trip.desc}</p>
          </div>

          <div className="trip-card__buttons">
            <button className="trip-card__buttons__button">
              <Edit className="trip-card__buttons__button--edit" />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

function TripCardList({ trips }) {
  return (
    <>
      {trips && trips.length !== 0 && (
        <>
          <div className="trip-card__list">
            {trips.map((trip) => (
              <TripCard trip={trip} key={trip._id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export { TripCardList, TripCard };
