const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vPackingId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vPackingId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "PackingModel",
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
