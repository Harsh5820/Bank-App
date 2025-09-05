import axios from "axios";
import "./BeneficiaryPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BeneficiaryPage = () => {
  const token = localStorage.getItem("token");
  const [allbeneficiaries, setAllbeneficiaries] = useState([]);
  const [addBeneficiaryData, setAddBeneficiaryData] = useState([]);
  const [editBeneficiaryData, setEditBeneficiaryData] = useState([]);
  const [myBeneficiaryData, setMyBeneficiaryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [message, setMessage] = useState("");
  const [currentError, setCurrentError] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [accountsArray, setAccountsArray] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const Navigate = useNavigate();

  const fetchMyBeneficiaries = async () => {
    try {
      const resposne = await axios.get(
        "http://localhost:5001/beneficiary/mybeneficiaries",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAllbeneficiaries(resposne.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleAddOnChange = (e) => {
    setAddBeneficiaryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleEditOnChange = (e) => {
    setEditBeneficiaryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayOnChange = (e) => {
    setTransactionData((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const addBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/beneficiary/addbeneficiary",
        addBeneficiaryData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessage("Beneficiary Added successfully !!!");
      setShowModal(false);
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error) {
      setCurrentError(error?.response?.data?.error);
      setTimeout(() => {
        setCurrentError("");
      }, 1500);
    }
  };

  const handlePayBeneficiary = async (e) => {
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
      }, 1500);

      setTimeout(() => {
        Navigate("/beneficiarypage");
      }, 1500);
    } catch (error) {
      setCurrentError(error?.response?.data?.error);

      setTimeout(() => {
        setCurrentError("");
      }, 1500);
    }
  };

  const editBeneficiary = async (id, e) => {
    console.log("ashud");

    // e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5001/beneficiary/editbeneficiary/${id}`,
        editBeneficiaryData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessage("Changes Saved Successfully !!!");

      setEditModal(false);
      setTimeout(() => {
        setMessage("");
      }, 1500);
    } catch (error) {
      console.log(error);
      setCurrentError(error?.response?.data?.error);
      setTimeout(() => {
        setCurrentError("");
      }, 1500);
    }
  };

  const deletebeneficiary = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete beneficiary?"
      );
      if (!confirmDelete) {
        return;
      }

      await axios.delete(
        `http://localhost:5001/beneficiary/deletebeneficiary/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMessage("Beneficiary Deleted Successfully !!!");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyBeneficiary = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/beneficiary/mybeneficiary/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setEditBeneficiaryData(response.data);
      setMyBeneficiaryData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyBeneficiaries();
  }, [message]);

  return (
    <>
      <div className={`beneficiary-page  `}>
        <div className="benificiary-page-header">My Beneficiaries</div>
        <button
          className="add-beneficiary-btn"
          onClick={() => setShowModal(true)}
        >
          Add Beneficiary
        </button>
        {showModal && (
          <div className="add-beneficiary-modal-container df">
            <div className="add-beneficiary-modal">
              <button
                className="add-benefciary-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              <div className="add-beneficiary-form-conatainer ">
                <form
                  action=""
                  className="add-beneficiary-form"
                  onSubmit={addBeneficiary}
                >
                  <div className="add-beneficary-form-title">
                    Add Beneficiary
                  </div>
                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Nick Name (Optional):
                  </label>
                  <br />
                  <input
                    type="text"
                    name="beneficiaryNickName"
                    className="add-beneficiary-input"
                    onChange={handleAddOnChange}
                  />
                  <br />

                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Account Number:
                    <span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    name="beneficiaryAccountNumber"
                    className="add-beneficiary-input"
                    onChange={handleAddOnChange}
                  />
                  <br />

                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Transaction Limit:
                    <span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    name="beneficiaryTransactionLimit"
                    className="add-beneficiary-input"
                    onChange={handleAddOnChange}
                  />
                  <br />
                  <div className="signup-error">{currentError}</div>
                  <button type="submit" className="add-beneficiary-submit-btn">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="beneficiary-tile-container">
          {allbeneficiaries.length === 0 ? (
            <div className="empty-beneficiary df">
              No Beneficiaries available
            </div>
          ) : (
            allbeneficiaries?.map((item, index) => (
              <div className="beneficiary-tile" key={index}>
                <div className="beneficary-name">
                  {item.beneficiaryNickName
                    ? `${item.beneficiaryName} (${item.beneficiaryNickName})`
                    : item.beneficiaryName}
                </div>
                <div className="beneficiary-accountnumber">
                  {item.beneficiaryAccountNumber}
                </div>
                <div
                  className={`beneficiary-status ${
                    item.beneficiaryStatus !== "Approved"
                      ? "ben-red-btn"
                      : "ben-green-btn"
                  }`}
                >
                  {item.beneficiaryStatus}
                </div>
                <div className="beneficiary-btn-container">
                  <button
                    className="beneficiary-pay-btn"
                    disabled={item.beneficiaryStatus !== "Approved"}
                    onClick={() => {
                      setPayModal(true);
                      fetchMyBeneficiary(item._id);
                      fetchAccounts();
                      setTransactionData((prev) => ({
                        ...prev,
                        recieverAccountNumber: item.beneficiaryAccountNumber,
                      }));
                    }}
                  >
                    Pay
                  </button>
                  <button
                    className="beneficiary-edit-btn"
                    disabled={item.beneficiaryStatus !== "Approved"}
                    onClick={() => {
                      setEditModal(true);
                      fetchMyBeneficiary(item._id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="beneficiary-delete-btn"
                    disabled={item.beneficiaryStatus !== "Approved"}
                    onClick={() => deletebeneficiary(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {payModal && (
          <div className="add-beneficiary-modal-container df">
            {/* css for edit is the same as add modal */}
            <div className="add-beneficiary-modal">
              <button
                className="add-benefciary-close-btn"
                onClick={() => setPayModal(false)}
              >
                ✕
              </button>

              <div className="add-beneficiary-form-conatainer">
                <form
                  className="add-beneficiary-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="add-beneficary-form-title">
                    Pay Beneficiary
                  </div>
                  <label htmlFor="selectAccount" className="payment-label">
                    Pay from:<span className="mand-span">*</span>
                  </label>
                  <br />
                  <select
                    name="senderAccountNumber"
                    className="payement-select"
                    onChange={handlePayOnChange}
                  >
                    <option value="" defaultChecked>
                      Select
                    </option>
                    {accountsArray?.map((item, index) => (
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
                  <label
                    htmlFor="recieverAccountNumber"
                    className="payment-label"
                  >
                    Recievers Account Number:
                    <span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    className="payment-input"
                    name="recieverAccountNumber"
                    value={myBeneficiaryData?.beneficiaryAccountNumber}
                    onChange={handlePayOnChange}
                    readOnly
                  />
                  <br />
                  <label htmlFor="transactionAmount" className="payment-label">
                    Payment Amount:<span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    className="payment-input"
                    name="transactionAmount"
                    onChange={handlePayOnChange}
                  />
                  <br />

                  <button
                    type="button"
                    className="add-beneficiary-submit-btn"
                    onClick={handlePayBeneficiary}
                  >
                    Pay
                  </button>
                </form>
                <div className="signup-error">{currentError}</div>
              </div>
            </div>
          </div>
        )}
        {editModal && (
          <div className="add-beneficiary-modal-container df">
            {/* css for edit is the same as add modal */}
            <div className="add-beneficiary-modal">
              <button
                className="add-benefciary-close-btn"
                onClick={() => setEditModal(false)}
              >
                ✕
              </button>

              <div className="add-beneficiary-form-conatainer">
                <form
                  // action=""
                  className="add-beneficiary-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="add-beneficary-form-title">
                    Edit Beneficiary
                  </div>
                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Nick Name (Optional):
                  </label>
                  <br />
                  <input
                    type="text"
                    name="beneficiaryNickName"
                    className="add-beneficiary-input"
                    value={editBeneficiaryData?.beneficiaryNickName || ""}
                    onChange={handleEditOnChange}
                  />
                  <br />

                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Account Number:
                    <span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    name="beneficiaryAccountNumber"
                    className="add-beneficiary-input"
                    value={editBeneficiaryData?.beneficiaryAccountNumber}
                    onChange={handleEditOnChange}
                  />
                  <br />

                  <label htmlFor="" className="add-bebeficiary-label">
                    Beneficiary Transaction Limit:
                    <span className="mand-span">*</span>
                  </label>
                  <br />
                  <input
                    type="number"
                    name="beneficiaryTransactionLimit"
                    className="add-beneficiary-input"
                    value={editBeneficiaryData?.beneficiaryTransactionLimit}
                    onChange={handleEditOnChange}
                  />
                  <br />
                  <button
                    onClick={() => editBeneficiary(editBeneficiaryData._id)}
                    type="button"
                    className="add-beneficiary-submit-btn"
                  >
                    Save
                  </button>
                </form>
                <div className="signup-error">{currentError}</div>
              </div>
            </div>
          </div>
        )}
        {message && <div className="delete-success">{message}</div>}
        {/* css from MyAccount.js */}
        {successMessage && (
          <div className="delete-success">{successMessage}</div>
        )}
        {/* css from MyAccount.js */}
      </div>
    </>
  );
};

export default BeneficiaryPage;
