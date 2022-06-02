const Joi = require("joi");

//update validate schema for fuel

const fuelUpdateSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N][0-9][0-9][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9]*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  fuel: Joi.string()
    .min(5)
    .regex(/[a-zA-Z]*/)
    .required(),
  quantity: Joi.number().positive().required(),
  fillingdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  vehicle_Id: Joi.optional(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  vinNumber: Joi.optional(),
});

//post validate schema for fuel

const fuelPostSchema = Joi.object({
  fuel: Joi.string()
    .min(5)
    .regex(/[a-zA-Z]*/)
    .required(),
  quantity: Joi.number().positive().required(),
  fillingdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  vehicle_Id: Joi.optional(),
});

module.exports = { fuelUpdateSchema, fuelPostSchema };
