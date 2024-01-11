const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vEventId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vEventId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "EventModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vTitle: getRecordDetails?.vTitle,
      dtStart: getRecordDetails?.dtStart,
      dtEnd: getRecordDetails?.dtEnd,
      vAddress: getRecordDetails?.vAddress,
      vCityId: getRecordDetails?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
