import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ItemCardList } from "../components/ItemCards";

const test_item = {
  name: "Item Name",
  city: "Item City",
  country: "Item Country",
  imgLink: "img.link",
  desc: "Item Desc",
};

const items_list = Array(5);

for (let i = 0; i < items_list.length; ++i) {
  items_list[i] = JSON.parse(JSON.stringify(test_item));
  items_list[i]._id = i;
}

it("Matches previous snapshot", () => {
  const comp = renderer.create(
    <BrowserRouter>
      <ItemCardList items={items_list} />
    </BrowserRouter>
  );
});
