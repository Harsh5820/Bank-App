import axios from "axios";
import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [bannerArray, setBannerArray] = useState([]);
  const [selectedRandomUrl, setSelectedRandomUrl] = useState("");

  useEffect(() => {
    let intervalId;

    const getAllbanners = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/banner/allbanners"
        );

        const allBanners = response?.data?.allBanners || [];
        setBannerArray(allBanners);

        if (allBanners.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * allBanners.length
          );
          setSelectedRandomUrl(allBanners[randomIndex].bannerUrl);

          // Start interval ONLY after data is available
          intervalId = setInterval(() => {
            const randomIndex = Math.floor(
              Math.random() * allBanners.length
            );
            setSelectedRandomUrl(
              allBanners[randomIndex].bannerUrl
            );
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllbanners();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-banner-container">
          {selectedRandomUrl && (
            <img src={selectedRandomUrl} alt="banner" />
          )}
        </div>

        <div className="home-welcome">
          <span> WELCOME -</span>
          <span className="home-user-name">
            {user?.userName || ""}
          </span>
        </div>

        <div className="home-hero-desc">The Bank of Future</div>
      </div>

      <div className="home-create-section">
        <div className="home-card" onClick={() => navigate("/pay")}>
          Pay
        </div>
        <div className="home-card">Apply for Debit Card</div>
        <div className="home-card">Apply for Credit Card</div>
      </div>
    </div>
  );
};

export default Home;