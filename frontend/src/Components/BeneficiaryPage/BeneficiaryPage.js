import axios from "axios";
import "./BeneficiaryPage.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BeneficiaryPage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [allBeneficiaries, setAllBeneficiaries] = useState([]);
  const [addBeneficiaryData, setAddBeneficiaryData] = useState({});
  const [editBeneficiaryData, setEditBeneficiaryData] = useState({});
  const [myBeneficiaryData, setMyBeneficiaryData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [accountsArray, setAccountsArray] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [payModal, setPayModal] = useState(false);

  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentError, setCurrentError] = useState("");

  // Axios instance
  const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: { Authorization: token },
  });

  // Fetch all beneficiaries
  const fetchMyBeneficiaries = useCallback(async () => {
    try {
      const { data } = await api.get("/beneficiary/mybeneficiaries");
      setAllBeneficiaries(data);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
    }
  }, [api]);

  // Fetch accounts for payment
  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/account/myaccounts");
      setAccountsArray(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Fetch a single beneficiary by id
  const fetchMyBeneficiary = async (id) => {
    try {
      const { data } = await api.get(`/beneficiary/mybeneficiary/${id}`);
      setEditBeneficiaryData(data);
      setMyBeneficiaryData(data);
    } catch (error) {
      console.error("Error fetching beneficiary:", error);
    }
  };

  // Handle form changes
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: name === "transactionAmount" ? Number(value) : value,
    }));
  };

  // Add beneficiary
  const addBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await api.post("/beneficiary/addbeneficiary", addBeneficiaryData);
      setMessage("Beneficiary added successfully!");
      setShowModal(false);
      setTimeout(() => setMessage(""), 1500);
    } catch (error) {
      setCurrentError(
        error?.response?.data?.error || "Failed to add beneficiary."
      );
      setTimeout(() => setCurrentError(""), 1500);
    }
  };

  // Edit beneficiary
  const editBeneficiary = async (id) => {
    try {
      await api.post(`/beneficiary/editbeneficiary/${id}`, editBeneficiaryData);
      setMessage("Changes saved successfully!");
      setEditModal(false);
      setTimeout(() => setMessage(""), 1500);
    } catch (error) {
      setCurrentError(
        error?.response?.data?.error || "Failed to edit beneficiary."
      );
      setTimeout(() => setCurrentError(""), 1500);
    }
  };

  // Delete beneficiary
  const deleteBeneficiary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this beneficiary?"))
      return;
    try {
      await api.delete(`/beneficiary/deletebeneficiary/${id}`);
      setMessage("Beneficiary deleted successfully!");
      setTimeout(() => setMessage(""), 1500);
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
    }
  };

  // Pay beneficiary
  const handlePayBeneficiary = async () => {
    try {
      await api.post("/transaction/newtransaction", transactionData);
      setSuccessMessage("Payment successful!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/beneficiarypage");
      }, 1500);
    } catch (error) {
      setCurrentError(error?.response?.data?.error || "Payment failed.");
      setTimeout(() => setCurrentError(""), 1500);
    }
  };

  useEffect(() => {
    fetchMyBeneficiaries();
  }, [fetchMyBeneficiaries, message]);

  return (
    <div className="beneficiary-page">
      <div className="benificiary-page-header">My Beneficiaries</div>

      <button
        className="add-beneficiary-btn"
        onClick={() => setShowModal(true)}
      >
        Add Beneficiary
      </button>

      {/* Add Beneficiary Modal */}
      {showModal && (
        <div className="add-beneficiary-modal-container df">
          <div className="add-beneficiary-modal">
            <button
              className="add-benefciary-close-btn"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <form className="add-beneficiary-form" onSubmit={addBeneficiary}>
              <div className="add-beneficary-form-title">Add Beneficiary</div>

              <label className="add-bebeficiary-label">
                Beneficiary Nick Name (Optional):
              </label>
              <input
                type="text"
                name="beneficiaryNickName"
                className="add-beneficiary-input"
                onChange={handleChange(setAddBeneficiaryData)}
              />

              <label className="add-bebeficiary-label">
                Beneficiary Account Number: <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                name="beneficiaryAccountNumber"
                className="add-beneficiary-input"
                onChange={handleChange(setAddBeneficiaryData)}
              />

              <label className="add-bebeficiary-label">
                Beneficiary Transaction Limit:{" "}
                <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                name="beneficiaryTransactionLimit"
                className="add-beneficiary-input"
                onChange={handleChange(setAddBeneficiaryData)}
              />

              <div className="signup-error">{currentError}</div>
              <button type="submit" className="add-beneficiary-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Beneficiaries List */}
      <div className="beneficiary-tile-container">
        {allBeneficiaries.length === 0 ? (
          <div className="empty-beneficiary df">No Beneficiaries available</div>
        ) : (
          allBeneficiaries.map((item, index) => (
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
                  onClick={() => deleteBeneficiary(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pay Modal */}
      {payModal && (
        <div className="add-beneficiary-modal-container df">
          <div className="add-beneficiary-modal">
            <button
              className="add-benefciary-close-btn"
              onClick={() => setPayModal(false)}
            >
              ✕
            </button>
            <form
              className="add-beneficiary-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="add-beneficary-form-title">Pay Beneficiary</div>

              <label className="payment-label">
                Pay from: <span className="mand-span">*</span>
              </label>
              <select
                name="senderAccountNumber"
                className="payement-select"
                onChange={handleChange(setTransactionData)}
              >
                <option value="">Select</option>
                {accountsArray.map((item, idx) => (
                  <option key={idx} value={item.accountNumber}>
                    {item.accountNumber} - {item.accountType}
                  </option>
                ))}
              </select>

              <label className="payment-label">
                Receiver Account Number: <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                className="payment-input"
                name="recieverAccountNumber"
                value={myBeneficiaryData?.beneficiaryAccountNumber || ""}
                readOnly
              />

              <label className="payment-label">
                Payment Amount: <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                className="payment-input"
                name="transactionAmount"
                onChange={handleChange(setTransactionData)}
              />

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
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="add-beneficiary-modal-container df">
          <div className="add-beneficiary-modal">
            <button
              className="add-benefciary-close-btn"
              onClick={() => setEditModal(false)}
            >
              ✕
            </button>
            <form
              className="add-beneficiary-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="add-beneficary-form-title">Edit Beneficiary</div>

              <label className="add-bebeficiary-label">
                Beneficiary Nick Name (Optional):
              </label>
              <input
                type="text"
                name="beneficiaryNickName"
                className="add-beneficiary-input"
                value={editBeneficiaryData?.beneficiaryNickName || ""}
                onChange={handleChange(setEditBeneficiaryData)}
              />

              <label className="add-bebeficiary-label">
                Beneficiary Account Number: <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                name="beneficiaryAccountNumber"
                className="add-beneficiary-input"
                value={editBeneficiaryData?.beneficiaryAccountNumber || ""}
                onChange={handleChange(setEditBeneficiaryData)}
              />

              <label className="add-bebeficiary-label">
                Beneficiary Transaction Limit:{" "}
                <span className="mand-span">*</span>
              </label>
              <input
                type="number"
                name="beneficiaryTransactionLimit"
                className="add-beneficiary-input"
                value={editBeneficiaryData?.beneficiaryTransactionLimit || ""}
                onChange={handleChange(setEditBeneficiaryData)}
              />

              <button
                type="button"
                className="add-beneficiary-submit-btn"
                onClick={() => editBeneficiary(editBeneficiaryData._id)}
              >
                Save
              </button>
            </form>
            <div className="signup-error">{currentError}</div>
          </div>
        </div>
      )}

      {message && <div className="delete-success">{message}</div>}
      {successMessage && <div className="delete-success">{successMessage}</div>}
    </div>
  );
};

export default BeneficiaryPage;
