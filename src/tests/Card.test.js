import renderer from "react-test-renderer";
import Card from "../components/Card";

it("Matches previous snapshot", () => {
  const component = renderer.create(<Card>Hello!</Card>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Applies classname correctly", () => {
  const comp = renderer.create(
    <Card className={"testing-class"}>Content</Card>
  );
  expect(comp.toJSON().props.className).toContain("testing-class");
});

it("Functions properly with no classname input", () => {
  const comp = renderer.create(<Card>Content</Card>);
  expect(comp.toJSON().props.className).toBe("card");
});
