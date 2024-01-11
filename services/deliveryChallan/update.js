const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vDChallanId,
        vCustomerId,
        dtDeliveryChallanDate,
        iChallanNO,
        vTransportId,
        vChallanLinkImage = "",
        arrDeliveryChallanItem = [],
      },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vDChallanId),
      isDeleted: false,
    };

    let deliveryChallanData = await dbService.findOneRecord(
      "DeliveryChallanModel",
      condition
    );
    if (!deliveryChallanData?._id) throw new Error(Message.recordNotFound);

    let challanUrlImage = vChallanLinkImage;
    if (Object.keys(file).length > 0) {
      challanUrlImage = await imageUpload(file);
    }

    let updateDeliveryChallanResponse = await dbService.findOneAndUpdateRecord(
      "DeliveryChallanModel",
      condition,
      {
        vCustomerId: new ObjectId(vCustomerId),
        vTransportId: new ObjectId(vTransportId),
        dtDeliveryChallanDate: Date.parse(dtDeliveryChallanDate),
        iChallanNO: Number(iChallanNO),
        vChallanImage: challanUrlImage,
        isUpdated: true,
        dtUpdatedAt: Date.now(),
        vUpdatedBy: new ObjectId(userId),
      },
      {
        returnOriginal: false,
      }
    );
    if (!updateDeliveryChallanResponse) throw new Error(Message.systemError);

    let where = {
      vDChallanId: new ObjectId(vDChallanId),
      isDeleted: false,
    };
    let deliveryChallanItemData = await dbService.findAllRecords(
      "DeliveryChallanItemModel",
      where
    );

    let deliveryItemId = [];
    deliveryChallanItemData.forEach((item) => {
      if (item?.vStockId) {
        deliveryItemId.push({
          deliveryChallanItemId: item?._id,
          deliveryChallanStock: item?.vStockId,
        });
      }
    });

    if (arrDeliveryChallanItem.length > 0) {
      arrDeliveryChallanItem.forEach((element) => {
        deliveryItemId.forEach((data) => {
          let deliveryChallanItemObj = {};
          let stockObj = {
            vProductTypeId: new ObjectId(element?.vProductTypeId),
            vProductQualityId: new ObjectId(element?.vProductQualityId),
            vProductColorId: new ObjectId(element?.vProductColorId),
            vProductDenierId: new ObjectId(element?.vProductDenierId),
            vPackingId: new ObjectId(element?.vPackingId),
            vNotes: element?.vNotes ? element?.vNotes : "",
          };
          if (
            element?.vStockId.toString() ==
            data?.deliveryChallanStock.toString()
          ) {
            deliveryChallanItemObj = {
              iDeliverQty: element?.iDeliverQty,
              dGrsWeight: element?.dGrsWeight,
              dTareWeight: element?.dTareWeight,
              dNetWeight: element?.dNetWeight,
              dSalesRate: element?.dSalesRate,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };

            if (deliveryChallanData?.iDeliverQty > element?.iDeliverQty) {
              let total =
                deliveryChallanData?.iDeliverQty - element?.iDeliverQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: total },
              };
            } else if (
              deliveryChallanData?.iDeliverQty < element?.iDeliverQty
            ) {
              let total =
                element?.iDeliverQty - deliveryChallanData?.iDeliverQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: -total },
              };
            }

            dbService.findOneAndUpdateRecord(
              "DeliveryChallanItemModel",
              {
                _id: new ObjectId(data?.deliveryChallanItemId),
              },
              deliveryChallanItemObj,
              {
                returnOriginal: false,
              }
            );

            dbService.findOneAndUpdateRecord(
              "StockModel",
              {
                vStockId: element?.vStockId,
              },
              stockObj,
              {
                returnOriginal: false,
              }
            );
          }
        });
      });
    }

    const result = {
      _id: deliveryChallanData?._id,
      vDCId: deliveryChallanData?.vDCId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
