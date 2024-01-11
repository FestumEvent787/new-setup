const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");

const homeList = async (entry) => {
  try {
    let {
      body: { vFilterDate = "" },
    } = entry;

    let orderFilter = {
      isDeleted: false,
    };
    let returnFilter = {
      isDeleted: false,
    };
    let deliveryFilter = {
      isDeleted: false,
    };
    let purchaseInwardFilter = {
      isDeleted: false,
    };

    if (vFilterDate) {
      orderFilter["dtOrderDate"] = {
        $lte: Date.parse(vFilterDate),
        $gte: Date.parse(vFilterDate),
      };
      returnFilter["dtReturnDate"] = {
        $lte: Date.parse(vFilterDate),
        $gte: Date.parse(vFilterDate),
      };
      deliveryFilter["dtDeliveryChallanDate"] = {
        $lte: Date.parse(vFilterDate),
        $gte: Date.parse(vFilterDate),
      };
      purchaseInwardFilter["dtChallanDate"] = {
        $lte: Date.parse(vFilterDate),
        $gte: Date.parse(vFilterDate),
      };
    }

    let salesOrderCount = await dbService.recordsCount(
      "SalesOrderModel",
      orderFilter
    );
    let deliveryCount = await dbService.recordsCount(
      "DeliveryChallanModel",
      deliveryFilter
    );
    let salesOrderReturnCount = await dbService.recordsCount(
      "SalesReturnModel",
      returnFilter
    );
    let purchaseOrderCount = await dbService.recordsCount(
      "PurchaseOrderModel",
      orderFilter
    );
    let purchaseInwardCount = await dbService.recordsCount(
      "PurchaseInwardModel",
      purchaseInwardFilter
    );
    let purchaseOrderReturnCount = await dbService.recordsCount(
      "PurchaseReturnModel",
      returnFilter
    );

    let result = {
      salesOrder: salesOrderCount,
      salesDelivery: deliveryCount,
      salesInvoice: 0,
      salesReturn: salesOrderReturnCount,
      purchaseOrder: purchaseOrderCount,
      purchaseInward: purchaseInwardCount,
      purchaseOrderReturn: purchaseOrderReturnCount,
      pendingPackage: 0,
      completePackage: 0,
    };

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = homeList;
