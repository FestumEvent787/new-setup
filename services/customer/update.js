const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCustomerId,
        vCompanyName,
        vContactPersonName,
        vReferenceBy,
        vMobile,
        vCityId,
        vGSTNO,
        isStatus,
        vCustomerLinkImage = "",
      },
      file,
    } = entry;

    let checkGstLength = vGSTNO.length;
    let checkNumberLength = vMobile.length;
    if (checkGstLength != 16) {
      throw new Error("Please Enter 16 digit GST NO");
    }
    if (checkNumberLength != 10) {
      throw new Error("Please Enter 10 digit Mobile Number");
    }

    let condition = {
      _id: new ObjectId(vCustomerId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("CustomerModel", condition, {
      _id: 1,
      vCustomerImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let customerUrlImage = vCustomerLinkImage;
    if (Object.keys(file).length > 0) {
      customerUrlImage = await imageUpload(file);
    }

    let updateData = {
      vCompanyName,
      vContactPersonName,
      vReferenceBy,
      vMobile,
      vCityId,
      vGSTNO,
      isStatus,
      vCustomerImage: customerUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "CustomerModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vCompanyName: updateResponse?.vCompanyName,
      vContactPersonName: updateResponse?.vContactPersonName,
      vReferenceBy: updateResponse?.vReferenceBy,
      vCustomerImage: updateResponse?.vCustomerImage,
      vMobile: updateResponse?.vMobile,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
