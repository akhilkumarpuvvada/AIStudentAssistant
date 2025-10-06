import bcrypt from "bcrypt";
import userModel from "../models/User.js";

// Add User
const addUser = async (req, res) => {
  try {
    const { name, email, role, classId, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const isUserAlreadyAvailable = await userModel.findOne({ email });
    if (isUserAlreadyAvailable) {
      return res.status(400).json({ success: false, message: "User already available" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      classIds: classId ? [classId] : [],
    });

    await user.save();
    res.json({ success: true, message: "User added successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users
const getAllUsers = async (_req, res) => {
  try {
    const users = await userModel.find({}).populate("classIds", "name");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Role-based filters
const getUsersByRole = async (req, res) => {  
  try {
    const users = await userModel.find({ role: req.params.role }).populate("classIds", "name");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addUser, getAllUsers, getUserById, updateUser, deleteUser, getUsersByRole };
