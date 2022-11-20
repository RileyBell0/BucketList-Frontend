import renderer from "react-test-renderer";
import PageBackground from "../components/PageBackground";

it("Matches previous snapshot", () => {
  const comp = renderer.create(<PageBackground />);
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
