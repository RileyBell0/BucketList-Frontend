import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/auth";
import UnauthenticatedRoute from "./auth/UnauthenticatedRoute";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import FetchAuthHook from "./axios/fetchHook";
import AccessDenied from "./pages/AccessDenied";
import WelcomePage from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Destinations from "./pages/Destinations";
import AddDestination from "./pages/AddDestination";
import Destination from "./pages/Destination";
import Trips from "./pages/Trips";
import AddTrip from "./pages/AddTrip";
import Trip from "./pages/Trip";
import Map from "./pages/Map";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <FetchAuthHook />
        <Routes>
          <Route path="/" element={<WelcomePage />} />

          <Route element={<UnauthenticatedRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>

          <Route element={<AuthenticatedRoute />}>
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:tripID" element={<Trip />} />
            <Route path="/addTrip" element={<AddTrip />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route
              path="/destinations/:destination"
              element={<Destination />}
            />
            <Route path="/map" element={<Map />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add_destination" element={<AddDestination />} />
          </Route>

          <Route path="/access_denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
