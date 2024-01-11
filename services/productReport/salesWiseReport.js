const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const salesWiseReport = async (entry) => {
  try {
    let {
      body: { vStartDate, vEndDate, vCustomerId },
    } = entry;

    let filter = {
      isDeleted: false,
    };

    if (vStartDate && vEndDate) {
      filter[" dtOrderDate"] = {
        $lte: Date.parse(vEndDate),
        $gte: Date.parse(vStartDate),
      };
    }

    if (vCustomerId) {
      filter["vCustomerId"] = new ObjectId(vCustomerId);
    }

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblsalesorderitems
      {
        $lookup: {
          from: "tblsalesorderitems",
          localField: "_id",
          foreignField: "vSOrderId",
          as: "salesOrderData",
        },
      },
      {
        $unwind: {
          path: "$salesOrderData",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "salesOrderData.vStockId",
          foreignField: "vStockId",
          as: "stockDetails",
        },
      },
      {
        $unwind: {
          path: "$stockDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblproducttypes
      {
        $lookup: {
          from: "tblproducttypes",
          localField: "stockDetails.vProductTypeId",
          foreignField: "_id",
          as: "productTypes",
        },
      },
      {
        $unwind: {
          path: "$productTypes",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblproductqualities
      {
        $lookup: {
          from: "tblproductqualities",
          localField: "stockDetails.vProductQualityId",
          foreignField: "_id",
          as: "productQualities",
        },
      },
      {
        $unwind: {
          path: "$productQualities",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblproductcolors
      {
        $lookup: {
          from: "tblproductcolors",
          localField: "stockDetails.vProductColorId",
          foreignField: "_id",
          as: "productColors",
        },
      },
      {
        $unwind: {
          path: "$productColors",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblproductdeniers
      {
        $lookup: {
          from: "tblproductdeniers",
          localField: "stockDetails.vProductDenierId",
          foreignField: "_id",
          as: "productDeniers",
        },
      },
      {
        $unwind: {
          path: "$productDeniers",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblpackings
      {
        $lookup: {
          from: "tblpackings",
          localField: "stockDetails.vPackingId",
          foreignField: "_id",
          as: "packings",
        },
      },
      {
        $unwind: {
          path: "$packings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          iTotalSales: "$salesOrderData.iSalesQty",
          vProductTypeId: "$stockDetails.vProductTypeId",
          vProductQualityId: "$stockDetails.vProductQualityId",
          vProductColorId: "$stockDetails.vProductColorId",
          vProductDenierId: "$stockDetails.vProductDenierId",
          vPackingId: "$stockDetails.vPackingId",
          vProductTypeName: "$productTypes.vName",
          vProductQualityName: "$productQualities.vName",
          vProductColorName: "$productColors.vName",
          vProductDenierName: "$productDeniers.vName",
          vPackingName: "$packings.vName",
        },
      },
      { $sort: { iTotalSales: -1 } },
    ];

    let dataList = await dbService.aggregateData(
      "SalesOrderModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("SalesOrderModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("salesWiseReportError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = salesWiseReport;
