const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const { UserRole } = require("../../config/constants");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
    } = entry;

    let checkAdmin = await dbService.findOneRecord(
      "UserModel",
      { _id: new ObjectId(userId), isDeleted: false },
      {
        _id: 1,
        vUserRole: new ObjectId(UserRole?.SUPERADMIN?._id),
      }
    );
    if (!checkAdmin?._id) throw new Error(Message.unauthorizedAdmin);

    let filter = {
      isDeleted: false,
      vName,
    };

    let checkData = await dbService.findOneRecord("RoleModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    const saveData = await dbService.createOneRecord("RoleModel", {
      vName,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    return saveData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
