import renderer from "react-test-renderer";
import App from "../App";
import React from "react";
import { BrowserRouter } from "react-router-dom";

it("Contains Bucket List Text", () => {
  const component = renderer.create(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
