import "../styles/wideToggle.css";

function WideToggle({ state, setState, stateNames }) {
  const { enabled, disabled } = stateNames;

  return (
    <div className="wide-toggle--container">
      <button
        className={
          "wide-toggle wide-toggle--left" +
          (state ? "" : " wide-toggle--active")
        }
        onClick={() => setState(false)}
      >
        {enabled}
      </button>
      <button
        className={
          "wide-toggle wide-toggle--right" +
          (state ? " wide-toggle--active" : "")
        }
        onClick={() => setState(true)}
      >
        {disabled}
      </button>
    </div>
  );
}

export default WideToggle;
