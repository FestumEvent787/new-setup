const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const list = async (entry) => {
  try {
    let {
      body: {},
    } = entry;

    let filter = {
      isDeleted: false,
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblevents
      {
        $lookup: {
          from: "tblevents",
          localField: "vEventId",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: {
          path: "$eventDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vEventName: "$eventDetails?.vTitle",
          vName: 1,
          dtVisit: 1,
          vMobile1: 1,
          vMobile2: 1,
          vCompanyName: 1,
          objEngagesMachine: 1,
          objDealingIn: 1,
          vSampleRequire: 1,
          vRemarks: 1,
          vRepresentedName: 1,
          arrVisitingCardImage: 1,
          vCityId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "VisitorModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("VisitorModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
