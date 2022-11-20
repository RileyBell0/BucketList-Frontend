import "../styles/pageContent.css";

function PageContent({ children }) {
  return (
    <div className="scroll-content">
      <div className="page-content__body">
        <div>{children}</div>
      </div>
    </div>
  );
}

export default PageContent;
