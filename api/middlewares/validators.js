import { header } from "express-validator";

import createObligatoryValidator from "./validators/createObligatoryValidator.js";
import createParamObligatoryValidator from "./validators/createParamObligatoryValidator.js";

import passwordRegisterValidator from "./validators/passwordRegisterValidator.js";
import loginRegisterValidator from "./validators/loginRegisterValidator.js";
import emailRegisterValidator from "./validators/emailRegisterValidator.js";
import loginOrEmailValidator from "./validators/loginOrEmailValidator.js";
import paginationValidator from "./validators/paginationValidator.js";
import roleRegisterValidator from "./validators/roleRegisterValidator.js";
import fullNameRegisterValidator from "./validators/fullNameRegisterValidator.js";
import postTitleCreationValidator from "./validators/postTitleCreationValidator.js";
import postContentCreationValidator from "./validators/postContentCreationValidator.js";
import categoryContentCreationValidator from "./validators/categoryContentCreationValidator.js";
import categoryTitleCreationValidator from "./validators/categoryTitleCreationValidator.js";
import postCategoriesValidator from "./validators/postCategoriesValidator.js";
import timerValidator from "./validators/timerValidator.js";
import querySortValidator from "./validators/querySortValidator.js";
import queryFilterValidator from "./validators/queryFilterValidator.js";
import queryLoginsValidator from "./validators/queryLoginsValidator.js";
import queryIdsValidator from "./validators/queryIdsValidator.js";
import queryIdsOptionalValidator from "./validators/queryIdsOptionalValidator.js";

export {
	passwordRegisterValidator,
	loginRegisterValidator,
	emailRegisterValidator,
	loginOrEmailValidator,
	paginationValidator,
	roleRegisterValidator,
	fullNameRegisterValidator,
	postTitleCreationValidator,
	postContentCreationValidator,
	categoryContentCreationValidator,
	categoryTitleCreationValidator,
	postCategoriesValidator,
	timerValidator,
	querySortValidator,
	queryFilterValidator,
	queryLoginsValidator,
	queryIdsValidator,
	queryIdsOptionalValidator,
};

export const passwordValidator = createObligatoryValidator(`password`);
export const tokenValidator = createObligatoryValidator(`token`, null, header);

export const paramTokenValidator = createParamObligatoryValidator(`token`);
export const paramLoginValidator = createParamObligatoryValidator(`login`);
export const paramIdValidator = createParamObligatoryValidator(`id`);

export const registerValidator = [
	passwordRegisterValidator,
	loginRegisterValidator,
	emailRegisterValidator,
	fullNameRegisterValidator,
];
export const adminRegisterValidator = [
	registerValidator,
	roleRegisterValidator,
];
export const loginInValidator = [loginOrEmailValidator, passwordValidator];
export const postCreationValidator = [
	postTitleCreationValidator,
	postContentCreationValidator,
	postCategoriesValidator,
];
export const commentCreationValidator = [postContentCreationValidator];
export const categoryCreationValidator = [
	categoryTitleCreationValidator,
	categoryContentCreationValidator,
];
