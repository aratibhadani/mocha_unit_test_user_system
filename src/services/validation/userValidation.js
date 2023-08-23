const Joi = require("joi");
const Helper = require("../Helper");
const Response = require("../Response");

module.exports = {
    userSignUpValidation: (req, res, callback) => {
      const schema = Joi.object({
        firstName: Joi.string().max(20).required().trim(),
        lastName: Joi.string().max(20).required().trim(),
        email: Joi.string().max(50).email().required().trim()        
      });
      const { error } = schema.validate(req);
      if (error) {
        return Response.validationErrorResponseData(
          res,
          Helper.validationMessageKey("userSignUpValidation", error)
        );
      }
  
      return callback(true);
    },
}