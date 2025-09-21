import { query } from "express-validator";
import splitQuery from "../../utils/splitQuery.js";
import splitQueryParams from "../../utils/splitQueryParams.js";
import textToMySqlRegex from "../../utils/textToMySqlRegex.js";
import { text } from "express";

const avaliableParams = [
	`nocomments`,
	`categories`,
	`admins`,
	`users`,
	`search`,
];

const queryArrToFilterParams = async (queryArr, { req }) => {
	const filterSettings = {};

	if (!queryArr) return true;

	queryArr.forEach((fullParam) => {
		let [param, values] = splitQueryParams(fullParam);

		if (avaliableParams.indexOf(param) === -1)
			throw new Error(
				`Filtering parameter (${param}) doesn't valid. Available filtering parameters: [${avaliableParams}]`,
			);
		if (param === `categories`)
			values = values.split(`,`).map((value) => parseInt(value));
		if (param === `search`)
			values = {
				strict: textToMySqlRegex.strict(values),
				soft: textToMySqlRegex.soft(values),
			};

		filterSettings[param] = values;
	});
	req.body.filter = filterSettings;

	return true;
};

export default [
	query(`filter`).customSanitizer(splitQuery).custom(queryArrToFilterParams),
];
