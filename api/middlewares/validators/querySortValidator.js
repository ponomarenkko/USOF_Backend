import { query } from "express-validator";
import splitQuery from "../../utils/splitQuery.js";
import splitQueryParams from "../../utils/splitQueryParams.js";

const avaliableParams = [`rating`, `name`, `date`];

const queryArrToSortParams = async (queryArr, { req }) => {
	const sortSettings = {};

	if (!queryArr) return true;

	queryArr.forEach((fullParam) => {
		const [param, order] = splitQueryParams(fullParam);
		console.log([param, order]);

		if (avaliableParams.indexOf(param) === -1)
			throw new Error(
				`Sorting parameter (${param}) doesn't valid. Available sorting parameters: [${avaliableParams}]`,
			);

		sortSettings[param] = {
			isAscending: order === `asc`,
		};
	});
	req.body.sort = sortSettings;

	return true;
};

export default [
	query(`sort`).customSanitizer(splitQuery).custom(queryArrToSortParams),
];
