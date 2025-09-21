import * as AdminJSSequelize from "@adminjs/sequelize";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import sequelize from "../database/db.js";

const models = sequelize.models;

const DEFAULT_ADMIN = {
	email: "admin@example.com",
	password: "password",
};

const authenticate = async (email, password) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN);
	}
	return null;
};

AdminJS.registerAdapter({
	Resource: AdminJSSequelize.Resource,
	Database: AdminJSSequelize.Database,
});

const adminOptions = {
	resources: [
		models.Category,
		models.Comment,
		models.Mark,
		models.Post,
		models.Token,
		models.User,
		// ...models,
	],
};

export const admin = new AdminJS(adminOptions);
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate,
		cookieName: "adminjs",
		cookiePassword: "sessionsecret",
	},
	null,
);
