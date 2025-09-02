import { useNavigate, useParams } from "react-router-dom";
import "./ApproveUser.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ApproveUser = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState();
  const [currentError, setCurrentError] = useState("");
  const [approvalData, setApprovalData] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const Navigate = useNavigate()

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/user/getuserbyid/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUserInfo(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (e) => {
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
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTimeout(() => {
        Navigate("/")
      }, 2000);
      setSuccessMessage("Approved");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
      setCurrentError(error.response.data.error);
    }
  };

  useEffect(() => {
    getUser();
    console.log("Approval Data",approvalData)
  }, []);

  return (
    <>
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
          <form
            action=""
            className="approve-user-form"
            onSubmit={handleApproveUser}
          >
            <div className="approve-user-header2 df">Assign Role</div>
            <label htmlFor="" className="approve-user-label">
              Role:
            </label>
            <select
              className="approve-user-select"
              name="userRole"
              onChange={handleOnChange}
              defaultValue=""
            >
              <option className="approve-user-option" value="">
                Select
              </option>
              <option className="approve-user-option" value="Manager">
                Manager
              </option>
              <option className="approve-user-option" value="Account Holder">
                Account Holder
              </option>
              <option className="approve-user-option" value="Pending">
                Pending
              </option>
            </select>
            <div className="approve-user-header2 df">Update Status</div>
            <label htmlFor="" className="approve-user-label">
              Status:
            </label>

            <select
              className="approve-user-select"
              name="userStatus"
              onChange={handleOnChange}
              defaultValue=""
            >
              <option className="approve-user-option" value="">
                Select
              </option>
              <option className="approve-user-option" value="Approved">
                Approved
              </option>
              <option className="approve-user-option" value="Rejected">
                Rejected
              </option>
              <option className="approve-user-option" value="Pending">
                Pending
              </option>
            </select>
            <div className="approve-user-error df">{currentError}</div>
            <div className="df">
              <button type="submit" className="approve-user-btn">
                Submit
              </button>
            </div>
          </form>
          {successMessage && (
            <div className="delete-success">{successMessage}</div>
          )}
          {/* css from MyAccount.js */}
        </div>
      </div>
    </>
  );
};

export default ApproveUser;
