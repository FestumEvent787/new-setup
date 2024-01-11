const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const stockWiseReport = async (entry) => {
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
      vProductTypeId: new ObjectId(vProductTypeId),
      vProductQualityId: new ObjectId(vProductQualityId),
      vProductColorId: new ObjectId(vProductColorId),
      vProductDenierId: new ObjectId(vProductDenierId),
      vPackingId: new ObjectId(vPackingId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblproducttypes
      {
        $lookup: {
          from: "tblproducttypes",
          localField: "vProductTypeId",
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
          localField: "vProductQualityId",
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
          localField: "vProductColorId",
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
          localField: "vProductDenierId",
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
          localField: "vPackingId",
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
          iTotalQty: 1,
          vProductTypeName: "$productTypes.vName",
          vProductQualityName: "$productQualities.vName",
          vProductColorName: "$productColors.vName",
          vProductDenierName: "$productDeniers.vName",
          vPackingName: "$packings.vName",
        },
      },
      { $sort: { iTotalQty: -1 } },
    ];
    let dataList = await dbService.aggregateData("StockModel", aggregateQuery);
    let result = [];
    dataList.forEach((element) => {
      if (element?.iTotalQty) {
        result.push(element);
      }
    });

    return { data: result, iCount: result?.length };
  } catch (error) {
    console.error("stockWiseReportError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = stockWiseReport;
