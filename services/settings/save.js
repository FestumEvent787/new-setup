const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { isPaymentReminder, vGSTNO, vImportanceNotes, vWhatsAppAPIkey },
    } = entry;

    let checkGstLength = vGSTNO.length;
    if (checkGstLength != 16) {
      throw new Error("Please Enter 16 digit GST NO");
    }

    let filter = {
      isDeleted: false,
      isPaymentReminder,
    };

    let checkData = await dbService.findOneRecord("SettingModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    const saveData = await dbService.createOneRecord("SettingModel", {
      isPaymentReminder,
      vGSTNO,
      vImportanceNotes,
      vWhatsAppAPIkey,
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
