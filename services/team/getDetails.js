const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const { UserNameByRole } = require("../../config/constants");

const getDetails = async (entry) => {
  try {
    let {
      body: { vTeamId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vTeamId),
    };

    const getRecordDetails = await dbService.findOneRecord("UserModel", filter);
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vName: getRecordDetails?.vName,
      vMobile: getRecordDetails?.vMobile,
      vAddress: getRecordDetails?.vAddress,
      vUserRole: UserNameByRole[getRecordDetails?.vUserRole],
      vProfileImage: getRecordDetails?.vProfileImage,
      vCityId: getRecordDetails?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
