import sequelize from "../database/db.js";
import { transactionErrorHandler } from "../errors/handlers.js";
import retryError from "../errors/RetryError.js";
import getPaginationData from "../utils/getPaginationData.js";
import upload from "../middlewares/imageUploader.js";
import createToken from "../utils/createToken.js";
import sanitize from "../utils/modelSanitizer.js";
import { sendDeletionLink } from "../utils/mailer.js";

const Op = sequelize.Sequelize.Op;
const models = sequelize.models;

class UsersController {
	getAll = async (req, res, next) => {
		let where;

		if (req.filterSettings.admins)
			where = { ...req.filterSettings.admins.where, ...where };
		if (req.filterSettings.users)
			where = { ...req.filterSettings.users.where, ...where };
		if (req.filterSettings.search)
			where = { ...req.filterSettings.search.where, ...where };

		sequelize
			.inTransaction(async (transaction) => {
				return await models.User.findAndCountAll({
					order: req.order,
					offset: req.page.offset,
					limit: req.page.limit,
					where,
					transaction,
				});
			})
			.then((result) => {
				const data = getPaginationData(
					result,
					req.query.page,
					req.query.size,
				);

				res.status(200).json({
					pagination: data.metadata,
					users: sanitize(data.items),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.getAll, err),
					req,
					res,
					next,
				);
			});
	};

	getArray = async (req, res, next) => {
		res.status(200).json({
			users: sanitize(req.users),
		});
	};
	getOne = async (req, res, next) => {
		res.status(200).json({
			user: sanitize(req.user),
		});
	};

	changeInfo = async (req, res, next) => {
		upload.deleteFile(req.user.avatar);

		sequelize
			.inTransaction(async (transaction) => {
				return await req.user.update(
					{
						avatar: req.filePath,
						fullName: req.body.fullName,
					},
					{ transaction },
				);
			})
			.then((user) => {
				return res.status(200).json({
					message: `Personal information is updated`,
					user: sanitize(user),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.changeInfo, err),
					req,
					res,
					next,
				);
			});
	};

	sendDeleteToken = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				return await createToken(
					"delete",
					req.body.redirectUrl,
					req.user,
					transaction,
				);
			})
			.then((token) => {
				sendDeletionLink(token.redirectUrl, req.user.email);

				return res.status(200).json({
					message: `Deletion link is sent`,
					token: token.token,
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.sendDeleteToken, err),
					req,
					res,
					next,
				);
			});
	};

	delete = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await req.user.destroy({ transaction });
			})
			.then(() => {
				return res.status(200).json({
					message: "Account is deleted",
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.delete, err),
					req,
					res,
					next,
				);
			});
	};
}

export default new UsersController();
