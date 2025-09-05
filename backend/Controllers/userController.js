const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  const {
    userEmail,
    userName,
    userPhoneNumber,
    userPassword,
    userDob,
    userConfirmPassword,
  } = req.body;

  try {
    if (
      !userEmail ||
      !userPassword ||
      !userPhoneNumber ||
      !userName ||
      !userConfirmPassword
    ) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!isValidEmail) {
      return res.status(400).json({ error: "Email format incorrect" });
    }

    if (userPhoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ error: "Phone Number should be exactly 10 digits" });
    }
    // const birthDate = new Date(userDob);
    const [day, month, year] = userDob.split("/"); // ["06", "08", "2025"]
    const birthDate = new Date(`${year}-${month}-${day}`);

    const todaydate = new Date();

    let userAge = todaydate.getFullYear() - birthDate.getFullYear();

    if (userAge < 18) {
      return res
        .status(400)
        .json({ error: "Users above age 18 are allowed to create an account" });
    }

    if (userPassword !== userConfirmPassword) {
      return res.status(400).json({ error: "Password do not match" });
    }

    const capitalizeName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    };
    const formattedUserName = capitalizeName(userName);

    const users = await User.findOne({ userEmail });
    if (users) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = await User.create({
      userEmail,
      userName: formattedUserName,
      userPhoneNumber,
      userDob: birthDate,
      userPassword: hashedPassword,
      userStatus: "Pending",
    });

    const token = await jwt.sign(
      { _id: newUser._id, userEmail },
      process.env.SECRET_KEY,{expiresIn: "60m"}
    );

    return res.status(200).json({ user: newUser, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const userLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    if (!userEmail || !userPassword) {
      res.status(400).json({ error: "All fields are mandatory !" });
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!isValidEmail) {
      return res.status(400).json({ error: "Email format incorrect" });
    }
    const user = await User.findOne({ userEmail }).select("-createdAt");
    if (!user) {
      return res.status(400).json({ error: "User does not exist !!" });
    }
    if (user.userStatus === "Rejected") {
      return res.status(400).json({
        error: "Request Declined. Please sign up again or contact the manager",
      });
    }
    if (user.userStatus === "Pending") {
      return res
        .status(400)
        .json({ error: "Approval pending. Please wait some time !!" });
    }
    const correctpassword = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (!correctpassword) {
      return res.status(400).json({ error: "Incorrect Password" });
    }
    const token = await jwt.sign(
      { _id: user._id, userEmail, userRole: user.userRole },
      process.env.SECRET_KEY,{expiresIn: "60m"}
    );

    res.status(200).json({ token, user });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUser = async (req, res) => {
  const userId = req.user?._id;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User Not found !!!" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const editUser = async (req, res) => {
  const { userEmail, userName, userPhoneNumber, userDob } = req.body;
  const userId = req.params.id;
  try {
    if (!userEmail || !userName || !userPhoneNumber || !userDob) {
      return res.status(400).json({ error: "All fields are mandatory !!!" });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!isValidEmail) {
      return res.status(400).json({ error: "Email format incorrect" });
    }

    if (String(userPhoneNumber).length !== 10) {
      return res
        .status(400)
        .json({ error: "Phone Number should be exactly 10 digits" });
    }

    // const birthDate = new Date(userDob);
    const [day, month, year] = userDob.split("/"); // ["06", "08", "2025"]
    const birthDate = new Date(`${year}-${month}-${day}`);

    const todaydate = new Date();

    let userAge = todaydate.getFullYear() - birthDate.getFullYear();

    if (userAge < 18) {
      return res
        .status(400)
        .json({ error: "Users above age 18 are allowed to create an account" });
    }

    const capitalizeName = (name) => {
      return name
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedUserName = capitalizeName(userName);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userEmail,
        userName: formattedUserName,
        userPhoneNumber,
        userDob: birthDate,
      },
      { new: true } // return the updated document
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user?._id;
  try {
    const user = await User.find({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "User not Found !!!" });
    }
    const deletedUser = await User.findByIdAndDelete({ _id: userId });
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User Not found !!!" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const userManagerApproval = async (req, res) => {
  const { userRole, userStatus } = req.body;
  const userId = req.params.id;
  try {
    if (!userRole || !userStatus) {
      return res.status(400).json({ error: "All fields are mandatory !!!" });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(400).json({ error: "User not found !!!" });
    }

    if (userStatus === "Rejected") {
      await User.findByIdAndDelete({ _id: userId });
      return res
        .status(200)
        .json({ error: "Approval Denied. Please contact Branch Manager" });
    }

    user.userStatus = userStatus;
    user.userRole = userRole;
    await user.save();
    return res.status(200).json("Completed");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const usersToApprove = async (req, res) => {
  try {
    const pendingUsers = await User.find({ userStatus: "Pending" });
    return res.status(200).json(pendingUsers);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getUser,
  editUser,
  deleteUser,
  getUserById,
  userManagerApproval,
  usersToApprove,
};
