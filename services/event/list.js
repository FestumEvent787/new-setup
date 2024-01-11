const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const moment = require("moment");

const list = async (entry) => {
  try {
    let {
      body: { vEventType, vEventTitle, vEventStartDate, vEventEndDate },
    } = entry;

    let filter = {
      isDeleted: false,
    };

    let date = moment().format("YYYY-MM-DD");
    let currentDate = Date.parse(date);

    if (vEventType == "complete") {
      filter["dtEnd"] = { $lt: currentDate };
    } else if (vEventType == "live") {
      filter["dtStart"] = { $lte: currentDate };
      filter["dtEnd"] = { $gte: currentDate };
    } else if (vEventType == "upcoming") {
      filter["dtStart"] = { $gt: currentDate };
    }

    if (vEventTitle) {
      var regex = new RegExp(vEventTitle, "i");
      filter["$or"] = [{ vTitle: regex }];
    }

    if (vEventStartDate) {
      filter = {
        ...filter,
        dtStart: { $gte: Date.parse(vEventStartDate) },
      };
    }

    if (vEventEndDate) {
      filter = {
        ...filter,
        dtEnd: { $lte: Date.parse(vEventEndDate) },
      };
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vTitle: 1,
          dtStart: 1,
          dtEnd: 1,
          vAddress: 1,
          vCityId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData("EventModel", aggregateQuery);
    let totalCount = await dbService.recordsCount("EventModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
