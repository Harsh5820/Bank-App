import axios from "axios";
import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [bannerArray, setBannerArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getAllbanners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/banner/allbanners"
      );
      setBannerArray(response.data.allBanners);
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
      console.log("error  in creating account", error);
    }
  };

  useEffect(() => {
    getAllbanners();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        bannerArray.length > 0 ? (prevIndex + 1) % bannerArray.length : 0
      );
    }, 5000);

    

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

        if (response.data.length === 0) {
          await createAccount();
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    init();

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-banner-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {bannerArray?.map?.((item, index) => (
            <img key={index} src={item.bannerUrl} alt={item.bannerAlt} />
          ))}
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
        <div className="home-card">Appply for Debit Card</div>
        <div className="home-card">Appply for Credit Card</div>
      </div>
    </div>
  );
};

export default Home;
