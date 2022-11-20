import renderer from "react-test-renderer";
import { DeletionModal } from "../components/DeletionModal";

it("Matches previous snapshot", () => {
  const comp = renderer.create(
    <DeletionModal
      itemName={"Destination"}
      onDeletionModalCancel={"None"}
      onDeletionModalConfirmation={"None"}
    />
  );

  let tree = comp.toJSON();
  expect(tree).toMatchSnapshot();
});
