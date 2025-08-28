import { use, useState } from "react";
import "./CreateAccount.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [accountType, setAccountType] = useState("");
  const [currentError, setCurrentError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const Navigate = useNavigate();

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/account/createaccount",
        { accountType: accountType },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccessMessage("Account Created Successfully !!!");
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setTimeout(() => {
        Navigate("/");
      }, 1500);
    } catch (error) {
      setCurrentError(error.response.data.error);
    }
  };

  return (
    <div className="createaccount-page">
      <div className="createaccount-header">
        <div className="createaccount-title">Create Account</div>
      </div>
      <div className="createaccount-form-container">
        <form onSubmit={createAccount} className="createaccount-form">
          <label htmlFor="accountname" className="createaccount-label">
            Name:
          </label>
          <br />
          <input
            type="text"
            value={user.userName}
            className="createaccount-input"
            readOnly
          />
          <br />
          <label htmlFor="accountemail" className="createaccount-label">
            Email:
          </label>
          <br />
          <input
            type="text"
            value={user.userEmail}
            className="createaccount-input"
            readOnly
          />
          <br />
          <label htmlFor="accountemail" className="createaccount-label">
            Phone Number:
          </label>
          <br />
          <input
            type="Number"
            value={user.userPhoneNumber}
            className="createaccount-input"
            readOnly
          />
          <br />
          <label htmlFor="accounttype" className="createaccount-label">
            Account Type:
          </label>
          <br />
          <select
            name="accountType"
            id=""
            className="createaccount-select"
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="" className="createaccount-option" defaultChecked>
              Select
            </option>
            <option value="Savings" className="createaccount-option">
              Savings
            </option>
            <option value="Current" className="createaccount-option">
              Current
            </option>
          </select>
          <div className="createaccount-error-container">{currentError}</div>
          <div className="createaccount-btn-container">
            <button type="submit" className="createaccount-btn">
              Create Account
            </button>
          </div>
        </form>
      </div>
      {successMessage && <div className="delete-success">{successMessage}</div>}{" "}
      {/* css from MyAccount.js */}
    </div>
  );
};

export default CreateAccount;
