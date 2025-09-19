import { useState } from "react";
import "./CreateAccount.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("");
  const [currentError, setCurrentError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createAccount = async (e) => {
    e.preventDefault();

    if (!accountType) {
      setCurrentError("Please select an account type.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/account/createaccount",
        { accountType },
        { headers: { Authorization: token } }
      );

      setSuccessMessage("Account created successfully!");
      setCurrentError("");

      // Navigate after a short delay to show success message
      setTimeout(() => navigate("/myaccount"), 1500);
    } catch (error) {
      setCurrentError(error?.response?.data?.error || "Failed to create account.");
      setTimeout(() => setCurrentError(""), 3000);
    }
  };

  return (
    <div className="createaccount-page">
      <div className="createaccount-header">
        <div className="createaccount-title">Create Account</div>
      </div>

      <div className="createaccount-form-container">
        <form onSubmit={createAccount} className="createaccount-form">
          <label className="createaccount-label">Name:</label><br/>
          <input type="text" value={user.userName || ""} className="createaccount-input" readOnly /><br/>

          <label className="createaccount-label">Email:</label><br/>
          <input type="text" value={user.userEmail || ""} className="createaccount-input" readOnly /><br/>

          <label className="createaccount-label">Phone Number:</label><br/>
          <input type="number" value={user.userPhoneNumber || ""} className="createaccount-input" readOnly /><br/>

          <label className="createaccount-label">Account Type:</label><br/>
          <select
            name="accountType"
            className="createaccount-select"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select><br/>

          <div className="createaccount-error-container">{currentError}</div>

          <div className="createaccount-btn-container">
            <button type="submit" className="createaccount-btn">
              Create Account
            </button>
          </div>
        </form>
      </div>

      {successMessage && <div className="delete-success">{successMessage}</div>}
    </div>
  );
};

export default CreateAccount;
