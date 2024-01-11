const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteSetting = async (entry) => {
  try {
    let {
      body: { vSettingId },
    } = entry;

    let condition = {
      _id: new ObjectId(vSettingId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("SettingModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SettingModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteSettingError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteSetting;
