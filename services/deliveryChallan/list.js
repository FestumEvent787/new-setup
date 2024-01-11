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
      //tbldeliverychallanitems
      {
        $lookup: {
          from: "tbldeliverychallanitems",
          localField: "_id",
          foreignField: "vDChallanId",
          as: "deliveryChallanItemDetails",
        },
      },
      {
        $unwind: {
          path: "$deliveryChallanItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "deliveryChallanItemDetails.vStockId",
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
      //tbltransports
      {
        $lookup: {
          from: "tbltransports",
          localField: "vTransportId",
          foreignField: "_id",
          as: "transportsData",
        },
      },
      {
        $unwind: {
          path: "$transportsData",
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
          vDCId: { $first: "$vDCId" },
          dtDeliveryChallanDate: { $first: "$dtDeliveryChallanDate" },
          iChallanNO: { $first: "$iChallanNO" },
          vChallanImage: { $first: "$vChallanImage" },
          vCustomerId: { $first: "$vCustomerId" },
          vCustomersName: { $first: "$customersData.vContactPersonName" },
          vMobileNumber: { $first: "$customersData.vMobile" },
          vTransportId: { $first: "$vTransportId" },
          vTransportationName: { $first: "$transportsData.vCompanyName" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          deliveryChallanDetails: {
            $push: {
              vDeliveryChallanItemId: "$deliveryChallanItemDetails._id",
              vStockId: "$deliveryChallanItemDetails.vStockId",
              iDeliverQty: "$deliveryChallanItemDetails.iDeliverQty",
              dGrsWeight: "$deliveryChallanItemDetails.dGrsWeight",
              dTareWeight: "$deliveryChallanItemDetails.dTareWeight",
              dNetWeight: "$deliveryChallanItemDetails.dNetWeight",
              dSalesRate: "$deliveryChallanItemDetails.dSalesRate",
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
          vDCId: 1,
          dtDeliveryChallanDate: 1,
          iChallanNO: 1,
          vChallanImage: 1,
          vCustomerId: 1,
          vCustomersName: 1,
          vMobileNumber: 1,
          vTransportId: 1,
          vTransportationName: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          deliveryChallanDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let deliveryChallanData = await dbService.aggregateData(
      "DeliveryChallanModel",
      aggregateQuery
    );

    return deliveryChallanData;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
