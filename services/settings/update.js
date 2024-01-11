const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSettingId,
        isPaymentReminder,
        vGSTNO,
        vImportanceNotes,
        vWhatsAppAPIkey,
      },
    } = entry;

    let checkGstLength = vGSTNO.length;
    if (checkGstLength != 16) {
      throw new Error("Please Enter 16 digit GST NO");
    }

    let condition = {
      _id: new ObjectId(vSettingId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("SettingModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isPaymentReminder,
      vGSTNO,
      vImportanceNotes,
      vWhatsAppAPIkey,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
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

    return updateResponse;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
