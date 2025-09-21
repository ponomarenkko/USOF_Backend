import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const models = sequelize.models;
export default function getUserById(req, res, next) {
	sequelize
		.inTransaction(async (transaction) => {
			// Ищем пользователя по первичному ключу
			return await models.User.findByPk(req.body.id, { transaction });
		})
		.then((user) => {
			if (!user)
				return next(new ServerError(`User not found`, 404));

			// Сохраняем найденного пользователя в req
			req.user = user;
			next();
		})
		.catch((err) => {
			// Централизованная обработка ошибок транзакции
			return transactionErrorHandler(
				retryError(getUserById, err),
				req,
				res,
				next,
			);
		});
}

