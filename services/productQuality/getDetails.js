const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vProductQualityId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vProductQualityId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "ProductQualityModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vName: getRecordDetails?.vName,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
