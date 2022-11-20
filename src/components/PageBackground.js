import "../styles/pageBackground.css";

// Draws the background image and color behind all other elements (z-index -998)
function PageBackground() {
  return (
    <>
      <div className="page-background__common page-background__color" />
      <div className="page-background__common page-background__image" />
    </>
  );
}

export default PageBackground;
