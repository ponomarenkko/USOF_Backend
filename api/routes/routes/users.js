import express from "express";
import UsersController from "../../controllers/UsersController.js";

import {
	getDataFromToken,
	getFilterRules,
	getPaginationParams,
	getSortRules,
	getUserById,
	getUserByLogin,
	getUserByToken,
	getUsersByIds,
	getUsersByLogins,
} from "../../middlewares/getters.js";

import {
	fullNameRegisterValidator,
	paginationValidator,
	paramLoginValidator,
	paramTokenValidator,
	querySortValidator,
	tokenValidator,
	queryLoginsValidator,
	queryIdsValidator,
	paramIdValidator,
	queryFilterValidator,
} from "../../middlewares/validators.js";

import { validationErrorHandler } from "../../errors/handlers.js";
import upload, { compressImage } from "../../middlewares/imageUploader.js";
import {
	checkTokenDelete,
	checkTokenSession,
} from "../../middlewares/checkers.js";

const router = express.Router();

router.post(
	`/delete`,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	UsersController.sendDeleteToken,
);

router.patch(
	`/`,
	upload.singleWithHandler(`avatar`),
	fullNameRegisterValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	compressImage,
	UsersController.changeInfo,
);

router.get(
	`/`,
	paginationValidator,
	querySortValidator,
	queryFilterValidator,
	validationErrorHandler,
	getPaginationParams,
	getSortRules(`users`),
	getFilterRules(`users`),
	UsersController.getAll,
);
router.get(
	`/token`,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	UsersController.getOne,
);
router.get(
	`/logins`,
	queryLoginsValidator,
	validationErrorHandler,
	getUsersByLogins,
	UsersController.getArray,
);
router.get(
	`/login/:login`,
	paramLoginValidator,
	validationErrorHandler,
	getUserByLogin,
	UsersController.getOne,
);
router.get(
	`/ids`,
	queryIdsValidator,
	validationErrorHandler,
	getUsersByIds,
	UsersController.getArray,
);
router.get(
	`/id/:id`,
	paramIdValidator,
	validationErrorHandler,
	getUserById,
	UsersController.getOne,
);

router.delete(
	`/delete/:token`,
	paramTokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenDelete,
	UsersController.delete,
);

export default router;
