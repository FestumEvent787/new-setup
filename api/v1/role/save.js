import { Joi } from "../../../utils/schemaValidate";

export const saveSchema = Joi.object({
  vName: Joi.string().required().label("Role Name"),
});
