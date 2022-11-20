import renderer from "react-test-renderer";
import Navbar from "../components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth/auth";

it("Matches previous snapshot", () => {
  const comp = renderer.create(
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );
});
