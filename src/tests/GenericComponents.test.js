import renderer from "react-test-renderer";
import {
  GenericInput,
  GenericButton,
  GenericImageInput,
  GenericInputParagraph,
  GenericParagraph,
  GenericDropdown,
} from "../components/GenericComponents";

it("Matches previous GenericInput snapshot", () => {
  const comp = renderer.create(
    <GenericInput
      type={"text"}
      title={"Test Name"}
      placeholder={"Test Placeholder"}
    />
  );
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Matches previous GenericButton snapshot", () => {
  const comp = renderer.create(<GenericButton />);
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Matches previous GenericImageInput snapshot", () => {
  const comp = renderer.create(<GenericImageInput />);
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Matches previous GenericInputParagarph snapshot", () => {
  const tree = renderer
    .create(
      <GenericInputParagraph
        title="Test Title"
        defaultValue="Test Default Value"
      />,
      {
        createNodeMock: () => document.createElement("textarea"),
      }
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("Matches previous GenericParagraph snapshot", () => {
  const comp = renderer.create(
    <GenericParagraph title={"Test Title"}>
      This is a test paragraph
    </GenericParagraph>
  );
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Matches previous GenericDropdown snapshot", () => {
  const comp = renderer.create(
    <GenericDropdown title={"Test Title"} options={["option 1", "option 2"]} />
  );
  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
