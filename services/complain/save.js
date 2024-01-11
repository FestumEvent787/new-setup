const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCustomerId,
        dtComplainDate,
        dtInvoiceDate,
        vMobile,
        vComplainNote,
      },
      files,
    } = entry;

    let complainImageArray = [];
    if (files.length > 0) {
      complainImageArray = await imageUpload(files);
    }

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(userId),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let payload = {
      vCustomerId: new ObjectId(vCustomerId),
      dtComplainDate: Date.parse(dtComplainDate),
      dtInvoiceDate: Date.parse(dtInvoiceDate),
      vMobile,
      vComplainNote,
      arrComplainPhotos: complainImageArray,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("ComplainModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(saveData?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let result = {
      vCustomerId: saveData?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      dtComplainDate: saveData?.dtComplainDate,
      dtInvoiceDate: saveData?.dtInvoiceDate,
      vMobile: saveData?.vMobile,
      vComplainNote: saveData?.vComplainNote,
      isComplainStatus: saveData?.isComplainStatus,
      arrComplainPhotos: saveData?.arrComplainPhotos,
      vCreatedBy: saveData?.vCreatedBy,
      vCreatedByName: userData?.vName,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
