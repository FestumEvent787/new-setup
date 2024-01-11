const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vComplainId,
        vCustomerId,
        dtComplainDate,
        dtInvoiceDate,
        vMobile,
        vComplainReview,
        isComplainStatus,
        arrComplainUrlImage = [],
      },
      files,
    } = entry;

    let condition = {
      _id: new ObjectId(vComplainId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("ComplainModel", condition, {
      _id: 1,
      arrComplainPhotos: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let complainImageArray = arrComplainUrlImage;
    if (files.length > 0) {
      let newImageArray = await imageUpload(files);
      complainImageArray = complainImageArray.concat(newImageArray);
    }
    let updateData = {
      vCustomerId: new ObjectId(vCustomerId),
      dtComplainDate: Date.parse(dtComplainDate),
      dtInvoiceDate: Date.parse(dtInvoiceDate),
      vMobile,
      vComplainReview,
      isComplainStatus,
      arrComplainPhotos: complainImageArray,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "ComplainModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(updateResponse?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(updateResponse?.vUpdatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let result = {
      vCustomerId: updateResponse?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      dtComplainDate: updateResponse?.dtComplainDate,
      dtInvoiceDate: updateResponse?.dtInvoiceDate,
      vMobile: updateResponse?.vMobile,
      vComplainNote: updateResponse?.vComplainNote,
      vComplainReview: updateResponse?.vComplainReview,
      arrComplainPhotos: updateResponse?.arrComplainPhotos,
      isComplainStatus: updateResponse?.isComplainStatus,
      vCreatedBy: updateResponse?.vCreatedBy,
      vUpdatedBy: updateResponse?.vUpdatedBy,
      vCreatedByName: userData?.vName,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
