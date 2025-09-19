import axios from "axios";
import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [bannerArray, setBannerArray] = useState([]);
  const [selectedRandomUrl, setSelectedRandomUrl] = useState("");

  const getAllbanners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/banner/allbanners"
      );
      const allBanners = response?.data?.allBanners || [];
      setBannerArray(allBanners);

      // Immediately pick a random banner on fetch
      if (allBanners.length > 0) {
        const randomIndex = Math.floor(Math.random() * allBanners.length);
        setSelectedRandomUrl(allBanners[randomIndex].bannerUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectRandomUrl = () => {
    if (bannerArray.length === 0) return;
    const randomIndex = Math.floor(Math.random() * bannerArray.length);
    setSelectedRandomUrl(bannerArray[randomIndex].bannerUrl);
  };

  useEffect(() => {
    getAllbanners();

    const intervalId = setInterval(() => {
      selectRandomUrl();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-banner-container">
          {selectedRandomUrl && <img src={selectedRandomUrl} alt="banner" />}
        </div>
        <div className="home-welcome">
          <span> WELCOME -</span>
          <span className="home-user-name">
            {user.userName ? user.userName : ""}
          </span>
        </div>
        <div className="home-hero-desc">The Bank of Future</div>
      </div>

      <div className="home-create-section">
        <div className="home-card" onClick={() => Navigate("/pay")}>
          Pay
        </div>
        <div className="home-card">Apply for Debit Card</div>
        <div className="home-card">Apply for Credit Card</div>
      </div>
    </div>
  );
};

export default Home;
