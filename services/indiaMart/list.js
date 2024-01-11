const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const indiaMartList = async (entry) => {
  try {
    let {
      body: {},
    } = entry;

    let filter = {
      isDeleted: false,
    };

    let getAllData = await dbService.findAllRecords("IndiaMartModel", filter);
    if (getAllData.length == 0) return [];

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
          vAddress: 1,
          vTraderOrUser: 1,
          vRemark: 1,
          arrIndiaMartImage: 1,
          vCityId: 1,
          dtCreatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "IndiaMartModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("IndiaMartModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = indiaMartList;
