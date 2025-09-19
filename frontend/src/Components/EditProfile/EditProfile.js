import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    userEmail: "",
    userPhoneNumber: "",
    userDob: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [currentError, setCurrentError] = useState("");

  // Fetch user details
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5001/user/getuser", {
        headers: { Authorization: token },
      });

      const data = response.data;

      // Format DOB to DD/MM/YYYY
      const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const d = new Date(isoDate);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      setUserData({
        userName: data.userName || "",
        userEmail: data.userEmail || "",
        userPhoneNumber: data.userPhoneNumber || "",
        userDob: formatDate(data.userDob),
        _id: data._id,
      });
    } catch (error) {
      console.error(error);
      setCurrentError("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send updated user data
      await axios.post(
        `http://localhost:5001/user/edituser/${userData._id}`,
        userData,
        { headers: { Authorization: token } }
      );

      setSuccessMessage("Changes saved successfully!");
      setCurrentError("");

      // Navigate after showing success
      setTimeout(() => navigate(`/myprofile/${userData._id}`), 1500);
    } catch (error) {
      setCurrentError(error.response?.data?.error || "Something went wrong");
      setTimeout(() => setCurrentError(""), 3000);
    }
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-header df">Edit Profile</div>

      <div className="edit-profile-form-container df">
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <label className="signup-label">Name:</label><br/>
          <input
            type="text"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            className="signup-input"
          /><br/>

          <label className="signup-label">Email:</label><br/>
          <input
            type="text"
            name="userEmail"
            value={userData.userEmail}
            onChange={handleChange}
            className="signup-input"
          /><br/>

          <label className="signup-label">Phone Number:</label><br/>
          <input
            type="number"
            name="userPhoneNumber"
            value={userData.userPhoneNumber}
            onChange={handleChange}
            className="signup-input"
          /><br/>

          <label className="signup-label">Date of Birth:</label><br/>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            name="userDob"
            value={userData.userDob}
            onChange={handleChange}
            pattern="\d{2}/\d{2}/\d{4}"
            title="Enter date in DD/MM/YYYY format"
            className="signup-input"
          /><br/>

          <div className="signup-btn-container">
            <button type="submit" className="signup-btn">
              Save Changes
            </button>
          </div>

          {currentError && <div className="signup-error">{currentError}</div>}
        </form>
      </div>

      {successMessage && <div className="delete-success">{successMessage}</div>}
    </div>
  );
};

export default EditProfile;
