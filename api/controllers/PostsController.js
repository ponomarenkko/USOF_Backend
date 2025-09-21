import sequelize from "../database/db.js";
import getPaginationData from "../utils/getPaginationData.js";
import { transactionErrorHandler } from "../errors/handlers.js";
import retryError from "../errors/RetryError.js";
import createToken from "../utils/createToken.js";
import sanitize from "../utils/modelSanitizer.js";
import increments from "../utils/ratingIncrements.js";
import { literal } from "sequelize";
import textToMySqlRegex from "../utils/textToMySqlRegex.js";

const Op = sequelize.Sequelize.Op;
const Sequelize = sequelize.Sequelize;
const models = sequelize.models;

class PostsController {
	create = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				const post = await models.Post.create(
					{
						title: req.body.title,
						content: req.body.content,
					},
					{ transaction },
				);
				await post.setAuthor(req.user, { transaction });

				await req.user.increment(`rating`, {
					by: increments.post,
					transaction,
				});

				await post.addCategories(req.categories, { transaction });

				return post;
			})
			.then((post) => {
				res.status(201).json({
					message: `Post successfully created`,
					post: sanitize(post),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.create, err),
					req,
					res,
					next,
				);
			});
	};

	edit = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				const [post] = await Promise.all([
					await req.post.update(
						{
							title: req.body.title,
							content: req.body.content,
						},
						{ transaction },
					),

					await models.PostCategories.destroy({
						where: {
							PostId: req.post.id,
						},
						transaction,
					}),
				]);

				await post.addCategories(req.categories, { transaction });

				return post;
			})
			.then((post) => {
				res.status(200).json({
					message: `Post successfully changed`,
					post: sanitize(post),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.edit, err),
					req,
					res,
					next,
				);
			});
	};

	getAll = async (req, res, next) => {
		let include = [
			{
				model: models.Token,
				as: `lock`,
			},
			{
				model: models.Category,
				as: `categories`,
			},
			{
				model: models.User,
				as: `author`,
			},
		];

		let where;

		let includeMarks = {
			model: models.Mark,
			required: false,
			where: {
				userId: req.user?.id,
				markableType: `post`,
			},
		};

		if (req.user) include.push(includeMarks);

		if (req.filterSettings.nocomments) {
			include.push(req.filterSettings.nocomments.include);
			where = { ...req.filterSettings.nocomments.where, ...where };
		}

		if (req.filterSettings.categories)
			include.push(req.filterSettings.categories.include);

		if (req.filterSettings.search)
			where = { ...req.filterSettings.search.where, ...where };

		sequelize
			.inTransaction(async (transaction) => {
				// const regex = textToMySqlRegex.strict(
				// 	"Where, is! my... mind? Where is my mind Where is my mind",
				// );
				// console.log(regex);

				return await models.Post.findAndCountAll({
					include,
					subQuery: false,
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
					posts: sanitize(data.items),
				});
			})
			.catch((err) => {
				console.error(err);
				return transactionErrorHandler(
					retryError(this.getAll, err),
					req,
					res,
					next,
				);
			});
	};

	getOne = async (req, res, next) => {
		res.status(200).json({
			post: sanitize(req.post),
		});
	};

	getComments = async (req, res, next) => {
		let include = [
			{
				model: models.User,
				as: `author`,
			},
		];
		let includeMarks = {
			model: models.Mark,
			where: {
				userId: req.user?.id,
				markableType: `comment`,
			},
			required: false,
		};

		if (req.user) include.push(includeMarks);

		sequelize
			.inTransaction(async (transaction) => {
				const [count, rows] = await Promise.all([
					req.post.countComments({ transaction }),

					req.post.getComments({
						include,
						order: req.order,
						offset: req.page.offset,
						limit: req.page.limit,
						transaction,
					}),
				]);

				return { count, rows };
			})
			.then((result) => {
				const data = getPaginationData(
					result,
					req.query.page,
					req.query.size,
				);

				res.status(200).json({
					pagination: data.metadata,
					comments: sanitize(data.items),
				});
			})
			.catch((err) => {
				return retryError(this.getComments, err), req, res, next;
			});
	};

	createComment = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				const comment = await models.Comment.create(
					{
						content: req.body.content,
					},
					{ transaction },
				);
				await comment.setAuthor(req.user, { transaction });
				await comment.setPost(req.post, { transaction });

				await req.user.increment(`rating`, {
					by: increments.comment,
					transaction,
				});
				await req.post.author?.increment(`rating`, {
					by: increments.comment,
					transaction,
				});

				return comment;
			})
			.then((comment) => {
				res.status(201).json({
					message: `Comment is created`,
					comment: sanitize(comment),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.createComment, err),
					req,
					res,
					next,
				);
			});
	};

	delete = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await models.Mark.destroy({
					where: {
						markableType: `post`,
						markableId: req.post.id,
					},
					transaction,
				});
				await req.post.destroy({ transaction });
			})
			.then(() => {
				res.status(200).json({
					message: `Post is deleted`,
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

	lock = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await (
					await req.post.getLock({ transaction })
				)?.destroy({ transaction });

				const token = await createToken(
					`lock`,
					null,
					req.user,
					transaction,
					req.body.timer,
				);

				await req.post.setLock(token, { transaction });

				return token;
			})
			.then((token) => {
				token.dataValues.author = req.user;
				console.log(sanitize(token));

				res.status(200).json({
					message: `Post is locked`,
					post: sanitize(req.post),
					lock: sanitize(token),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.lock, err),
					req,
					res,
					next,
				);
			});
	};

	unlock = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await (
					await req.post.getLock({ transaction })
				)?.destroy({ transaction });
			})
			.then(() => {
				res.status(200).json({
					message: `Post is unlocked`,
					post: sanitize(req.post),
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.unlock, err),
					req,
					res,
					next,
				);
			});
	};

	like = async (req, res, next) => {
		let totalIncrement = increments.like;
		let userIncrement = increments.mark;

		sequelize
			.inTransaction(async (transaction) => {
				if (req?.mark?.type === `dislike`) {
					totalIncrement -= increments.dislike;
					userIncrement = 0;

					await req.mark.destroy({ transaction });
				}
				await req.user.increment(`rating`, {
					by: userIncrement,
					transaction,
				});
				await req.post.increment(`rating`, {
					by: totalIncrement,
					transaction,
				});
				await req.post.author?.increment(`rating`, {
					by: totalIncrement,
					transaction,
				});

				const like = await req.post.createMark(
					{ type: `like` },
					{ transaction },
				);
				await like.setAuthor(req.user, { transaction });

				return like;
			})
			.then((like) => {
				res.status(200).json({
					message: `Like is set`,
					post: req.post,
					like,
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.like, err),
					req,
					res,
					next,
				);
			});
	};

	dislike = async (req, res, next) => {
		let totalIncrement = increments.dislike;
		let userIncrement = increments.mark;

		sequelize
			.inTransaction(async (transaction) => {
				if (req?.mark?.type === `like`) {
					totalIncrement -= increments.like;
					userIncrement = 0;

					await req.mark.destroy({ transaction });
				}
				await req.user.increment(`rating`, {
					by: userIncrement,
					transaction,
				});
				await req.post.increment(`rating`, {
					by: totalIncrement,
					transaction,
				});
				await req.post.author?.increment(`rating`, {
					by: totalIncrement,
					transaction,
				});

				const dislike = await req.post.createMark(
					{ type: `dislike` },
					{ transaction },
				);
				await dislike.setAuthor(req.user, { transaction });

				return dislike;
			})
			.then((dislike) => {
				res.status(200).json({
					message: `Dislike is set`,
					dislike,
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.dislike, err),
					req,
					res,
					next,
				);
			});
	};

	// deleteMark = async (req, res, next) => {
	//     sequelize.inTransaction(async transaction => {
	//         await req.mark.destroy({ transaction })
	//     })
	//         .then(() => {
	//             res.status(200).json({
	//                 message: `Mark is deleted`
	//             })
	//         })
	//         .catch(err => {
	//             transactionErrorHandler(retryError(this.deleteMark, err), req, res, next)
	//         })
	// }

	deleteLike = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await req.mark.destroy({ transaction });
				await req.user.increment(`rating`, {
					by: -increments.mark,
					transaction,
				});
				await req.post.increment(`rating`, {
					by: -increments.like,
					transaction,
				});
				await req.post.author?.increment(`rating`, {
					by: -increments.like,
					transaction,
				});
			})
			.then(() => {
				res.status(200).json({
					message: `Like is deleted`,
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.deleteLike, err),
					req,
					res,
					next,
				);
			});
	};

	deleteDislike = async (req, res, next) => {
		sequelize
			.inTransaction(async (transaction) => {
				await req.mark.destroy({ transaction });
				await req.user.increment(`rating`, {
					by: -increments.mark,
					transaction,
				});
				await req.post.increment(`rating`, {
					by: -increments.dislike,
					transaction,
				});
				await req.post.author?.increment(`rating`, {
					by: -increments.dislike,
					transaction,
				});
			})
			.then(() => {
				res.status(200).json({
					message: `Dislike is deleted`,
				});
			})
			.catch((err) => {
				return transactionErrorHandler(
					retryError(this.deleteDislike, err),
					req,
					res,
					next,
				);
			});
	};
}

export default new PostsController();
