import { query } from "express-validator";
import splitQuery from "../../utils/splitQuery.js";

const toBody = async (ids, { req }) => {
	req.body.ids = ids;
};

export default [
	query(`ids`, `Ids is obligatory field`)
		.exists()
		.bail()
		.customSanitizer(splitQuery)
		.isArray({ min: 1, max: 50 })
		.withMessage(`Ids should be an array and have from 1 to 50`)
		.custom(toBody),
	query(`ids.*`, `Element of "ids" array must be integer`).isInt(),
];
