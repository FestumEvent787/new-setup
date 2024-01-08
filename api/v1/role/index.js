import { Router } from "express";
import commonResolver from "../../../utils/commonResolver";

const router = new Router();

// SCHEMA
import { saveSchema } from "./save";

// SERVICES
import { save } from "../../../services/role/save";
import { list } from "../../../services/role/list";

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

export default router;
