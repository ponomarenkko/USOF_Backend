import { body } from "express-validator";

export default [
	body(`timer`, `Timer is obligatory object`).exists(),
	body(`timer.days`)
		.default(1)
		.isInt({ min: 0 })
		.withMessage("Days must be more than 0"),
	body(`timer.hours`)
		.default(0)
		.isInt({ min: 0 })
		.withMessage("Hours must be more than 0"),
	body(`timer.minutes`)
		.default(0)
		.isInt({ min: 0 })
		.withMessage("Minutes must be more than 0"),
	body(`timer.seconds`)
		.default(0)
		.isInt({ min: 0 })
		.withMessage("Seconds must be more than 0"),
];
