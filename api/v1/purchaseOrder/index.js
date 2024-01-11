const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./getDetails");

// SERVICES
const save = require("../../../services/purchaseOrder/save");
const list = require("../../../services/purchaseOrder/list");
const testList = require("../../../services/purchaseOrder/testList");
const getDetails = require("../../../services/purchaseOrder/getDetails");
const update = require("../../../services/purchaseOrder/update");
const deletePurchaseOrder = require("../../../services/purchaseOrder/delete");

router.post(
  "/details",
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: true,
    schemaValidate: saveSchema,
  })
);

router.get(
  "/details",
  commonResolver.bind({
    modelService: list,
    isRequestValidateRequired: false,
  })
);

router.get(
  "/testDetails",
  commonResolver.bind({
    modelService: testList,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.get(
  "/getDetails",
  commonResolver.bind({
    modelService: getDetails,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.put(
  "/details",
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deletePurchaseOrder,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
