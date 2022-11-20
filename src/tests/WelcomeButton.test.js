import renderer from "react-test-renderer";
import Welcome_Button from "../components/WelcomeButton";

it("Matches previous snapshot", () => {
  const comp = renderer.create(
    <Welcome_Button id={"test_id"} value={"test_value"} />
  );
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
