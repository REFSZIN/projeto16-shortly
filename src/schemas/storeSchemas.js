import joi from 'joi';

const schemaCart = joi.object({
  product: joi.object().required(),
  email: joi.string().email().required(),
});

const schemaCheckout = joi.object({
  email: joi.string().email().required(),
  cep: joi.string().required(),
  number: joi.string().required(),
  state: joi.string().required(),
  district: joi.string().required(),
  city: joi.string().required(),
  payMethod: joi.string().required(),
  request: joi.object().required(),
  price: joi.number().required(),
});

export {schemaCheckout,schemaCart};