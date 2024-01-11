const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vSupplierId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vSupplierId),
    };

    const getRecordDetails = await dbService.findOneRecord(
      "SupplierModel",
      filter
    );
    if (!getRecordDetails?._id) return [];

    const result = {
      _id: getRecordDetails?._id,
      vCompanyName: getRecordDetails?.vCompanyName,
      vContactPersonName: getRecordDetails?.vContactPersonName,
      vMobile: getRecordDetails?.vMobile,
      vReferenceBy: getRecordDetails?.vReferenceBy,
      vEmail: getRecordDetails?.vEmail,
      vGSTNO: getRecordDetails?.vGSTNO,
      vSupplierImage: getRecordDetails?.vSupplierImage,
      vCityId: getRecordDetails?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
