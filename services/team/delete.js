const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const { UserRole } = require("../../config/constants");

const deleteTeam = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vTeamId },
    } = entry;

    let checkUser = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(userId),
        isDeleted: false,
      },
      {
        _id: 1,
        vUserRole: 1,
      }
    );
    if (
      UserRole?.SUPERADMIN?._id.toString() == checkUser?.vUserRole.toString() ||
      UserRole?.ADMIN?._id.toString() == checkUser?.vUserRole.toString()
    ) {
      let condition = {
        _id: new ObjectId(vTeamId),
        isDeleted: false,
      };

      let checkData = await dbService.findOneRecord("UserModel", condition, {
        _id: 1,
      });
      if (!checkData?._id) throw new Error(Message.recordNotFound);

      let updateData = {
        isDeleted: true,
        dtDeletedAt: Date.now(),
      };

      let updateResponse = await dbService.findOneAndUpdateRecord(
        "UserModel",
        condition,
        updateData,
        {
          returnOriginal: false,
        }
      );
      if (!updateResponse) throw new Error(Message.systemError);

      return [];
    } else {
      throw new Error(Message.unauthorizedAdmin);
    }
  } catch (error) {
    console.error("deleteTeamError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteTeam;
