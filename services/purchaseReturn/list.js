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
      //tblpurchasereturnitems
      {
        $lookup: {
          from: "tblpurchasereturnitems",
          localField: "_id",
          foreignField: "vPReturnId",
          as: "purchaseReturnItemDetails",
        },
      },
      {
        $unwind: {
          path: "$purchaseReturnItemDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "purchaseReturnItemDetails.vStockId",
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
      //tblsuppliers
      {
        $lookup: {
          from: "tblsuppliers",
          localField: "vSupplierId",
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
          vPRId: { $first: "$vPRId" },
          dtBillDate: { $first: "$dtBillDate" },
          dtReturnDate: { $first: "$dtReturnDate" },
          iBillNumber: { $first: "$iBillNumber" },
          isSelectNote: { $first: "$isSelectNote" },
          vDebitNote: { $first: "$vDebitNote" },
          vCreditNote: { $first: "$vCreditNote" },
          vCreditImage: { $first: "$vCreditImage" },
          vDebitImage: { $first: "$vDebitImage" },
          vNotes: { $first: "$vNotes" },
          vSupplierId: { $first: "$vSupplierId" },
          vSupplierName: { $first: "$suppliersData.vContactPersonName" },
          vMobileNumber: { $first: "$suppliersData.vMobile" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          purchaseReturnDetails: {
            $push: {
              vPurchaseReturnItemId: "$purchaseReturnItemDetails._id",
              vStockId: "$purchaseReturnItemDetails.vStockId",
              iReturnQty: "$purchaseReturnItemDetails.iReturnQty",
              iOldReturnQty: "$purchaseReturnItemDetails.iOldReturnQty",
              dPurchaseRate: "$purchaseReturnItemDetails.dPurchaseRate",
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
          vPRId: 1,
          dtBillDate: 1,
          dtReturnDate: 1,
          iBillNumber: 1,
          isSelectNote: 1,
          vDebitNote: 1,
          vCreditNote: 1,
          vCreditImage: 1,
          vDebitImage: 1,
          vNotes: 1,
          vSupplierId: 1,
          vSupplierName: 1,
          vMobileNumber: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          purchaseReturnDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let purchaseReturnData = await dbService.aggregateData(
      "PurchaseReturnModel",
      aggregateQuery
    );

    return purchaseReturnData;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
