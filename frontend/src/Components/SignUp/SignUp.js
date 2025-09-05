import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [userData, setUserData] = useState([]);
  const [currentError, setCurrentError] = useState();
  const [formValid, setFormValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState(
    password === confirmPassword ? true : false
  );
  const Navigate = useNavigate();

  const handleOnchange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/user/signup",
        userData
      );
      Navigate("/");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Navigate("/login");
    } catch (error) {
      setCurrentError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  useEffect(() => {
    const {
      userName,
      userEmail,
      userPhoneNumber,
      userDob,
      userPassword,
      userConfirmPassword,
    } = userData;

    const allFieldsFilled =
      userName?.trim() &&
      userEmail?.trim() &&
      userPhoneNumber?.toString().trim() &&
      userDob?.trim() &&
      userPassword?.trim() &&
      userConfirmPassword?.trim();

    const passwordsMatch = userPassword === userConfirmPassword;

    setFormValid(allFieldsFilled && passwordsMatch);
    setMatchPassword(password !== "" && password === confirmPassword);
  }, [password, confirmPassword, userData]);

  return (
    <div className="signup-page">
      <div className="signup-header">Sign Up Here</div>
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSignUp}>
          <label htmlFor="userName" className="signup-label">
            Name:
          </label>
          <br />
          <input
            type="text"
            name="userName"
            id="userName"
            className="signup-input"
            onChange={handleOnchange}
          />
          <br />
          <label htmlFor="userEmail" className="signup-label">
            Email:
          </label>
          <br />
          <input
            type="text"
            name="userEmail"
            id="userEmail"
            className="signup-input"
            onChange={handleOnchange}
          />
          <br />
          <label htmlFor="userPhoneNumber" className="signup-label">
            Phone Number:
          </label>
          <br />
          <input
            type="number"
            name="userPhoneNumber"
            id="userPhoneNumber"
            className="signup-input"
            onChange={handleOnchange}
          />
          <br />
          <label htmlFor="userDob" className="signup-label">
            Date of Birth:
          </label>
          <br />
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            id="userDob"
            onChange={handleOnchange}
            className="signup-input"
            pattern="\d{2}/\d{2}/\d{4}"
            title="Enter date in DD/MM/YYYY format"
            name="userDob"
          />
          <br />
          <label htmlFor="userPassword" className="signup-label">
            Password:
          </label>
          <br />
          <input
            type="password"
            name="userPassword"
            id="userPassword"
            className="signup-input"
            onChange={(e) => {
              handleOnchange(e);
              setPassword(e.target.value);
            }}
          />
          <br />
          <label htmlFor="userPassword" className="signup-label">
            Confirm Password:
          </label>
          <br />
          <input
            type="password"
            name="userConfirmPassword"
            id="userConfirmPassword"
            className="signup-input"
            onChange={(e) => {
              handleOnchange(e);
              setConfirmPassword(e.target.value);
            }}
          />
          <span>{password && confirmPassword ?  (matchPassword ? "✅" : "❌") : ""}</span>
          <br />
          <div className="signup-btn-container">
            <button type="submit" className="signup-btn" disabled={!formValid}>
              Login
            </button>
          </div>
          <div className="signup-error">{currentError}</div>
        </form>
      </div>
      <div className="already-container">
        <Link to="/login" className="already-link">
          Already have an Account?
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
