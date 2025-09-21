import { query } from "express-validator";
import splitQuery from "../../utils/splitQuery.js";

const toBody = async (logins, { req }) => {
	req.body.logins = logins;
};

export default [
	query(`logins`)
		.exists()
		.bail()
		.customSanitizer(splitQuery)
		.isArray({ min: 1, max: 50 })
		.withMessage(`Logins should be an array and have from 1 to 50 logins`)
		.custom(toBody),
];
