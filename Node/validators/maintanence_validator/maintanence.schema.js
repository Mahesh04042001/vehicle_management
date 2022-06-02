const Joi = require("joi");

//update validate schema for maintanence

const maintanenceUpdateSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N]\d\d[A-Z][A-Z]\d\d\d\d\d*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  date: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  description: Joi.string()
    .regex(/[a-zA-Z]*/)
    .required(),
  vehicle: Joi.optional(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  vinNumber: Joi.optional(),
});

//post validate schema for maintanence

const maintanencePostSchema = Joi.object({
  date: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .required(),
  cost: Joi.number().positive().required(),
  description: Joi.string()
    .regex(/[a-zA-Z]*/)
    .required(),
  vehicle: Joi.optional(),
});

module.exports = { maintanenceUpdateSchema, maintanencePostSchema };
