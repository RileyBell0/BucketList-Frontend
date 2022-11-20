import "../styles/templates.css";
import "../styles/tripCard.css";
import Card from "./Card";
import Globals from "../Globals";
import MediaQuery from "react-responsive";
import { Spacer } from "./Spacer";

function DestinationLoading() {
  return (
    <>
      <br />
      <Spacer>
        <Card className="formContent">
          <Spacer>
            <div className="templates__header templates__destination__header" />

            <div className="templates__subheader templates__destination__subheader" />

            <div className="templates__destination__image" />

            <div className="formContent">
              <div className="templates__generic-input">
                <div className="templates__generic-input__title" />
                <div className="templates__generic-input__field" />
              </div>
              <div className="templates__generic-input">
                <div className="templates__generic-input__title" />
                <div className="templates__generic-input__field" />
              </div>
              <div className="templates__generic-input">
                <div className="templates__generic-input__title" />
                <div className="templates__generic-input__field" />
              </div>
            </div>

            <div className="templates__destination__icons">
              <div className="templates__destination__icons__icon--container templates__destination__icons__icon--container--map">
                <div className="templates__destination__icons__icon" />
                <div className="templates__destination__icons__icon--text" />
              </div>

              <div className="templates__destination__icons__icon--container templates__destination__icons__icon--container--delete">
                <div className="templates__destination__icons__icon" />
                <div className="templates__destination__icons__icon--text" />
              </div>
            </div>

            <div className="templates__destination__button--visited" />
          </Spacer>
        </Card>
        <br />
        <div className="templates__destination__button--home" />
      </Spacer>
    </>
  );
}

function TripCardLoading() {
  return (
    <>
      <Card className="trip-card">
        <div className="trip-card__content templates__trip-card__header">
          <div className="trip-card__text">
            <div className="templates__header" />
            <div className="templates__text-area">
              <div className="templates__paragraph" />
              <div className="templates__paragraph templates__last-line" />
            </div>
          </div>

          <div className="trip-card__buttons">
            <div className="templates__icon-button" />
          </div>
        </div>
      </Card>
    </>
  );
}

function ItemCardLoading() {
  const generateDesktop = () => {
    return (
      <Card className="templates__item-card">
        <div className="templates__item-card__image" />
        <div className="templates__item-card__content">
          <div className="templates__row--spaced">
            <div className="templates__header templates__item-card__title" />
            <div className="templates__header templates__item-card__location" />
            <div className="templates__item-card__buttons">
              <div className="templates__icon-button" />
              <div className="templates__icon-button" />
            </div>
          </div>

          <div className="templates__text-area">
            <div className="templates__paragraph" />
            <div className="templates__paragraph templates__last-line" />
          </div>
        </div>
      </Card>
    );
  };

  const generateMobile = () => {
    return (
      <Card className="templates__item-card templates__item-card--mobile">
        <div className="templates__row--spaced">
          <div className="templates__item-card__image--mobile" />
          <div className="templates__item-card--mobile__header__content">
            <div className="templates__center-vertical">
              <div className="templates__item-card__header" />
              <div className="templates__item-card__header templates__last-line" />
            </div>
            <div className="templates__text-area templates__item-card__desc">
              <div className="templates__item-card__header" />
              <div className="templates__paragraph templates__last-line" />
            </div>
          </div>
        </div>

        <div className="templates__item-card__buttons templates__item-card__buttons--mobile">
          <div className="templates__item-card__icon-button__container">
            <div className="templates__icon-button" />
            <div className="templates__icon-button__desc--map" />
          </div>
          <div className="templates__item-card__icon-button__container">
            <div className="templates__icon-button" />
            <div className="templates__icon-button__desc--delete" />
          </div>
        </div>
      </Card>
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

function TripLoading() {
  return (
    <>
      <br />
      <Spacer className="templates__trip__spacer">
        <Card>
          <Spacer>
            <div className="templates__header templates__trip__header" />

            <div className="templates__subheader templates__trip__completion" />

            <div className="templates__generic-input">
              <div className="templates__generic-input__title" />
              <div className="templates__generic-input__field" />
            </div>

            <br />
            <br />

            <div className="templates__wide-toggle" />

            <div className="templates__trip__buttons">
              <div className="templates__trip__delete-button" />
              <div className="templates__trip__add-dest-button" />
            </div>
            <Spacer className="templates__trip__item-list">
              <ItemCardLoading />
              <ItemCardLoading />
              <ItemCardLoading />
            </Spacer>
          </Spacer>
        </Card>
        <div className="templates__trip__home-button" />
      </Spacer>
    </>
  );
}

export { TripCardLoading, ItemCardLoading, DestinationLoading, TripLoading };
