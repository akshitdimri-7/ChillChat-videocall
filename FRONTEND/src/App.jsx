import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeetComponent";
import HomeComponent from "./pages/HomeComponent";
import HistoryComponent from "./pages/HistoryComponent";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/:url" element={<VideoMeetComponent />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/history" element={<HistoryComponent />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
