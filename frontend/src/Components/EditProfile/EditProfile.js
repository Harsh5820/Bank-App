import axios from "axios";
import { useEffect, useState } from "react";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const token = localStorage.getItem("token");
  const [userDataArray, setUserdataArray] = useState([]);
  const [updatedUserData, setUpdatedUserData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentError, setCurrentError] = useState("");
  const Navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5001/user/getuser", {
        headers: {
          Authorization: token,
        },
      });
      setUserdataArray(response.data);
      const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const d = new Date(isoDate);
        return d.toLocaleDateString("en-GB"); // gives dd/mm/yyyy
      };
      setUpdatedUserData({
        userName: response.data.userName || "",
        userEmail: response.data.userEmail || "",
        userPhoneNumber: response.data.userPhoneNumber || "",
        userDob: formatDate(response.data.userDob),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnchange = (e) => {
    setUpdatedUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post(
  //         `http://localhost:5001/user/edituser/${userDataArray._id}`,
  //         updatedUserData,
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         }
  //       );

  //       setSuccessMessage("Changes saved successfully !!");

  //       setTimeout(() => {
  //         setSuccessMessage("");
  //       }, 3000);

  //       setTimeout(() => {
  //         Navigate("/");
  //       }, 2000);
  //     } catch (error) {
  //       setCurrentError(error.response.data.error);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Helper: format date to DD/MM/YYYY
      const formatDob = (dob) => {
        if (!dob) return "";
        const date = new Date(dob);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const payload = {
        userName: updatedUserData.userName || userDataArray.userName,
        userEmail: updatedUserData.userEmail || userDataArray.userEmail,
        userPhoneNumber:
          updatedUserData.userPhoneNumber || userDataArray.userPhoneNumber,
        userDob: formatDob(updatedUserData.userDob || userDataArray.userDob),
      };

      const response = await axios.post(
        `http://localhost:5001/user/edituser/${userDataArray._id}`,
        payload,
        { headers: { Authorization: token } }
      );

      setSuccessMessage("Changes saved successfully !!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setTimeout(() => {
        Navigate("/");
      }, 2000);
    } catch (error) {
      setCurrentError(error.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="edit-profile">
        <div className="edit-profile-header df">Edit Profile</div>
        <div className="edit-profile-form-container df">
          <form className="edit profile-form" onSubmit={handleSubmit}>
            <label htmlFor="userName" className="signup-label">
              Name:
            </label>
            <br />
            <input
              type="text"
              name="userName"
              id="userName"
              className="signup-input"
              value={updatedUserData.userName || ""}
              onChange={handleOnchange}
            />
            <br />
            <label htmlFor="userEmail" className="signup-label">
              Email:
            </label>
            <br />
            <input
              type="text"
              name="userEmail"
              id="userEmail"
              className="signup-input"
              value={updatedUserData.userEmail || ""}
              onChange={handleOnchange}
            />
            <br />
            <label htmlFor="userPhoneNumber" className="signup-label">
              Phone Number:
            </label>
            <br />
            <input
              type="number"
              name="userPhoneNumber"
              id="userPhoneNumber"
              className="signup-input"
              value={updatedUserData.userPhoneNumber || ""}
              onChange={handleOnchange}
            />
            <br />
            <label htmlFor="userDob" className="signup-label">
              Date of Birth:
            </label>
            <br/>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              id="userDob"
              onChange={handleOnchange}
              className="signup-input"
              pattern="\d{2}/\d{2}/\d{4}"
              title="Enter date in DD/MM/YYYY format"
              name="userDob"
              value={updatedUserData.userDob || ""}
            />

            <br />
            <div className="signup-btn-container">
              <button type="submit" className="signup-btn">
                Login
              </button>
            </div>
            <div className="signup-error">{currentError}</div>
          </form>
        </div>
        {successMessage && (
          <div className="delete-success">{successMessage}</div>
        )}
        {/* css from MyAccount.js */}
      </div>
    </>
  );
};

export default EditProfile;
