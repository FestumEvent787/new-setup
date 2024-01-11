const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const moment = require("moment");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSoId,
        vCustomerId,
        dtDeliveryChallanDate,
        iChallanNO,
        vTransportId,
        arrDeliveryChallanItem = [],
      },
      file,
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");

    const deliveryCount = await dbService.recordsCount("DeliveryChallanModel", {
      isDeleted: false,
      dtCreatedAt: { $gte: Date.parse(currentDate) },
    });
    let totalData = deliveryCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const deliveryChallanNumber = "DC" + todayDate.concat(formattedNumber);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let deliveryChallanItemArray = [];
    if (arrDeliveryChallanItem.length > 0) {
      arrDeliveryChallanItem.forEach((element) => {
        const matchingStockItem = stockData.find((stockItem) => {
          return (
            stockItem.vProductTypeId.toString() ===
              element.vProductTypeId.toString() &&
            stockItem.vProductQualityId.toString() ===
              element.vProductQualityId.toString() &&
            stockItem.vProductColorId.toString() ===
              element.vProductColorId.toString() &&
            stockItem.vProductDenierId.toString() ===
              element.vProductDenierId.toString() &&
            stockItem.vPackingId.toString() === element.vPackingId.toString()
          );
        });
        if (matchingStockItem) {
          let stockObj = {
            $inc: { iTotalQty: -element?.iDeliverQty },
            vNotes: element?.vNotes ? element?.vNotes : "",
          };

          let deliveryChallanItemObj = {
            vDCId: deliveryChallanNumber,
            vStockId: matchingStockItem?.vStockId,
            iDeliverQty: element?.iDeliverQty,
            dGrsWeight: element?.dGrsWeight,
            dTareWeight: element?.dTareWeight,
            dNetWeight: element?.dNetWeight,
            dSalesRate: element?.dSalesRate,
            vCreatedBy: new ObjectId(userId),
            dtCreatedAt: Date.now(),
          };

          dbService.findOneAndUpdateRecord(
            "StockModel",
            {
              vStockId: matchingStockItem?.vStockId,
            },
            stockObj,
            {
              returnOriginal: false,
            }
          );

          dbService.findOneAndUpdateRecord(
            "SalesOrderItemModel",
            {
              vStockId: matchingStockItem?.vStockId,
            },
            { $inc: { iTotalSalesCount: element?.iDeliverQty } },
            {
              returnOriginal: false,
            }
          );

          deliveryChallanItemArray.push(deliveryChallanItemObj);
        } else {
          throw new Error("This Stock is Not Exit");
        }
      });
    }

    let challanUrlImage = "";
    if (Object.keys(file).length > 0) {
      challanUrlImage = await imageUpload(file);
    }

    let deliveryChallanSave = {
      vSoId,
      vDCId: deliveryChallanNumber,
      vCustomerId: new ObjectId(vCustomerId),
      vTransportId: new ObjectId(vTransportId),
      dtDeliveryChallanDate: Date.parse(dtDeliveryChallanDate),
      iChallanNO: Number(iChallanNO),
      vChallanImage: challanUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };
    const saveDeliveryChallanData = await dbService.createOneRecord(
      "DeliveryChallanModel",
      deliveryChallanSave
    );
    if (!saveDeliveryChallanData) throw new Error(Message.systemError);

    let deliveryChallanDetailsArray = [];
    deliveryChallanItemArray.forEach((item) => {
      if (item) {
        let obj = {
          ...item,
          vDChallanId: new ObjectId(saveDeliveryChallanData?._id),
        };
        deliveryChallanDetailsArray.push(obj);
      }
    });

    if (deliveryChallanDetailsArray.length > 0) {
      var saveDeliveryChallanItemData = await dbService.createManyRecords(
        "DeliveryChallanItemModel",
        deliveryChallanDetailsArray
      );
      if (!saveDeliveryChallanItemData) throw new Error(Message.systemError);
    }

    let salesOrderComplete = true;
    let getAllSalesOrderItem = await dbService.findAllRecords(
      "SalesOrderItemModel",
      {
        isDeleted: false,
        vSoId: saveDeliveryChallanData?.vSoId,
      },
      { vStockId: 1, iSalesQty: 1, iTotalSalesCount: 1 }
    );

    for (let i = 0; i < getAllSalesOrderItem.length; i++) {
      const soItem = getAllSalesOrderItem[i];
      if (!soItem || soItem?.iSalesQty > soItem?.iTotalSalesCount) {
        salesOrderComplete = false;
        break;
      }
    }

    if (salesOrderComplete) {
      dbService.findOneAndUpdateRecord(
        "SalesOrderModel",
        {
          vSoId: saveDeliveryChallanData?.vSoId,
        },
        { isComplete: true },
        {
          returnOriginal: false,
        }
      );
    }

    let deliveryChallanDetails = {
      _id: saveDeliveryChallanData?._id,
      vDCId: saveDeliveryChallanData?.vDCId,
    };

    return deliveryChallanDetails;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
