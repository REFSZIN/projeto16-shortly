import joi from 'joi';

const schemaCadrasto = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).max(25).required(),
  password_confirmation: joi.any().valid(joi.ref('password')).required()
});
const schemaLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(25).required(),
});

export {schemaCadrasto,schemaLogin};