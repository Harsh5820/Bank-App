import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [userData, setUserData] = useState({ userEmail: "", userPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    try {
      const response = await axios.post("http://localhost:5001/user/login", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoggedIn(true);

      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data?.error || "Login failed. Try again.";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-header">Login to your account</div>

      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="userEmail" className="login-form-label">Email:</label><br/>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            className="login-input"
            value={userData.userEmail}
            onChange={handleChange}
            required
          /><br/>

          <label htmlFor="userPassword" className="login-form-label">Password:</label><br/>
          <input
            type="password"
            name="userPassword"
            id="userPassword"
            className="login-input"
            value={userData.userPassword}
            onChange={handleChange}
            required
          /><br/>

          <div className="login-btn-container">
            <button type="submit" className="login-btn">Login</button>
          </div>

          {errorMessage && <div className="login-error">{errorMessage}</div>}
        </form>
      </div>

      <div className="create-container">
        <Link to="/signup" className="create-link">
          New User? Create a new Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
