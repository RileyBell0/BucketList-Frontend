import renderer from "react-test-renderer";
import { Spacer } from "../components/Spacer";

it("Matches previous snapshot", () => {
  const comp = renderer.create(<Spacer>This is where the card goes</Spacer>);
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
