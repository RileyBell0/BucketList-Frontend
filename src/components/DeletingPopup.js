import "../styles/deletingPopup.css";
import LoadingIcon from "./LoadingIcon";
import Popup from "./Popup";
import Card from "./Card";

function DeletingPopup() {
  return (
    <Popup>
      <div className="deleting-popup">
        <Card className="deleting-popup--container">
          <h1 className="deleting-popup--text">Deleting...</h1>
          <LoadingIcon />
        </Card>
      </div>
    </Popup>
  );
}

export default DeletingPopup;
