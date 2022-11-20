import { GenericButton } from "./GenericComponents";
import Card from "./Card";
import "../styles/deletionModal.css";
import Popup from "./Popup";

function DeletionModal({
  itemName,
  onDeletionModalConfirmation,
  onDeletionModalCancel,
}) {
  return (
    <>
      <Popup disablePopup={onDeletionModalCancel} z_index={998}>
        <div className="deletion-modal__content">
          <Card className="deletion-modal">
            <div>
              <p className="deletion-modal__text">
                Are you sure you want to delete
              </p>
              <p className="deletion-modal__text--highlight"> {itemName}</p>
              <p className="deletion-modal__text">?</p>
            </div>
            <br />
            <div className="deletion-modal__buttons">
              <GenericButton onClick={onDeletionModalCancel}>
                Cancel
              </GenericButton>
              <GenericButton
                onClick={onDeletionModalConfirmation}
                className="generic-button--warning"
              >
                Delete
              </GenericButton>
            </div>
          </Card>
        </div>
      </Popup>
    </>
  );
}

export { DeletionModal };
