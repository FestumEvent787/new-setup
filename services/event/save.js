const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vTitle, dtStart, dtEnd, vAddress, vCityId },
      file,
    } = entry;

    let filter = {
      isDeleted: false,
      vTitle,
    };

    let checkData = await dbService.findOneRecord("EventModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    let eventImage = "";
    if (Object.keys(file).length > 0) {
      eventImage = await imageUpload(file);
    }

    const saveData = await dbService.createOneRecord("EventModel", {
      vTitle,
      dtStart: Date.parse(dtStart),
      dtEnd: Date.parse(dtEnd),
      vAddress,
      vCityId,
      vEventImage: eventImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vTitle: saveData?.vTitle,
      vAddress: saveData?.vAddress,
      dtStart: saveData?.dtStart,
      dtEnd: saveData?.dtEnd,
      vEventImage: saveData?.vEventImage,
      vCityId: saveData?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
