import axios from "axios";
import "./Pay.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Pay = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();
  const [currentError, setCurrentError] = useState("");
  const [accountsArray, setAccountsArray] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionData, setTransactionData] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/account/myaccounts",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAccountsArray(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (e) => {
    setTransactionData((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/transaction/newtransaction",
        transactionData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccessMessage("Payment Successful !!!");

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="pay-page">
      <div className="pay-header">Pay Here</div>
      <div className="payment-form-container">
        <form action="" className="payment-form" onSubmit={handlePay}>
          <label htmlFor="selectAccount" className="payment-label">
            Pay from:
          </label>
          <br />
          <select
            name="senderAccountNumber"
            className="payement-select"
            onChange={handleOnChange}
          >
            <option value="" defaultChecked>
              Select
            </option>
            {accountsArray.map((item, index) => (
              <option
                className="payement-option"
                key={index}
                value={item.accountNumber}
              >
                {item.accountNumber}-{item.accountType}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="recieverAccountNumber" className="payment-label">
            Recievers Account Number:
          </label>
          <br />
          <input
            type="number"
            className="payment-input"
            name="recieverAccountNumber"
            onChange={handleOnChange}
          />
          <br />
          <label htmlFor="transactionAmount" className="payment-label">
            Payment Amount:
          </label>
          <br />
          <input
            type="number"
            className="payment-input"
            name="transactionAmount"
            onChange={handleOnChange}
          />
          <br />
          <div className="pay-btn-container">
            <button type="submit" className="payment-btn">
              Pay
            </button>
          </div>
        </form>
        <div className="pay-error">{currentError}</div>
      </div>
      {successMessage && <div className="delete-success">{successMessage}</div>}{" "}
      {/* css from MyAccount.js */}
    </div>
  );
};

export default Pay;
