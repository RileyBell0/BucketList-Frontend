import React from "react";
import "../styles/GenericComponents.css";
import { ReactComponent as Placeholder } from "../images/picture-icon.svg";
import { useState } from "react";
import Card from "../components/Card";
import { ReactComponent as ToggleOn } from "../images/toggle-on.svg";
import { ReactComponent as ToggleOff } from "../images/toggle-off.svg";
import { useDropzone } from "react-dropzone";
import TextAreaAutosize from "react-textarea-autosize";
import LoadingIcon from "../components/LoadingIcon";

function GenericInput(props) {
  return (
    <div className="generic-input">
      {/* Only draw a title if provided with one */}
      {props.title != null && (
        <p className="generic-field__name">{props.title}</p>
      )}

      <input
        className={
          "generic-input__input" +
          (props.error ? " generic-input__input--error" : "")
        }
        type={props.type}
        defaultValue={props.defaultValue}
        name={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        placeholder={props.placeholder}
        value={props.value}
        ref={props.reference}
      />
      {props.error && <div className="generic-input__error">{props.error}</div>}
    </div>
  );
}

function GenericDropdown({ title, options, onChange, defaultOption, value }) {
  const options_rendered = options.map((option) => (
    <option key={option}>{option}</option>
  ));

  return (
    <>
      <div>
        {/* Only draw a title if provided with one */}
        {title != null && <p className="generic-field__name">{title}</p>}
        <div className="generic-drop-down__container">
          <select
            className="generic-drop-down"
            defaultValue={options[defaultOption]}
            onChange={onChange}
            value={value}
          >
            {options_rendered}
          </select>
        </div>
      </div>
    </>
  );
}

function GenericButton(props) {
  return (
    <div>
      <button
        className={"generic-button " + props.className}
        onClick={props.onClick}
        type={props.type}
        style={{ maxWidth: props.maxWidth }}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </div>
  );
}

function GenericInputParagraph(props) {
  return (
    <>
      {/* Only draw a title if provided with one */}
      {props.title != null && (
        <p className="generic-field__name">{props.title}</p>
      )}

      <TextAreaAutosize
        className={
          "generic-input-paragraph" +
          (props.error ? " generic-input__input--error" : "")
        }
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        type={props.type}
        name={props.name}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        value={props.value}
        ref={props.reference}
      />
      {props.error && <div className="generic-input__error">{props.error}</div>}
    </>
  );
}

function GenericParagraph({
  children,
  title,
  className,
  defaultValue,
  onClick,
}) {
  return (
    <>
      {/* Only draw a title if provided with one */}
      {title != null && <p className="generic-field__name">{title}</p>}
      <p
        className={
          "generic-paragraph__container generic-paragraph " + className
        }
        defaultValue={defaultValue}
        onClick={onClick ? onClick : () => {}}
      >
        {(children !== "" && children) ||
          /* Drawing a default value if no value was but a default value was */
          (children === "" && defaultValue !== undefined && defaultValue) ||
          (children === "" && defaultValue === undefined && " ")}
      </p>
    </>
  );
}

function GenericImageInput({
  image,
  prevImage,
  title,
  onChange,
  seamless,
  loading,
}) {
  const [showModal, setShowModal] = useState(false);
  const [errorType, setErrorType] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFile, fileRejections) => {
      if (fileRejections.length !== 0) {
        fileRejections.forEach((file) => {
          file.errors.forEach((error) => {
            setErrorDetail("Error: " + error.message);
            setShowModal(true);
          });
        });
      } else {
        CheckImage(acceptedFile, true);
      }
    },
  });

  const CheckImage = (inputFile, fromDragAndDrop) => {
    let file = inputFile[0];
    if (!fromDragAndDrop) {
      file = inputFile.target.files[0];
    }
    onChange(null);

    if (file.size > 5 * 1024 * 1024) {
      // e.target.value = "";
      setErrorType("Image is Too Big");
      setErrorDetail("Maximum file size is 5MB");
      setShowModal(true);
      return;
    }

    if (!file.type.match("image.*")) {
      // e.target.value = "";
      setErrorType("File is Invalid");
      setErrorDetail("Must be an Image");
      setShowModal(true);
      return;
    }

    if (file.size <= 5 * 1024 * 1024) {
      onChange(file);
    }
  };

  const RemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  const ImageModal = () => {
    return (
      <div className="transparent-layer">
        <div className="image-modal">
          <Card>
            <p>{errorType}</p>
            <p>{errorDetail}</p>
            <br />
            <GenericButton onClick={() => setShowModal(false)}>
              Okay
            </GenericButton>
          </Card>
        </div>
      </div>
    );
  };

  let imgClass = "generic-image-input__image-container__image";
  let overallClass = "generic-image-input";
  let containerClass = "generic-image-input__image-container";
  let removeImgIconClass = "generic-image-input__image-container__removeImage";
  let addImgIconClass = "generic-image-input__image-container__add-image";

  if (seamless === true) {
    imgClass =
      imgClass + " generic-image-input__image-container__image--seamless";
    overallClass = overallClass + " generic-image-input--seamless";
    containerClass =
      containerClass + " generic-image-input__image-container--seamless";
  }

  if (loading) {
    imgClass = imgClass + " generic-image-input__image--loading";
    overallClass = overallClass + " generic-image-input--loading";
  }

  return (
    <>
      {showModal ? <ImageModal /> : null}

      {/* Only draw a title if provided with one */}
      {title != null && <p className="generic-field__name">{title}</p>}

      {loading !== true && (
        <div
          {...getRootProps({
            className: overallClass,
          })}
        >
          <input {...getInputProps()} />
          {seamless !== true && <p>Click to Upload or Drag and Drop</p>}
          <div className={containerClass}>
            {image ? (
              //image that the user submits
              <>
                <button
                  className={removeImgIconClass}
                  type="button"
                  onClick={RemoveImage}
                >
                  X
                </button>
                <img
                  className={imgClass}
                  src={URL.createObjectURL(image)}
                  alt="user submitted"
                ></img>
              </>
            ) : prevImage ? (
              //imgur link if there is already a image submitted to the destination
              <>
                <button
                  className={removeImgIconClass}
                  type="button"
                  onClick={RemoveImage}
                >
                  X
                </button>
                <img
                  className={imgClass}
                  src={prevImage}
                  alt="placeholder"
                ></img>
              </>
            ) : (
              //placeholder image when user hasnt submitted an image and there wasn't an imgur link
              <>
                <button className={addImgIconClass} type="button">
                  +
                </button>
                <Placeholder className={imgClass}></Placeholder>
              </>
            )}
          </div>
          {seamless !== true && (
            <>
              <p className="generic-image-input__max-size">5 MB limit</p>
              <br />
            </>
          )}
        </div>
      )}
      {loading && (
        <>
          <div className={overallClass}>
            {seamless !== true && <p>Uploading Image...</p>}

            <div className={containerClass}>
              {image ? (
                //image that the user submits
                <>
                  <LoadingIcon className="generic-image-input__loading-icon" />
                  <img
                    className={imgClass}
                    src={URL.createObjectURL(image)}
                    alt="user submitted"
                  ></img>
                </>
              ) : prevImage ? (
                //imgur link if there is already a image submitted to the destination
                <>
                  <LoadingIcon className="generic-image-input__loading-icon" />
                  <img
                    className={imgClass}
                    src={prevImage}
                    alt="placeholder"
                  ></img>
                </>
              ) : (
                //placeholder image when user hasnt submitted an image and there wasn't an imgur link
                <>
                  <LoadingIcon className="generic-image-input__loading-icon" />
                  <Placeholder className={imgClass}></Placeholder>
                </>
              )}
            </div>
            {seamless !== true && (
              <p className="generic-image-input__max-size">Please Wait...</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

function GenericToggle({ state, onClick, className, title, disabled }) {
  if (className === undefined) {
    className = "";
  }

  return (
    <>
      {title != null && <p className="generic-field__name">{title}</p>}
      <div className="generic-toggle">
        <div className="generic-toggle__button-container">
          {state && (
            <ToggleOn
              className={
                disabled
                  ? "generic-toggle__button generic-toggle__button-disabled " +
                    className
                  : "generic-toggle__button generic-toggle__button-active " +
                    className
              }
              onClick={() => {
                if (disabled !== true) {
                  onClick();
                }
              }}
            />
          )}
          {!state && (
            <ToggleOff
              className={
                disabled
                  ? "generic-toggle__button generic-toggle__button-disabled " +
                    className
                  : "generic-toggle__button generic-toggle__button-active " +
                    className
              }
              onClick={() => {
                if (disabled !== true) {
                  onClick();
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export {
  GenericInput,
  GenericDropdown,
  GenericButton,
  GenericParagraph,
  GenericInputParagraph,
  GenericImageInput,
  GenericToggle,
};
