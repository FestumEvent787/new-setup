const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const productWiseReport = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vStartDate,
        vEndDate,
        vProductTypeId,
        vProductQualityId,
        vProductColorId,
        vProductDenierId,
        vPackingId,
      },
    } = entry;

    let filter = {
      isDeleted: false,
      dtCreatedAt: { $lte: Date.parse(vEndDate), $gte: Date.parse(vStartDate) },
    };

    if (vProductTypeId) {
      filter["vProductTypeId"] = new ObjectId(vProductTypeId);
    } else if (vProductQualityId) {
      filter["vProductQualityId"] = new ObjectId(vProductQualityId);
    } else if (vProductColorId) {
      filter["vProductColorId"] = new ObjectId(vProductColorId);
    } else if (vProductDenierId) {
      filter["vProductDenierId"] = new ObjectId(vProductDenierId);
    } else if (vPackingId) {
      filter["vPackingId"] = new ObjectId(vPackingId);
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblsalesorderitems
      {
        $lookup: {
          from: "tblsalesorderitems",
          localField: "vStockId",
          foreignField: "vStockId",
          as: "salesOrderDetails",
        },
      },
      {
        $unwind: {
          path: "$salesOrderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          dtCreatedAt: 1,
          iTotalSales: "$salesOrderDetails.iSalesQty",
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData("StockModel", aggregateQuery);
    let result = [];
    dataList.forEach((element) => {
      if (element?.iTotalSales) {
        result.push(element);
      }
    });

    return { data: result, iCount: result?.length };
  } catch (error) {
    console.error("productWiseReportError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = productWiseReport;
