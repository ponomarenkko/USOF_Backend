import { body } from "express-validator";

export default [
  body(`categories`, `Categories is obligatory field`)
    .exists()
    .bail()
    .isArray({ min: 1, max: 50 })
    .withMessage(
      `Categories should be an array and have from 1 to 50 category ids`,
    ),
  body(`categories.*`, `Element of "categories" array must be integer`).isInt(),
];
