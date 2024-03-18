import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})
  .min(1)
  .error((errors) => {
    errors.forEach((error) => {
      if (error.code === "object.min") {
        error.message = "Body must have at least one field";
      }
    });

    return errors;
  });
