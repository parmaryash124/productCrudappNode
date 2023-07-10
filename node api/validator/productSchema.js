const Joi = require("joi");
const productSchema = Joi.object({
  productName: Joi.string().required().messages({
    "any.required": `Product Name is a required field`,
  }),
  price: Joi.string().required().messages({
    "any.required": `Price is a required field`,
  }),
  qty: Joi.string().required().messages({
    "any.required": `Qty is a required field`,
  })
}).unknown(true);

module.exports = productSchema;
