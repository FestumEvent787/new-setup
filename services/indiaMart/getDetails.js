const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vIndiaMartId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vIndiaMartId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "IndiaMartModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vCompanyName: getRecordDetails?.vCompanyName,
      vContactPerson: getRecordDetails?.vContactPerson,
      vMobile: getRecordDetails?.vMobile,
      vAddress: getRecordDetails?.vAddress,
      vTraderOrUser: getRecordDetails?.vTraderOrUser,
      vRemark: getRecordDetails?.vRemark,
      arrIndiaMartImage: getRecordDetails?.arrIndiaMartImage,
      vCityId: getRecordDetails?.vCityId,
      dtCreatedAt: getRecordDetails?.dtCreatedAt,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
