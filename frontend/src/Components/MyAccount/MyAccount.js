import { useEffect, useState } from "react";
import "./MyAccount.css";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const MyAccount = () => {
  const token = localStorage.getItem("token");
  const [accountsArray, setAccountsArray] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [minDelete, setMinDelete] = useState("");
  const [toggleBalanceDisplay, setToggleBalanceDisplay] = useState(false);

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

  const handleDeleteAccount = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this account?"
      );
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5001/account/deleteaccount/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      await fetchAccounts();
      setSuccessMessage("Account Deleted Successfully !!!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      // console.log("error from delete", error.response.data.error);
      setMinDelete(error.response.data.error);
        setTimeout(() => {
        setMinDelete("");
      }, 3000);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="myaccount">
      <div className="myaccount-header">My Accounts</div>

      <div className="myaccount-container">
        {accountsArray.length === 0 ? (
          <div className="myaccounts-empty">No account created yet</div>
        ) : (
          accountsArray?.map?.((item, index) => (
            <div className="myaccount-tile" key={index}>
              <div className="myaccount-info-container">
                <div className="myaccount-accountnumber">
                  {item.accountNumber}
                </div>
                <div className="myaccount-type">{item.accountType}</div>
                <div className="myaccount-balance">
                  Account Balance:
                  <span className="myaccount-balance-display">
                    {toggleBalanceDisplay ? item.accountBalance : ""}
                  </span>
                  <div className="balance-toggle-btn" onClick={()=> setToggleBalanceDisplay((prev)=>!prev)}>
                    {/* {toggleBalanceDisplay ? <FaEyeSlash /> : <FaEye />} */}
                    {toggleBalanceDisplay ? "Hide Balance" : "Show Balance"}
                  </div>
                </div>
              </div>
              <div className="myaccount-delete-btn-container">
                <button
                  className="myaccount-delete-btn"
                  onClick={() => handleDeleteAccount(item._id)}
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

        <Link to="/createaccount" className="create-account-link">Create Account</Link>

      {successMessage && <div className="delete-success">{successMessage}</div>}
      {minDelete && <div className="delete-fail">{minDelete}</div>}
    </div>
  );
};

export default MyAccount;
