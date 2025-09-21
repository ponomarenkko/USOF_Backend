import { header } from "express-validator";

const toBody = async (value, { req }) => {
	req.body.token = value;
};

export default [header(`token`).custom(toBody)];
