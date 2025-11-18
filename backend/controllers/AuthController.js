import userModel from "../models/User.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Request" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    res.json({
      success: true,
      message: "Login Successful",
      user: req.session.user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged Out" });
  });
};

const signUp = async (req, res) => {
  try {
    const { name, email, role, classId, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const isUserAlreadyAvailable = await userModel.findOne({ email });
    if (isUserAlreadyAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "User already available" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role ? role : "student",
      classIds: classId ? [classId] : [],
    });

    await user.save();
    res.json({ success: true, message: "User added successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  const getMe = (req, res) => {
    if (req.session.user) {
      res.json({ success: true, user: req.session.user });
    } else {
      res.status(401).json({ success: false, message: "Not logged in" });
    }
  };

export { login, logout, signUp, getMe };
