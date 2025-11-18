
import userModel from "../models/User.js";
import documentModel from "../models/Documents.js";


const accessFilterAgent = async ({ userId }) => {
  if (!userId) return { allowedDocIds: [] };

  const user = await userModel.findById(userId).select("classIds").lean();
  const classIds = user?.classIds || [];

  const docs = await documentModel
    .find({
      $or: [
        { ownerType: "student", ownerId: userId },
        { ownerType: "class", ownerId: { $in: classIds } },
      ],
    })
    .select("_id")
    .lean();

  const allowedDocIds = docs.map((d) => d._id.toString());
  console.log(`[AccessFilterAgent] Allowed docs: ${allowedDocIds.length}`);
  return { allowedDocIds };
};

export default accessFilterAgent;
