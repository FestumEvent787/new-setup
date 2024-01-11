const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDeliveryDetails = async (entry) => {
  try {
    let {
      body: { vDChallanId },
    } = entry;

    let filter = {
      _id: new ObjectId(vDChallanId),
      isDeleted: false,
    };

    const deliveryChallanData = await dbService.findOneRecord(
      "DeliveryChallanModel",
      filter
    );

    if (!deliveryChallanData?._id) return [];

    let stockArrayId = [];
    let where = {
      vDChallanId: new ObjectId(vDChallanId),
      isDeleted: false,
    };

    let deliveryItemData = await dbService.findAllRecords(
      "DeliveryChallanItemModel",
      where
    );

    deliveryItemData.forEach((item) => {
      if (item?.vStockId && !stockArrayId.includes(item?.vStockId)) {
        stockArrayId.push(item?.vStockId);
      }
    });

    let condition = {
      vStockId: { $in: stockArrayId },
      isDeleted: false,
    };
    let stockData = await dbService.findAllRecords("StockModel", condition);

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(deliveryChallanData?.vCreatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(deliveryChallanData?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let transportData = await dbService.findOneRecord(
      "TransportModel",
      {
        _id: new ObjectId(deliveryChallanData?.vTransportId),
        isDeleted: false,
      },
      {
        _id: 1,
        vCompanyName: 1,
      }
    );

    let deliveryChallanItem = deliveryItemData
      .filter((detail) => detail?.vDCId === deliveryChallanData?.vDCId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        return {
          vDeliveryChallanItemId: detail._id,
          vDChallanId: detail?.vDChallanId,
          vDCId: detail?.vDCId,
          vStockId: detail?.vStockId,
          iDeliverQty: detail?.iDeliverQty,
          dGrsWeight: detail?.dGrsWeight,
          dTareWeight: detail?.dTareWeight,
          dNetWeight: detail?.dNetWeight,
          dSalesRate: detail?.dSalesRate,
          iTotalQty: stockDetails?.iTotalQty,
          vProductTypeId: stockDetails?.vProductTypeId,
          vProductQualityId: stockDetails?.vProductQualityId,
          vProductColorId: stockDetails?.vProductColorId,
          vProductDenierId: stockDetails?.vProductDenierId,
          vPackingId: stockDetails?.vPackingId,
        };
      });

    const deliveryChallanDetails = {
      _id: deliveryChallanData?._id,
      vSoId: deliveryChallanData?.vSoId,
      vDCId: deliveryChallanData?.vDCId,
      vCustomerName: customerData?.vContactPersonName,
      dtDeliveryChallanDate: deliveryChallanData?.dtDeliveryChallanDate,
      vTransportationName: transportData?.vCompanyName,
      iChallanNO: deliveryChallanData?.iChallanNO,
      vChallanImage: deliveryChallanData?.vChallanImage,
      vCreatedBy: deliveryChallanData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: deliveryChallanData?.dtCreatedAt,
      deliveryChallanItem,
    };

    return deliveryChallanDetails;
  } catch (error) {
    console.error("getDeliveryDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDeliveryDetails;
