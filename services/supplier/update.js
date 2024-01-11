const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSupplierId,
        vCompanyName,
        vContactPersonName,
        vReferenceBy,
        vMobile,
        vEmail,
        vCityId,
        vGSTNO,
        isStatus,
        vSupplierLinkImage = "",
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
      _id: new ObjectId(vSupplierId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("SupplierModel", condition, {
      _id: 1,
      vSupplierImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let supplierUrlImage = vSupplierLinkImage;
    if (Object.keys(file).length > 0) {
      supplierUrlImage = await imageUpload(file);
    }
    let updateData = {
      vCompanyName,
      vContactPersonName,
      vReferenceBy,
      vMobile,
      vEmail,
      vCityId,
      vGSTNO,
      isStatus,
      vSupplierImage: supplierUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SupplierModel",
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
      vMobile: updateResponse?.vMobile,
      vReferenceBy: updateResponse?.vReferenceBy,
      vEmail: updateResponse?.vEmail,
      vGSTNO: updateResponse?.vGSTNO,
      vSupplierImage: updateResponse?.vSupplierImage,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
