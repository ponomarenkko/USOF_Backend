import express from "express";
import {
	default as upload,
	compressImage,
} from "../../middlewares/imageUploader.js";
import AuthController from "../../controllers/AuthController.js";

import {
	getUserByLogin,
	getDataFromToken,
	getUserByToken,
} from "../../middlewares/getters.js";

import {
	passwordRegisterValidator,
	registerValidator,
	loginOrEmailValidator,
	loginInValidator,
	tokenValidator,
	paramTokenValidator,
	adminRegisterValidator,
} from "../../middlewares/validators.js";

import {
	checkEmailOrLoginExists,
	checkVerified,
	checkNotVerified,
	checkPassword,
	checkTokenVerify,
	checkTokenPswReset,
	checkTokenSession,
	checkMaxLoginDevices,
} from "../../middlewares/checkers.js";

import { validationErrorHandler } from "../../errors/handlers.js";
import checkAdmin from "../../middlewares/checkers/checkAdmin.js";

const router = express.Router();

router.post(
	`/register`,
	upload.singleWithHandler(`avatar`),
	registerValidator,
	validationErrorHandler,
	checkEmailOrLoginExists,
	compressImage,
	AuthController.register,
);
router.post(
	`/register/admin`,
	upload.singleWithHandler(`avatar`),
	adminRegisterValidator,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	checkAdmin,
	checkEmailOrLoginExists,
	compressImage,
	AuthController.adminRegister,
);
router.post(
	`/verify-resend`,
	loginInValidator,
	validationErrorHandler,
	getUserByLogin,
	checkPassword,
	checkNotVerified,
	AuthController.sendVerifyToken,
);
router.post(
	`/login`,
	loginInValidator,
	validationErrorHandler,
	getUserByLogin,
	checkPassword,
	checkVerified,
	checkMaxLoginDevices,
	AuthController.login,
);
router.post(
	`/password-reset`,
	loginOrEmailValidator,
	validationErrorHandler,
	getUserByLogin,
	checkVerified,
	AuthController.sendPswResetToken,
);

router.patch(
	`/verify/:token`,
	paramTokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenVerify,
	checkNotVerified,
	AuthController.verifyEmail,
);
router.patch(
	`/password-reset/:token`,
	paramTokenValidator,
	passwordRegisterValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenPswReset,
	AuthController.changePassword,
);

router.delete(
	`/logout`,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	AuthController.logout,
);
router.delete(
	`/logout/all`,
	tokenValidator,
	validationErrorHandler,
	getDataFromToken,
	getUserByToken,
	checkTokenSession,
	AuthController.fullLogout,
);

export default router;
