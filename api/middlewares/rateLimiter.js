import { rateLimit } from "express-rate-limit";

export default rateLimit({
	windowMs: 10 * 1000,
	max: 100,
	standardHeaders: "draft-7",
	legacyHeaders: false,
});
