import { useEffect, useState } from "react";
import "./PendingApprovals.css";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const PendingApprovals = () => {
  const token = localStorage.getItem("token");
  const [pendingUsersArray, setPendingUsersArray] = useState([]);

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/user/userstoapprove",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPendingUsersArray(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);
  return (
    <>
      <div className="pending-approval">
        <div className="pending-approvals-header">Pending Approvals</div>

        {pendingUsersArray.length === 0 ? (
          <div className="pending-approval-empty df">No Users to Approve</div>
        ) : (
          <div className="pending-approvals-tile-container">
            {pendingUsersArray?.map?.((item, index) => (
              <div className="pending-approvals-tile" key={index}>
                <div className="pending-approvals-name df">{item.userName}</div>
                <div className="pending-approvals-userstatus df">
                  {item.userStatus}
                </div>
                <div className="pending-approvals-age df">
                  {getTimeAgo(item.updatedAt)}
                </div>
                <Link
                  to={`/approveuser/${item._id}`}
                  className="pending-approvals-link df"
                >
                  <FaInfoCircle />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PendingApprovals;
