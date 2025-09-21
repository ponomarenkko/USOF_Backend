import _ from "lodash";
import sequelize from "../database/db.js";
import { cloneDeep } from "sequelize/lib/utils";

const models = sequelize.models;
let settings;

export default function sanitize(obj) {
	initSettiong();

	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) obj[i] = sanitize(obj[i]);

		return obj;
	}

	const model = instanceOf(obj, settings.keys());

	if (!model) return _.cloneDeep(obj);

	obj = _.cloneDeep(obj.get());

	settings.get(model).forEach((field) => delete obj[field]);
	for (const [key, value] of Object.entries(obj)) obj[key] = sanitize(value);

	return obj;
}

function initSettiong() {
	if (settings) return;

	settings = new Map();

	settings.set(models.Category, [`PostCategories`]);
	settings.set(models.Comment, ["userId"]);
	settings.set(models.Mark, [
		`markableType`,
		`markableId`,
		`id`,
		`userId`,
		`createdAt`,
		`updatedAt`,
	]);
	settings.set(models.Post, [`lockId`, `author`, `Comments`]);
	settings.set(models.Token, [`uuid`, `token`, `id`]);
	settings.set(models.User, [`password`, `email`]);
}

function instanceOf(obj, constructors) {
	for (const constructor of constructors)
		if (obj instanceof constructor) return constructor;
	return null;
}
