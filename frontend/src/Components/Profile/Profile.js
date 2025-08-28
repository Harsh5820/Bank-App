import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import axios from "axios";

const Profile = () => {
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [userDataArray, setUserdataArray] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5001/user/getuser", {
        headers: {
          Authorization: token,
        },
      });
      setUserdataArray(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">My Profile</div>
      <div className="profile-info-container">
        <div className="profile-img-container">
          <img
            className="profile-img"
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="profile Image"
          />
        </div>
        <div className="profile-info-detail-container">
          <div className="profile-info-name">
            Name: {userDataArray.userName}
          </div>
          <div className="profile-info-email">
            Email: {userDataArray.userEmail}
          </div>
          <div className="profile-info-cid">
            Customer ID: {userDataArray._id}
          </div>
          <div className="profile-info-phonenumber">
            Phone Number: {userDataArray.userPhoneNumber}
          </div>
          <div className="profile-info-dob">
            DOB: {new Date(userDataArray.userDob).toLocaleDateString("en-GB")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
