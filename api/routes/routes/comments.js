import express from "express";
import {
	commentCreationValidator,
	paramIdValidator,
	tokenValidator,
} from "../../middlewares/validators.js";
import {
	getCommentById,
	getDataFromToken,
	getPostByComment,
	getUserByToken,
} from "../../middlewares/getters.js";
import CommentsController from "../../controllers/CommentsController.js";
import { validationErrorHandler } from "../../errors/handlers.js";
import {
	checkDisliked,
	checkLiked,
	checkNotDisliked,
	checkNotLiked,
	checkNotLocked,
	checkOwner,
	checkTokenSession,
} from "../../middlewares/checkers.js";
import optional from "../../middlewares/getOptionalMiddleware.js";
import tokenToBody from "../../middlewares/tokenToBody.js";

const router = express.Router();

router.post(
	`/:id/comment`,
	paramIdValidator,
	commentCreationValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	getPostByComment,
	checkNotLocked,
	CommentsController.create,
);
router.post(
	`/:id/like`,
	paramIdValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	getPostByComment,
	checkNotLocked,
	checkNotLiked,
	CommentsController.like,
);
router.post(
	`/:id/dislike`,
	paramIdValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	getPostByComment,
	checkNotLocked,
	checkNotDisliked,
	CommentsController.dislike,
);

router.put(
	`/:id`,
	paramIdValidator,
	commentCreationValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	checkOwner,
	getPostByComment,
	checkNotLocked,
	CommentsController.edit,
);

router.get(
	`/:id`,
	paramIdValidator,
	tokenToBody,
	validationErrorHandler,
	optional(getDataFromToken),
	optional(getUserByToken),
	getCommentById,
	CommentsController.getOne,
);

router.delete(
	`/:id`,
	paramIdValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	checkOwner,
	getPostByComment,
	checkNotLocked,
	CommentsController.delete,
);
router.delete(
	`/:id/like`,
	paramIdValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	getPostByComment,
	checkNotLocked,
	checkLiked,
	CommentsController.deleteLike,
);
router.delete(
	`/:id/dislike`,
	paramIdValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	getCommentById,
	getPostByComment,
	checkNotLocked,
	checkDisliked,
	CommentsController.deleteDislike,
);

export default router;
