const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vCustomerId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vCustomerId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "CustomerModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vCompanyName: getRecordDetails?.vCompanyName,
      vContactPersonName: getRecordDetails?.vContactPersonName,
      vReferenceBy: getRecordDetails?.vReferenceBy,
      vCustomerImage: getRecordDetails?.vCustomerImage,
      vMobile: getRecordDetails?.vMobile,
      vGSTNO: getRecordDetails?.vGSTNO,
      vCityId: getRecordDetails?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
