import { useEffect, useState } from "react";
import "./MyTransactions.css";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";

const MyTransactions = () => {
  const [accountsArray, setAccountsArray] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [currenttransactionArray, setCurrenttransactionArray] = useState([]);
  // const [selectedAccountBalance, setSelectedAccountBalance] = useState();
  const token = localStorage.getItem("token");

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

  const myTransactions = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5001/transaction/mytransactions/${selectedAccount}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCurrenttransactionArray(response.data.allTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="mytransactions-page">
      <div className="mytransactions-header">Fetch Your Transactions</div>
      <div className="payment-form-container">
        <form action="" className="payment-form" onSubmit={myTransactions}>
          <label htmlFor="selectAccount" className="payment-label">
            Select Account:
          </label>
          &nbsp;
          <select
            name="senderAccountNumber"
            className="payement-select"
            onChange={(e) => {
              setSelectedAccount(e.target.value);
            }}
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
          <div className="pay-btn-container">
            <button type="submit" className="payment-btn">
              Fetch
            </button>
          </div>
        </form>
      </div>
      <div className="mytransactions-box">
        <div className="mytransaction-title">My Transactions </div>
        {currenttransactionArray.length === 0 ? (
          <div className="empty-mytransactions">No transactions yet!!!</div>
        ) : (
          <div className="mytransctions-container">
            {currenttransactionArray?.map?.((item, index) => (
              <div className="mytransaction-tile" key={index}>
                <div className="mytransaction-sender-details">
                  <div className="sender-accountnumber">
                    {item.senderAccountNumber}
                  </div>
                  <div className="mytransaction-sender-name">
                    {item.senderName}
                  </div>
                </div>
                <div className="mytransaction-arrow">
                  <FaArrowRight />
                </div>
                <div className="mytransaction-reciever-details">
                  <div className="reciever-accountnumber">
                    {item.recieverAccountNumber}
                  </div>
                <div className="mytransaction-reciever-name">
                  {item.recieverName}
                </div>
                </div>
                <div className="mytransaction-colon">:</div>
                <div
                  className={`mytransaction-transaction-amount ${
                    item.recieverAccountNumber == selectedAccount
                      ? "font-green"
                      : "font-red"
                  }
                  `}
                >
                  {item.transactionAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTransactions;
