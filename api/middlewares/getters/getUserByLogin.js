import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const Op = sequelize.Sequelize.Op;
const models = sequelize.models;
export default function getUserByLogin(req, res, next) {
	sequelize
		.inTransaction(async (transaction) => {
			// Ищем пользователя по логину или email
			return await models.User.findOne({
				where: {
					[Op.or]: [
						{ login: req.body.login ?? null },
						{ email: req.body.email ?? null },
					],
				},
				transaction,
			});
		})
		.then((user) => {
			if (!user)
				return next(new ServerError(`User not found`, 404));

			// Пробрасываем найденного пользователя в req
			req.user = user;
			next();
		})
		.catch((err) => {
			// Централизованная обработка ошибок транзакции
			return transactionErrorHandler(
				retryError(getUserByLogin, err),
				req,
				res,
				next,
			);
		});
}

