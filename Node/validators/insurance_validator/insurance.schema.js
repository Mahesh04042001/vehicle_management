const Joi = require("joi");

//update validate schema for insurance

const insuranceUpdateSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N][0-9][0-9][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9]*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  company: Joi.string()
    .regex(/[a-zA-Z]*/)
    .required(),
  startdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  enddate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  vehicle: Joi.optional(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  vinNumber: Joi.optional(),
});

//post validate schema for insurance

const insurancePostSchema = Joi.object({
  company: Joi.string()
    .regex(/[a-zA-Z]*/)
    .required(),
  startdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  enddate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  vehicle: Joi.optional(),
});

module.exports = { insuranceUpdateSchema, insurancePostSchema };