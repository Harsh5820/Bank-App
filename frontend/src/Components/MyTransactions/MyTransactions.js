import { useEffect, useState } from "react";
import "./MyTransactions.css";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";

const MyTransactions = () => {
  const [accountsArray, setAccountsArray] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [currenttransactionArray, setCurrenttransactionArray] = useState([]);
  const [transactionResponseData, setTransactionResposneData] = useState([]);
  const [currentError, setCurrentError] = useState("");
  const token = localStorage.getItem("token");
  const [filter, setFilter] = useState("allTransactions");
  const [sort, setSort] = useState("");

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
      setCurrentError(error?.response?.data?.error);

      setTimeout(() => {
        setCurrentError("");
      }, 1500);
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
      setCurrenttransactionArray(response?.data?.allTransactions);
      setTransactionResposneData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    // update transactions based on filter
    setCurrenttransactionArray(transactionResponseData[selectedFilter] || []);
  };

  const handleSort = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);

    let sortedArray = [...currenttransactionArray];

    if (selectedSort === "date-desc") {
      sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectedSort === "date-asc") {
      sortedArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (selectedSort === "amount-desc") {
      sortedArray.sort((a, b) => b.transactionAmount - a.transactionAmount);
    } else if (selectedSort === "amount-asc") {
      sortedArray.sort((a, b) => a.transactionAmount - b.transactionAmount);
    }

    setCurrenttransactionArray(sortedArray);
  };

  const handleClearAllFilter = () => {
    setFilter("allTransactions");
    setSort("");
    setCurrenttransactionArray(transactionResponseData.allTransactions || []);
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
          <div className="pay-error">{currentError}</div>
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
            <div className="mytransaction-filter">
              <div className="mytransaction-filter-select-container">
                <FaFilter />
                &nbsp;: &nbsp;
                <select
                  name=""
                  id="filter-select"
                  className="transaction-filter-select"
                  value={filter}
                  onChange={handleFilter}
                >
                  <option
                    value="allTransactions"
                    className="transaction-filter-option"
                    defaultChecked
                  >
                    All Transactions
                  </option>
                  <option
                    value="allTransactionsSent"
                    className="transaction-filter-option"
                  >
                    All Transactions Sent
                  </option>
                  <option
                    value="allTransactionsRecieved"
                    className="transaction-filter-option"
                  >
                    All Transactions Recieved
                  </option>
                </select>
                &nbsp; &nbsp;
                <div className="mytransaction-sort">
                  <select
                    name=""
                    id="sort-select"
                    className="transaction-filter-select"
                    value={sort}
                    onChange={handleSort}
                  >
                    <option value="">Sort</option>
                    <option value="date-desc">Date: Latest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="amount-desc">Amount: Largest First</option>
                    <option value="amount-asc">Amount: Smallest First</option>
                  </select>
                </div>
              </div>
              <button
                className="mytransaction-remove-all-filters"
                onClick={handleClearAllFilter}
              >
                Remove All Filters
              </button>
            </div>
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
