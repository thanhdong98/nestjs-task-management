import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required,
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(54321).required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
