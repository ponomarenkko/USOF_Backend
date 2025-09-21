import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;
export default function getUsersByLogins(req, res, next) {
	sequelize
		.inTransaction(async (transaction) => {
			// Ищем всех пользователей, у которых login входит в массив
			return await models.User.findAll({
				where: { login: req.body.logins },
				transaction,
			});
		})
		.then((users) => {
			if (!users || users.length === 0)
				return next(new ServerError(`Users not found`, 404));

			// Пробрасываем найденных пользователей в req
			req.users = users;
			next();
		})
		.catch((err) => {
			// Централизованная обработка ошибок транзакции
			return transactionErrorHandler(
				retryError(getUsersByLogins, err),
				req,
				res,
				next,
			);
		});
}

