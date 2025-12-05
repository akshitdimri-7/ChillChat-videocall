import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";
import { useContext, useState } from "react";

import { Button, IconButton, TextField } from "@mui/material";
import {
  Restore as RestoreIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import "../App.css";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();

  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);

    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItem: "center" }}>
          <h1>ChillChat</h1>
        </div>

        <div style={{ display: "flex", alignItem: "center" }}>
          <IconButton onClick={e=>navigate("/history")} style={{ fontSize: "1.2rem" }}>
            <RestoreIcon />
            <p>History</p>
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={{ fontSize: "1.2rem" }}
          >
            <LogoutIcon />
            <p>Logout</p>
          </IconButton>
        </div>
      </div>
      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2 style={{ marginBottom: "1rem" }}>
              Providing Quality video call, connecting loved ones.
            </h2>
            <div style={{ display: "flex", alignItem: "center", gap: "10px" }}>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Meeting Code"
                variant="outlined"
              />
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
