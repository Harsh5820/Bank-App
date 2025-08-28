import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("id from navbar", user?._id)

  const handleLogOut = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn?.(!!token);
  }, [location, setIsLoggedIn]);

  return (
    <div className="navbar">
      <div className="navbar-profile">
        <button
          className="navbar-prf-btn"
          onMouseOver={() => setIsMenuOpen(true)}
        >
          <GiHamburgerMenu />
        </button>
      </div>

      <div className="navbar-title-container">
        <Link to="/" className="navbar-title">
          HD Bank
        </Link>
      </div>
      <Link to="/login" onClick={handleLogOut} className="btn-login">
        {isLoggedIn ? "Log Out" : "Log In"}
      </Link>

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
