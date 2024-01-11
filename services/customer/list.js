const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const list = async (entry) => {
  try {
    let {
      body: { vCustomerId },
    } = entry;

    let filter = {
      isDeleted: false,
    };

    if (vCustomerId) {
      filter["_id"] = new ObjectId(vCustomerId);
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vCompanyName: 1,
          vContactPersonName: 1,
          vReferenceBy: 1,
          vCustomerImage: 1,
          vMobile: 1,
          vGSTNO: 1,
          vCityId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "CustomerModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("CustomerModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
