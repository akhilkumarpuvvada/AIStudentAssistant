import mongoose from "mongoose";
import classModel from "../models/Class.js";
import userModel from "../models/User.js";

const addClass = async (req, res) => {
  const { name, studentId, teacherId, documentId } = req.body;

  try {
    const isClassAlreadyAvailable = await classModel.findOne({ name });
    if (isClassAlreadyAvailable) {
      return res.json({ success: false, message: "Class already available " });
    }
    const newClass = new classModel({
      name,
      studentIds: studentId ? [studentId] : [],
      teacherIds: teacherId ? [teacherId] : [],
      documentIds: documentId ? [documentId] : [],
    });
    const savedClass = await newClass.save();

    if (studentId) {
      await userModel.findByIdAndUpdate(studentId, {
        $addToSet: { classIds: savedClass._id },
      });
    }
    if (teacherId) {
      await userModel.findByIdAndUpdate(teacherId, {
        $addToSet: { classIds: savedClass._id },
      });
    }
    res.json({ success: true, message: "New Class added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllClasses = async (req, res) => {
  const user = req.session.user;
  try {
    if (user.role === "admin") {
      const classes = await classModel
        .find({})
        .populate("studentIds", "name")
        .populate("teacherIds", "name");
      if (classes) {
        res.json({ success: true, data: classes });
      }
      if (user.role === "teacher") {
        const classes = await userModel
          .find({ teacherIds: user.id })
          .populate("studentIds", "name email");
        if (classes) {
          res.json({ success: true, data: classes });
        }
      }

      if (user.role === "student") {
        const classes = await userModel
          .find({ studentIds: user.id })
          .populate("teacherIds", "name email");
        if (classes) {
          res.json({ success: true, data: classes });
        }
      }
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getClassById = async (req, res) => {
  const classId = req.params.id;
  try {
    const newClass = await classModel.findById(classId);
    res.json({ success: true, data: newClass });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateClassById = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updateClass = await classModel
      .findByIdAndUpdate(id, updates, {
        new: true,
      })
      .populate("studentIds", "name email role")
      .populate("teacherIds", "name email role");
    if (!updateClass) {
      res.json({ success: false, message: "Class not found" });
    }
    res.json({ success: true, data: updateClass });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteClass = async (req, res) => {
  const classId = req.params.id;
  try {
    const cls = await classModel.findById(classId);
    if (!cls) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    await userModel.updateMany(
      { _id: { $in: cls.studentIds } },
      { $pull: { classIds: classId } }
    );

    await userModel.updateMany(
      { _id: { $in: cls.teacherIds } },
      { $pull: { classIds: classId } }
    );

    await classModel.findByIdAndDelete(classId);
    res.json({ success: true, message: "Class deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const addStudentToClass = async (req, res) => {
  const { studentId } = req.body;
  const classId = req.params.id;
  try {
    const updatedClass = await classModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { studentIds: studentId },
      },
      { new: true }
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      studentId,
      { $addToSet: { classIds: mongoose.Schema.Types.ObjectId(classId) } },
      { new: true }
    );

    if (!updatedClass) {
      return res.json({ success: false, message: "Class not found" });
    }

    res.json({ success: true, data: { updatedClass, updatedUser } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const addTeacherToClass = async (req, res) => {
  const { teacherId } = req.body;
  const classId = req.params.id;
  try {
    const updatedClass = await classModel.findByIdAndUpdate(classId, {
      $addToSet: { teacherIds: teacherId },
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      classId,
      { $addToSet: { teacherIds: mongoose.Schema.Types.ObjectId(teacherId) } },
      { new: true }
    );
    if (!updatedClass) {
      return res.json({ success: false, message: "Class not found" });
    }

    res.json({ success: true, data: { updatedClass, updatedUser } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  addClass,
  getAllClasses,
  getClassById,
  updateClassById,
  deleteClass,
  addStudentToClass,
  addTeacherToClass,
};
