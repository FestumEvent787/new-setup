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
      //tblsalesorderitems
      {
        $lookup: {
          from: "tblsalesorderitems",
          localField: "vSoId",
          foreignField: "vSoId",
          as: "salesOrderItemDetails",
        },
      },
      {
        $unwind: {
          path: "$salesOrderItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "salesOrderItemDetails.vStockId",
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
          vSoId: { $first: "$vSoId" },
          isComplete: { $first: "$isComplete" },
          dtOrderDate: { $first: "$dtOrderDate" },
          dtExpDeliveryDate: { $first: "$dtExpDeliveryDate" },
          vCustomerId: { $first: "$vCustomerId" },
          vCustomersName: { $first: "$customersData.vContactPersonName" },
          vMobileNumber: { $first: "$customersData.vMobile" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          salesOrderDetails: {
            $push: {
              vSalesOrderItemId: "$salesOrderItemDetails._id",
              vStockId: "$salesOrderItemDetails.vStockId",
              iSalesQty: "$salesOrderItemDetails.iSalesQty",
              dSalesRate: "$salesOrderItemDetails.dSalesRate",
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
          vSoId: 1,
          isComplete: 1,
          dtOrderDate: 1,
          dtExpDeliveryDate: 1,
          vCustomerId: 1,
          vCustomersName: 1,
          vMobileNumber: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          salesOrderDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let salesOrderData = await dbService.aggregateData(
      "SalesOrderModel",
      aggregateQuery
    );

    return salesOrderData;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
