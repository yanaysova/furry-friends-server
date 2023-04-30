const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);

const validateBody = (schema) => {
  return (req, res, next) => {
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      console.log(ajv.errors);
      return res.status(400).send(ajv.errors[0]);
    }
    next();
  };
};

module.exports = {
  validateBody,
};
