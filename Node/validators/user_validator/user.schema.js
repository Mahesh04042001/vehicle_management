const Joi = require("joi");

//update validate schema for user

const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  username: Joi.string()
    .min(3)
    .regex(/([a-zA-Z].*[0-9])/)
    .required(),
  pwd: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
  mobile: Joi.string()
    .regex(/[789][0-9]{9}/)
    .max(10)
    .required(),
  dob: Joi.string()
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
});

module.exports = { userSchema };
