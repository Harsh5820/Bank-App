import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogOut = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (user?.userRole === "Manager") {
      setIsManager(true);
    }
    const token = localStorage.getItem("token");
    setIsLoggedIn?.(!!token);
  }, [location, setIsLoggedIn]);

  return (
    <div className="navbar">
      <button
        className="navbar-prf-btn"
        onMouseOver={() => setIsMenuOpen(true)}
      >
        <GiHamburgerMenu />
      </button>

      <Link to="/" className="navbar-title">
        HD Bank
      </Link>
      <div>
        <Link className="navbar-rewards-btn" to="/reward">Rewards section</Link>

        <Link to="/login" onClick={handleLogOut} className="btn-login">
          {isLoggedIn ? "Log Out" : "Log In"}
        </Link>
      </div>

      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
          <IoMdClose />
        </button>

        <ul className="menu-list">
          <li>
            <Link
              to="/"
              className="list-item"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={`/myprofile/${user?._id}`}
              className="list-item"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              My Profile
            </Link>
          </li>
          {isManager ? (
            <li>
              <Link
                to={`/pendingapprovals`}
                className="list-item"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Pending Approvals
              </Link>
            </li>
          ) : (
            ""
          )}
          <li>
            <Link
              to="/myaccount"
              className="list-item"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              My Account
            </Link>
          </li>
          <li>
            <Link
              to="/mytransactions"
              className="list-item"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              My Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/mycards"
              className="list-item"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              My Cards
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="list-item"
              onClick={() => {
                handleLogOut();
                setIsMenuOpen(false);
              }}
            >
              {isLoggedIn ? "Log Out" : "Log In"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
