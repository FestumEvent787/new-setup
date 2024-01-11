const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vEventId,
        vTitle,
        dtStart,
        dtEnd,
        vAddress,
        vCityId,
        isStatus,
        vEventLinkImage = "",
      },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vEventId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("EventModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let eventUrlImage = vEventLinkImage;
    if (Object.keys(file).length > 0) {
      eventUrlImage = await imageUpload(file);
    }

    let updateData = {
      vTitle,
      dtStart: Date.parse(dtStart),
      dtEnd: Date.parse(dtEnd),
      vAddress,
      vCityId,
      isStatus,
      vEventImage: eventUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "EventModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vTitle: updateResponse?.vTitle,
      vAddress: updateResponse?.vAddress,
      dtStart: updateResponse?.dtStart,
      dtEnd: updateResponse?.dtEnd,
      vEventImage: updateResponse?.vEventImage,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
