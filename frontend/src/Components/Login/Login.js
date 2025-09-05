import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [currentError, setCurrentError] = useState("");

  const handleOnchange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/user/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true);
      if (localStorage.getItem("token")) {
        navigate("/");
      }
    } catch (error) {
      // console.log(error.response.data.error);
      setCurrentError(error.response.data.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-header">Login to your account</div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="userEmail" className="login-form-label">
            Email:
          </label>
          <br />
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            className="login-input"
            onChange={handleOnchange}
          />
          <br />
          <label htmlFor="userPassword" className="login-form-label">
            Password:
          </label>
          <br />
          <input
            type="password"
            name="userPassword"
            id="userPassword"
            className="login-input"
            onChange={handleOnchange}
          />
          <br />
          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        <div className="login-error">{currentError}</div> 
        </form>
      </div>
      <div className="create-container">
        <Link to="/signup" className="create-link">New User? Create a  new Account</Link>
      </div>
    </div>
  );
};

export default Login;
