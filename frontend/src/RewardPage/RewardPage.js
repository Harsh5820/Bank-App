import axios from "axios";
import { useEffect, useState } from "react";
import "./RewardPage.css";
import { useNavigate } from "react-router-dom";

const RewardPage = () => {
  const token = localStorage.getItem("token");
  const [myRewardAccount, setMyRewardAccount] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [coinBalance, setCointBalance] = useState([]);
  const Navigate = useNavigate();

  const myRewardCoinAccount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/reward/myrewardcoinaccount",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMyRewardAccount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFormOpen = () => {
    setFormOpen((prev) => !prev);
  };

  const withdrawRewardCoin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/reward/withdrawcoin",
        coinBalance,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTimeout(() => {
        Navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myRewardCoinAccount();
  }, []);

  return (
    <>
      <div className="reward-page">
        <div className="reward-header df">Rewards Section</div>
      </div>
      <div className="reward-balance-section">
        <div className="reward-balance-title">
          Reward Coins: {myRewardAccount.coinBalance}
        </div>
      </div>
      <button className="reward-coin-open-form-btn" onClick={toggleFormOpen}>
        Open Withdraw Form
      </button>
      <div
        className={`reward-withdraw-section  ${formOpen ? "open" : "closed"} `}
      >
        <form
          action=""
          className={`reward-withdraw-form`}
          onSubmit={withdrawRewardCoin}
        >
          <label htmlFor="coinAmount" className="reward-withdraw-label">
            Number of Coins:
          </label>
          <br />
          <input
            type="number"
            name="coinAmount"
            className="reward-withdraw-input"
            onChange={(e) =>
              setCointBalance({
                [e.target.name]: e.target.value,
              })
            }
          />
          <br />
          <button type="submit" className="reward-withdraw-btn">
            Withdraw
          </button>
        </form>
      </div>
    </>
  );
};

export default RewardPage;
