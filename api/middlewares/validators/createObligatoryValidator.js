import { body } from "express-validator";

export default (field, fieldName, method = body) => {
	const toBody = async (value, { req }) => {
		req.body[field] = value;
	};

	if (!fieldName)
		fieldName =
			field.slice(0, 1).toUpperCase() + field.slice(1).toLowerCase();

	return method(field, `${fieldName} is obligatory field`)
		.exists()
		.bail()
		.trim()
		.notEmpty()
		.custom(toBody)
		.escape();
};
