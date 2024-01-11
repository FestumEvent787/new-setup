const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vSettingId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vSettingId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "SettingModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      isPaymentReminder: getRecordDetails?.isPaymentReminder,
      vGSTNO: getRecordDetails?.vGSTNO,
      vImportanceNotes: getRecordDetails?.vImportanceNotes,
      vWhatsAppAPIkey: getRecordDetails?.vWhatsAppAPIkey,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
