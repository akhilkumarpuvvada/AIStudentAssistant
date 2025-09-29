import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    _name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ["student", "teacher", "admin"]},
    classIds: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Class"
    }]
},
{timeStamps: true}
)

const User = mongoose.model("User", userSchema);

export default User;