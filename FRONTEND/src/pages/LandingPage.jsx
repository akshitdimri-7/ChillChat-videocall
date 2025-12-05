import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="landingPageContainer">
        <nav>
          <div className="navHeader">
            <h2 style={{ color: "#FFA500" }}>ChillChat</h2>
          </div>
          <div className="navList">
            <p
              onClick={() => {
                navigate("/guestEntry");
              }}
            >
              Join as <strong>Guest</strong>
            </p>
            <p onClick={() => navigate("/auth")}>Register</p>
            <div role="button" onClick={() => navigate("/auth")}>
              <p>Login</p>
            </div>
          </div>
        </nav>

        <div className="landingMainContainer">
          <div>
            <h1>
              <span style={{ color: "#FACC15" }}>Connect</span> with your{" "}
              <strong>Loved ones</strong>
            </h1>
            <p>
              Cover a mile by{" "}
              <strong>
                <span style={{ color: "#FACC15" }}> ChillChat</span>
              </strong>
              .
            </p>
            <div role="button">
              <Link to={"/auth"}>Get Started</Link>
            </div>
          </div>
          <div>
            <img className="mobileImage" src="/mobile.png" alt="mobile" />
          </div>
        </div>
      </div>
    </>
  );
}
