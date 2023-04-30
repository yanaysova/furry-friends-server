const petSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string" },
    adoptionStatus: { type: "string" },
    picture: { type: "string" },
    height: { type: "number" },
    weight: { type: "number" },
    color: { type: "string" },
    bio: { type: "string" },
    hypoallergnic: { type: "boolean" },
    dietery: { type: "array", items: { type: "string" } },
    breed: { type: "string" },
  },
  required: [
    "type",
    "name",
    "adoptionStatus",
    "height",
    "weight",
    "color",
    "hypoallergnic",
    "dietery",
    "breed",
  ],
  additionalProperties: false,
};

const userSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNum: { type: "string" },
  },
  required: ["email", "password", "firstName", "lastName", "phoneNum"],
  additionalProperties: false,
};

module.exports = {
  petSchema,
  userSchema,
};
