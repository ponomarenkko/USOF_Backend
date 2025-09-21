import ServerError from "../../errors/ServerError.js";
import sequelize from "../../database/db.js";

const models = sequelize.models;
const Sequelize = sequelize.Sequelize;
const Op = sequelize.Sequelize.Op;
let rules; // лениво инициализируем таблицу правил ниже
export default function getFilterRules(rulesName) {
	return (req, res, next) => {
		initRules();

		try {
			const settings = {};

			if (req.body.filter) {
				for (const param of Object.keys(req.body.filter)) {
					// Берём шаблон правила
					const ruleTemplate = rules[rulesName][param];

					if (!ruleTemplate)
						return next(
							new ServerError(
								`Filter rule "${param}" can't be applied to "${rulesName}"`,
								400
							)
						);

					const rule = JSON.parse(JSON.stringify(ruleTemplate));

					// Подстановка параметров пользователя в правило
					if (param === `categories`)
						rule.include.where.id = req.body.filter[param];

					if (param === `search`) {
						// Примечание: вы передаёте пользовательский ввод в regexp.
						// Подумайте о экранировании/ограничении (иначе risk RegExp DoS/инъекции).
						const q = req.body.filter[param].soft.toString();

						if (rulesName === `posts`) {
							rule.where[Op.or][0].title[Op.regexp] = q;
							rule.where[Op.or][1].content[Op.regexp] = q;
						}
						if (rulesName === `users`) {
							rule.where.login[Op.regexp] = q;
						}
						if (rulesName === `categories`) {
							rule.where.title[Op.regexp] = q;
						}
					}

					// Копим готовые настройки фильтра
					settings[param] = rule;
				}
			}

			// Пробрасываем собранные правила дальше по пайплайну
			req.filterSettings = settings;
			next();
		} catch (err) {
			console.error(err);
			return next(
				new ServerError(`${rulesName} filter rules went wrong`, 500)
			);
		}
	};
}

// Инициализация предопределённых правил (один раз на процесс)
function initRules() {
	if (rules) return;

	rules = {
		categories: {
			search: {
				where: {
					title: { [Op.regexp]: null },
				},
			},
		},
		users: {
			admins: {
				where: { role: `admin` },
			},
			users: {
				where: { role: `user` },
			},
			search: {
				where: {
					login: { [Op.regexp]: null },
				},
			},
		},
		posts: {
			nocomments: {
				include: {
					model: models.Comment,
					as: `Comments`,
					attributes: [`id`],
					required: false,
				},
				where: { "$Comments.id$": null },
			},
			categories: {
				include: {
					model: models.Category,
					as: `categories`,
					where: { id: [] },
					required: true,
				},
			},
			search: {
				where: {
					[Op.or]: [
						{ title: { [Op.regexp]: null } },
						{ content: { [Op.regexp]: null } },
					],
				},
			},
		},
	};
}

