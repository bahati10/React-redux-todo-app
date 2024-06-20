import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../../store/userSlice";
import { AppDispatch } from "../../store/store";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="navbar">
      <div className="logo-text">
        <Link to="/login">
          <span className="one">TASK</span>
          <span className="two">TODO</span>
        </Link>
      </div>
      {location.pathname === "/todo" && (
        <div className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
