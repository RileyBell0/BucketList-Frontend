import renderer from "react-test-renderer";
import { ItemPopup } from "../components/ItemPopup";
import { BrowserRouter } from "react-router-dom";

const test_item = {
  name: "Item Name",
  city: "Item City",
  country: "Item Country",
  imgLink: "img.link",
  desc: "Item Desc",
  type: "Item Type",
};

it("Matches previous snapshot", () => {
  const comp = renderer.create(
    <BrowserRouter>
      <ItemPopup item={test_item} />
    </BrowserRouter>
  );
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Handles image correctly", () => {
  const comp = renderer.create(
    <BrowserRouter>
      <ItemPopup item={test_item} />
    </BrowserRouter>
  );
  expect(comp.root.findAllByType("img").length).toBe(1);
});

it("Handles no image correctly", () => {
  const test_item_no_image = test_item;
  delete test_item_no_image["imgLink"];
  const comp = renderer.create(
    <BrowserRouter>
      <ItemPopup item={test_item_no_image} />
    </BrowserRouter>
  );
  expect(comp.root.findAllByType("img").length).toBe(0);
});
