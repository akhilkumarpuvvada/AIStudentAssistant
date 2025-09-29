import bcrypt from "bcrypt";
import userModel from "../models/User.js";

const addUser = async (req, res) => {
  const { name, email, role, classId } = req.body;
  const { password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const isUserAlreadyAvailable = await userModel.findOne({ email });
  if (isUserAlreadyAvailable) {
    res.json({ success: false, message: "User already available" });
  }

  const hashedPassword = await hashPassword(password);

  const user = new userModel({
    name,
    email,
    password: hashedPassword,
    role,
    classIds: classId ? [classId] : [],
  });

  try {
    await user.save();
    res.json({ success: true, message: "User added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const getAllUsers = async (_req, res) => {
  try {
    const users = await userModel.find({});
    if (users) {
      res.json({ success: true, data: users });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {

    const userId = req.params.id;
    const updates = req.body;
    console.log(userId, updates);
    
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true}
        )
        if(!updatedUser) {
            res.json({ success: false, message: "User not found"})
        }
        res.json({ success: true, data: updatedUser})
    }
    catch(error) {
        res.json({ success: false, message: error.message})
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try{
        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "User deleted"})
    }
    catch( error) {
        res.json({ success: false, message: error.message})
    }
};

// const getUsersByRole = () => {

// }


export { addUser, getAllUsers, getUserById, updateUser, deleteUser };
