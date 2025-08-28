import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import { useState } from "react";
import SignUp from "./Components/SignUp";
import Footer from "./Components/Footer/Footer";
import Profile from "./Components/Profile/Profile";
import MyAccount from "./Components/MyAccount/MyAccount";
import Pay from "./Components/Pay/Pay";
import MyTransactions from "./Components/MyTransactions/MyTransactions";
import CreateAccount from "./Components/CreateAccount/CreateAccount";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  // const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route path="/signup" element={<SignUp />} />
          <Route
            path={isLoggedIn ? `/myprofile/:userId` : "/login"}
            element={
              isLoggedIn ? <Profile /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/myaccount"
            element={
              isLoggedIn ? (
                <MyAccount />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/pay"
            element={
              isLoggedIn ? <Pay /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/mytransactions"
            element={
              isLoggedIn ? <MyTransactions /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/createaccount"
            element={
              isLoggedIn ? <CreateAccount /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
