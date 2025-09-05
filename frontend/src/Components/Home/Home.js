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

  const createAccount = async () => {
    try {
      await axios.post(
        "http://localhost:5001/account/createaccount",
        { accountType: "Savings" },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log("error in creating account", error);
    }
  };

  const selectRandomUrl = () => {
    if (bannerArray.length === 0) return;
    const randomIndex = Math.floor(Math.random() * bannerArray.length);
    setSelectedRandomUrl(bannerArray[randomIndex].bannerUrl);
  };

  useEffect(() => {
    getAllbanners();

    // Set interval for rotating banners
    const intervalId = setInterval(() => {
      selectRandomUrl();
    }, 3000);

    // Initialize account check
    const init = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/account/myaccounts",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const response2 = await axios.get(
          "http://localhost:5001/reward/myrewardcoinaccount",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.length === 0) {
          await createAccount();
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    init();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // ✅ dependency array prevents multiple intervals

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
