import sequelize from "../database/db.js"
import {transactionErrorHandler} from "../errors/handlers.js";
import retryError from "../errors/RetryError.js";
import sanitize from "../utils/modelSanitizer.js";
import increments from "../utils/ratingIncrements.js";

const Op = sequelize.Sequelize.Op
const models = sequelize.models

class CommentsController{
    create = async (req, res, next) => {
        sequelize.inTransaction(async transaction => {
            const comment = await models.Comment.create({
                content: req.body.content
            }, { transaction })

            await req.user.increment(`rating`, { by: increments.comment, transaction })

            await comment.setAuthor(req.user, { transaction })
            await comment.setPost(req.post, { transaction })
            await comment.setComment(req.comment, { transaction })

            return comment
        })
            .then(comment => {
                res.status(201).json({
                    message: `Comment is created`,
                    comment: sanitize(comment)
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.create, err), req, res, next)
            })
    }

    getOne = async (req, res, next) => {
        res.status(200).json({
            comment: sanitize(req.comment)
        })
    }

    edit = async (req, res, next) => {
        sequelize.inTransaction(async transaction => {
            return await req.comment.update({
                content: req.body.content
            }, { transaction })
        })
            .then(comment => {
                res.status(200).json({
                    message: `Comment is edited`,
                    comment: sanitize(comment)
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.edit, err), req, res, next)
            })
    }

    delete = async (req, res, next) => {
        sequelize.inTransaction(async transaction => {
            // await req.comment.destroy({ transaction })
            await req.comment.update({
                userId: null,
                content: null,
            }, { transaction })
        })
            .then(() => {
                res.status(200).json({
                    message: `Comment is deleted`
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.delete, err), req, res, next)
            })
    }

    like = async (req, res, next) => {
        let totalIncrement = increments.like
        let userIncrement = increments.mark

        sequelize.inTransaction(async transaction => {
            if (req?.mark?.type === `dislike`) {
                totalIncrement -= increments.dislike
                userIncrement = 0

                await req.mark.destroy({ transaction })
            }
            await req.user.increment(`rating`, { by: userIncrement, transaction })
            await req.comment.increment(`rating`, { by: totalIncrement, transaction })
            await req.comment.author?.increment(`rating`, { by: totalIncrement, transaction })

            const like = await req.comment.createMark({ type: `like` }, { transaction })
            await like.setAuthor(req.user, { transaction })

            return like
        })
            .then((like) => {
                res.status(200).json({
                    message: `Like is set`,
                    like
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.like, err), req, res, next)
            })
    }

    dislike = async (req, res, next) => {
        let totalIncrement = increments.dislike
        let userIncrement = increments.mark

        sequelize.inTransaction(async transaction => {
            if (req?.mark?.type === `like`) {
                totalIncrement -= increments.like
                userIncrement = 0

                await req.mark.destroy({ transaction })
            }
            await req.user.increment(`rating`, { by: userIncrement, transaction })
            await req.comment.increment(`rating`, { by: totalIncrement, transaction })
            await req.comment.author?.increment(`rating`, { by: totalIncrement, transaction })

            const dislike = await req.comment.createMark({ type: `dislike` }, { transaction })
            await dislike.setAuthor(req.user, { transaction })

            return dislike
        })
            .then((dislike) => {
                res.status(200).json({
                    message: `Dislike is set`,
                    dislike
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.dislike, err), req, res, next)
            })
    }

    deleteLike = async (req, res, next) => {
        sequelize.inTransaction(async transaction => {
            await req.mark.destroy({ transaction })
            await req.user.increment(`rating`, { by: -increments.mark, transaction })
            await req.comment.increment(`rating`, { by: -increments.like, transaction })
            await req.comment.author?.increment(`rating`, { by: -increments.like, transaction })
        })
            .then(() => {
                res.status(200).json({
                    message: `Like is deleted`
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.deleteLike, err), req, res, next)
            })
    }

    deleteDislike = async (req, res, next) => {
        sequelize.inTransaction(async transaction => {
            await req.mark.destroy({ transaction })
            await req.user.increment(`rating`, { by: -increments.mark, transaction })
            await req.comment.increment(`rating`, { by: -increments.dislike, transaction })
            await req.comment.author?.increment(`rating`, { by: -increments.dislike, transaction })
        })
            .then(() => {
                res.status(200).json({
                    message: `Dislike is deleted`
                })
            })
            .catch(err => {
                return transactionErrorHandler(retryError(this.deleteDislike, err), req, res, next)
            })
    }
}

export default new CommentsController()