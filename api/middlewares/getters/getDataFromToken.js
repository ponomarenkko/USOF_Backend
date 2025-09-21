import jwt from "jsonwebtoken";
import ServerError from "../../errors/ServerError.js";

export default async (req, res, next) => {
	try {
	        // Проверяем подпись и срок действия токена
		req.token = jwt.verify(req.body.token, process.env.JWT_KEY);
	} catch (err) {
	        // Если токен недействителен или просрочен → возвращаем 401
		return next(new ServerError(`Invalid or expired token`, 401));
	}
	    // Если токен валиден → продолжаем выполнение
	next();
};
