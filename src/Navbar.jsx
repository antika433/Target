import { Link, useLocation } from "react-router-dom";
import "./App.css"; // Assuming navbar styles are in App.css

const Navbar = () => {
  const location = useLocation(); // detects current URL path

  return (
    <div className="Nav">
      <div className="logo">TALENTFLOW</div>

      <div className="left_side_of_nav">
        <div className="jobscandidatelist">
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-item active" : "nav-item"}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className={location.pathname === "/jobs" ? "nav-item active" : "nav-item"}
          >
            Jobs
          </Link>
          <Link
            to="/candidates"
            className={location.pathname === "/candidates" ? "nav-item active" : "nav-item"}
          >
            Candidates
          </Link>
        </div>
        <div className="candidateicon"></div>
      </div>
    </div>
  );
};

export default Navbar;
