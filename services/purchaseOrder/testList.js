const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const testList = async (entry) => {
  try {
    let {
      body: { vPOrderId },
    } = entry;

    let filter = {
      isDeleted: false,
      _id: new ObjectId(vPOrderId),
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblpurchaseorderitems
      {
        $lookup: {
          from: "tblpurchaseorderitems",
          localField: "_id",
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
      //tblstocks
      {
        $lookup: {
          from: "tblstocks",
          localField: "purchaseOrderItemDetails.vStockId",
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
      //tblpurchaseinwards
      {
        $lookup: {
          from: "tblpurchaseinwards",
          localField: "vPoId",
          foreignField: "vPoId",
          as: "purchaseInwardsDetails",
        },
      },
      {
        $unwind: {
          path: "$purchaseInwardsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblpurchaseinwarditems
      {
        $lookup: {
          from: "tblpurchaseinwarditems",
          localField: "purchaseInwardsDetails._id",
          foreignField: "vPInwardId",
          as: "purchaseInwardItemsDetails",
        },
      },
      {
        $unwind: {
          path: "$purchaseInwardItemsDetails",
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
          vPoId: { $first: "$vPoId" },
          isComplete: { $first: "$isComplete" },
          dtOrderDate: { $first: "$dtOrderDate" },
          dtExpDeliveryDate: { $first: "$dtExpDeliveryDate" },
          vSupplierId: { $first: "$vSupplierId" },
          vSupplierName: { $first: "$suppliersData.vContactPersonName" },
          vCreatedBy: { $first: "$vCreatedBy" },
          vCreatedByName: { $first: "$usersData.vName" },
          dtCreatedAt: { $first: "$dtCreatedAt" },
          // arrOrderReceiveDetails: {
          //   $push: {
          //     iReceiveQty: "$purchaseInwardItemsDetails.iReceiveQty",
          //     dtCreatedAt: "$purchaseInwardItemsDetails.dtCreatedAt",
          //   },
          // },
          purchaseOrderDetails: {
            $push: {
              vPurchaseOrderItemId: "$purchaseOrderItemDetails._id",
              vStockId: "$purchaseOrderItemDetails.vStockId",
              iQty: "$purchaseOrderItemDetails.iQty",
              dPurchaseRate: "$purchaseOrderItemDetails.dPurchaseRate",
              arrOrderReceiveDetails: {
                // $push: {
                iReceiveQty: "$purchaseInwardItemsDetails.iReceiveQty",
                dtCreatedAt: "$purchaseInwardItemsDetails.dtCreatedAt",
                // },
              },
              iTotalQty: "$stockDetails.iTotalQty",
              vProductTypeId: "$stockDetails.vProductTypeId",
              vProductQualityId: "$stockDetails.vProductQualityId",
              vProductColorId: "$stockDetails.vProductColorId",
              vProductDenierId: "$stockDetails.vProductDenierId",
              vPackingId: "$stockDetails.vPackingId",
              vNotes: "$stockDetails.vNotes",
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
          isComplete: 1,
          dtOrderDate: 1,
          dtExpDeliveryDate: 1,
          vSupplierId: 1,
          vSupplierName: 1,
          vCreatedBy: 1,
          vCreatedByName: 1,
          dtCreatedAt: 1,
          dtCreatedAt: 1,
          purchaseOrderDetails: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let result = await dbService.aggregateData(
      "PurchaseOrderModel",
      aggregateQuery
    );

    return result[0];
  } catch (error) {
    console.error("testListError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = testList;
