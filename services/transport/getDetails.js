const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vTransportId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vTransportId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vCompanyName: 1,
          vContactPerson: 1,
          vMobile: 1,
          vReferenceBy: 1,
          vGSTNO: 1,
          vTransportImage: 1,
          vCityId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "TransportModel",
      aggregateQuery
    );

    let result = "";
    if (dataList[0]) {
      result = dataList[0];
    }

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
