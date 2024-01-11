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
      //tblpurchaseinwarditems
      {
        $lookup: {
          from: "tblpurchaseinwarditems",
          localField: "_id",
          foreignField: "vPInwardId",
          as: "purchaseInwardItemDetails",
        },
      },
      {
        $unwind: {
          path: "$purchaseInwardItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "purchaseInwardItemDetails.vStockId",
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
      //tblpurchaseorders
      {
        $lookup: {
          from: "tblpurchaseorders",
          localField: "vPoId",
          foreignField: "vPoId",
          as: "purchaseordersData",
        },
      },
      {
        $unwind: {
          path: "$purchaseordersData",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblpurchaseorderitems
      {
        $lookup: {
          from: "tblpurchaseorderitems",
          localField: "purchaseordersData._id",
          foreignField: "vPOrderId",
          as: "purchaseOrderItemDetails",
        },
      },
      {
        $unwind: {
          path: "$purchaseOrderItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblsuppliers
      {
        $lookup: {
          from: "tblsuppliers",
          localField: "purchaseordersData.vSupplierId",
          foreignField: "_id",
          as: "suppliersData",
        },
      },
      {
        $unwind: {
          path: "$suppliersData",
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
          vPoId: { $first: "$vPoId" },
          dtChallanDate: { $first: "$dtChallanDate" },
          vTransportationName: { $first: "$vTransportationName" },
          iChallanNO: { $first: "$iChallanNO" },
          iLRNO: { $first: "$iLRNO" },
          iInvoiceNo: { $first: "$iInvoiceNo" },
          iEWayBill: { $first: "$iEWayBill" },
          vChallanImage: { $first: "$vChallanImage" },
          vLRImage: { $first: "$vLRImage" },
          vInvoiceImage: { $first: "$vInvoiceImage" },
          vEWayBillImage: { $first: "$vEWayBillImage" },
          vNotes: { $first: "$vNotes" },
          vSupplierId: { $first: "$vSupplierId" },
          vSupplierName: { $first: "$suppliersData.vContactPersonName" },
          vMobileNumber: { $first: "$suppliersData.vMobile" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          purchaseInwardDetails: {
            $push: {
              vPurchaseInwardItemId: "$purchaseInwardItemDetails._id",
              vPInwardId: "$purchaseInwardItemDetails.vPInwardId",
              vPInId: "$purchaseInwardItemDetails.vPInId",
              vStockId: "$purchaseInwardItemDetails.vStockId",
              totalOrderQty: "$purchaseOrderItemDetails.iQty",
              dPurchaseRate: "$purchaseInwardItemDetails.dPurchaseRate",
              iReceiveQty: "$purchaseInwardItemDetails.iReceiveQty",
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
          vPoId: 1,
          dtChallanDate: 1,
          vTransportationName: 1,
          iChallanNO: 1,
          iLRNO: 1,
          iInvoiceNo: 1,
          iEWayBill: 1,
          vChallanImage: 1,
          vLRImage: 1,
          vInvoiceImage: 1,
          vEWayBillImage: 1,
          vNotes: 1,
          vSupplierId: 1,
          vSupplierName: 1,
          vMobileNumber: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          purchaseInwardDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let purchaseInwardListData = await dbService.aggregateData(
      "PurchaseInwardModel",
      aggregateQuery
    );

    return purchaseInwardListData;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
