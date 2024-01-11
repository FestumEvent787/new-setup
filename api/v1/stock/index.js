const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const router = new Router();

// SCHEMA
const totalStockSchema = require("./totalStock");

// SERVICES
const getTotalStock = require("../../../services/stock/getTotalStock");

router.get(
  "/details",
  commonResolver.bind({
    modelService: getTotalStock,
    isRequestValidateRequired: true,
    schemaValidate: totalStockSchema,
  })
);

module.exports = router;
