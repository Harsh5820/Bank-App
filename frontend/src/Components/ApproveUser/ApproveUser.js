import { useNavigate, useParams } from "react-router-dom";
import "./ApproveUser.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ApproveUser = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);
  const [currentError, setCurrentError] = useState("");
  const [approvalData, setApprovalData] = useState({
    userRole: "",
    userStatus: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const Navigate = useNavigate();

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/user/getuserbyid/${id}`,
        { headers: { Authorization: token } }
      );
      setUserInfo(response.data);
    } catch (error) {
      setCurrentError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setCurrentError("");
    setApprovalData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApproveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5001/user/usermanagerapproval/${id}`,
        approvalData,
        { headers: { Authorization: token } }
      );

      setSuccessMessage("User approved successfully!");
      setTimeout(() => Navigate("/"), 1500);
    } catch (error) {
      const msg = error.response?.data?.error || "Approval failed. Try again.";
      setCurrentError(msg);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const isFormValid = approvalData.userRole && approvalData.userStatus;

  if (loading) return <div>Loading user data...</div>;

  return (
    <div className="approve-user-page">
      <div className="approve-user-header df">User Information</div>
      <div className="approve-user-user-info-container">
        <div className="user-info-tile df">
          <div className="user-info-title">Name:</div>
          <div className="user-info-desc">{userInfo?.userName}</div>
        </div>
        <div className="user-info-tile df">
          <div className="user-info-title">Email:</div>
          <div className="user-info-desc">{userInfo?.userEmail}</div>
        </div>
        <div className="user-info-tile df">
          <div className="user-info-title">Phone Number:</div>
          <div className="user-info-desc">{userInfo?.userPhoneNumber}</div>
        </div>
        <div className="user-info-tile df">
          <div className="user-info-title">Date of Birth:</div>
          <div className="user-info-desc">
            {new Date(userInfo?.userDob).toLocaleDateString("en-GB")}
          </div>
        </div>
      </div>

      <div className="approve-user-form-container df">
        <form className="approve-user-form" onSubmit={handleApproveUser}>
          <div className="approve-user-header2 df">Assign Role</div>
          <select name="userRole" onChange={handleOnChange} defaultValue="">
            <option value="">Select</option>
            <option value="Manager">Manager</option>
            <option value="Account Holder">Account Holder</option>
            <option value="Pending">Pending</option>
          </select>

          <div className="approve-user-header2 df">Update Status</div>
          <select name="userStatus" onChange={handleOnChange} defaultValue="">
            <option value="">Select</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>

          <div className="approve-user-error df">{currentError}</div>
          <button
            type="submit"
            className="approve-user-btn"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>

        {successMessage && (
          <div className="delete-success">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ApproveUser;
