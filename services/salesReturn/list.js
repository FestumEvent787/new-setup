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
      //tblsalesreturnitems
      {
        $lookup: {
          from: "tblsalesreturnitems",
          localField: "_id",
          foreignField: "vSReturnId",
          as: "salesReturnItemDetails",
        },
      },
      {
        $unwind: {
          path: "$salesReturnItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "salesReturnItemDetails.vStockId",
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
      //tblusers
      {
        $lookup: {
          from: "tblusers",
          localField: "vCreatedBy",
          foreignField: "_id",
          as: "usersData",
        },
      },
      {
        $unwind: {
          path: "$usersData",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblcustomers
      {
        $lookup: {
          from: "tblcustomers",
          localField: "vCustomerId",
          foreignField: "_id",
          as: "customersData",
        },
      },
      {
        $unwind: {
          path: "$customersData",
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
        $group: {
          _id: "$_id",
          vSRId: { $first: "$vSRId" },
          isComplete: { $first: "$isComplete" },
          iDeliveryChallan: { $first: "$iDeliveryChallan" },
          dtBillDate: { $first: "$dtBillDate" },
          dtReturnDate: { $first: "$dtReturnDate" },
          iBillNumber: { $first: "$iBillNumber" },
          iLRNumber: { $first: "$iLRNumber" },
          vNotes: { $first: "$vNotes" },
          vCustomerId: { $first: "$vCustomerId" },
          vCustomersName: { $first: "$customersData.vContactPersonName" },
          vMobileNumber: { $first: "$customersData.vMobile" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          salesReturnDetails: {
            $push: {
              vSalesReturnItemId: "$salesReturnItemDetails._id",
              vStockId: "$salesReturnItemDetails.vStockId",
              iReturnQty: "$salesReturnItemDetails.iReturnQty",
              iOldReturnQty: "$salesReturnItemDetails.iOldReturnQty",
              dSalesRate: "$salesReturnItemDetails.dSalesRate",
              iTotalQty: "$stockDetails.iTotalQty",
              vProductTypeId: "$stockDetails.vProductTypeId",
              vProductQualityId: "$stockDetails.vProductQualityId",
              vProductColorId: "$stockDetails.vProductColorId",
              vProductDenierId: "$stockDetails.vProductDenierId",
              vPackingId: "$stockDetails.vPackingId",
              vStockNotes: "$stockDetails.vNotes",
              vProductTypeName: "$productTypes.vName",
              vProductQualityName: "$productQualities.vName",
              vProductColorName: "$productColors.vName",
              vProductDenierName: "$productDeniers.vName",
              vPackingName: "$packings.vName",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          vSRId: 1,
          iDeliveryChallan: 1,
          dtBillDate: 1,
          dtReturnDate: 1,
          iBillNumber: 1,
          iLRNumber: 1,
          vNotes: 1,
          vCustomerId: 1,
          vCustomersName: 1,
          vMobileNumber: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          salesReturnDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let salesReturnData = await dbService.aggregateData(
      "SalesReturnModel",
      aggregateQuery
    );

    return salesReturnData;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
