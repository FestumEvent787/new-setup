const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vTransportId,
        vCompanyName,
        vContactPerson,
        vReferenceBy,
        vMobile,
        vCityId,
        vGSTNO,
        isStatus,
        vTransportLinkImage = "",
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
      _id: new ObjectId(vTransportId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("TransportModel", condition, {
      _id: 1,
      vTransportImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let transportUrlImage = vTransportLinkImage;
    if (Object.keys(file).length > 0) {
      transportUrlImage = await imageUpload(file);
    }
    let updateData = {
      vCompanyName,
      vContactPerson,
      vReferenceBy,
      vMobile,
      vCityId,
      vGSTNO,
      isStatus,
      vTransportImage: transportUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "TransportModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vCompanyName: updateResponse?.vCompanyName,
      vContactPerson: updateResponse?.vContactPerson,
      vMobile: updateResponse?.vMobile,
      vReferenceBy: updateResponse?.vReferenceBy,
      vGSTNO: updateResponse?.vGSTNO,
      vTransportImage: updateResponse?.vTransportImage,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
