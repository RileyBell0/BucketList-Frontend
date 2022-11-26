import "../styles/pageContent.css";

function PageContent({ children, className }) {
  return (
    <div className="scroll-content">
      <div
        className={"page-content__body" + (className ? " " + className : "")}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}

export default PageContent;
