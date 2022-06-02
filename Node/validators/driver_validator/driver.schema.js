const Joi = require("joi");

//update validate schema for driver
const driverUpdateSchema = Joi.object({
  drivername: Joi.string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  mobile: Joi.string()
    .regex(/[789][0-9]{9}/)
    .max(10)
    .required(),
  licencenumber: Joi.string()
    .max(15)
    .regex(/[T][N][a-zA-Z0-9]*/)
    .required(),
  licenceenddate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  city: Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .required(),
  state: Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .required(),
  _id: Joi.optional(),
  _rev: Joi.optional(),
  userId: Joi.optional(),
});

const driverPostSchema = Joi.object({
  drivername: Joi.string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  mobile: Joi.string()
    .regex(/[789][0-9]{9}/)
    .max(10)
    .required(),
  licencenumber: Joi.string()
    .max(15)
    .regex(/[T][N][a-zA-Z0-9]*/)
    .required(),
  licenceenddate: Joi.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required(),
  city: Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .required(),
  state: Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .required(),
  userId: Joi.optional(),
});

module.exports = { driverUpdateSchema, driverPostSchema };
