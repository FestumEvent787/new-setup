const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName, vAddress, vCityId, isStatus, vTeamLinkImage = "" },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(userId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("UserModel", condition, {
      _id: 1,
      vProfileImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let teamUrlImage = vTeamLinkImage;
    if (Object.keys(file).length > 0) {
      teamUrlImage = await imageUpload(file);
    }
    let updateData = {
      vName,
      vAddress,
      vCityId,
      isStatus,
      vProfileImage: teamUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
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

    let result = {
      vName: updateResponse?.vName,
      vAddress: updateResponse?.vAddress,
      vProfileImage: updateResponse?.vProfileImage,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
