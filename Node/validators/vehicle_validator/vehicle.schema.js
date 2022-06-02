const Joi = require("joi");

//update validate schema for vehicle

const vehicleUpdateSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N][0-9][0-9][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9]*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  color: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  registerdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  chasisno: Joi.string()
    .regex(/[a-zA-Z0-9]*/)
    .required(),
  cost: Joi.number().positive().required(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  userId: Joi.optional(),
});

//post validate schema for vehicle

const vehiclePostSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N][0-9][0-9][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9]*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  color: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  registerdate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  chasisno: Joi.string()
    .regex(/[a-zA-Z0-9]*/)
    .required(),
  cost: Joi.number().positive().required(),
  userId: Joi.optional(),
});

module.exports = { vehicleUpdateSchema, vehiclePostSchema };
