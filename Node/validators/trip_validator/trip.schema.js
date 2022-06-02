const Joi = require("joi");

//update validate schema for trip

const tripUpdateSchema = Joi.object({
  vehiclenumber: Joi.string()
    .max(10)
    .regex(/[T][N]\d\d[A-Z][A-Z]\d\d\d\d\d*/)
    .required(),
  vehicletype: Joi.string()
    .min(3)
    .regex(/[a-zA-Z]*/)
    .required(),
  drivername: Joi.string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  from: Joi.string()
    .min(4)
    .regex(/[a-zA-Z]*/)
    .required(),
  to: Joi.string()
    .min(4)
    .regex(/[a-zA-Z]*/)
    .required(),
  date: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .required(),
  userId: Joi.optional(),
  driver_id: Joi.optional(),
  vehicle_id: Joi.optional(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  vinNumber: Joi.optional(),
  driname: Joi.optional(),
});

//post validate schema for trip

const tripPostSchema = Joi.object({
  from: Joi.string()
    .min(4)
    .regex(/[a-zA-Z]*/)
    .required(),
  to: Joi.string()
    .min(4)
    .regex(/[a-zA-Z]*/)
    .required(),
  date: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .required(),
  userId: Joi.optional(),
  driver_id: Joi.optional(),
  vehicle_id: Joi.optional(),
});

module.exports = { tripUpdateSchema, tripPostSchema };
