import ServerError from "../../errors/ServerError.js";

// Предопределённые правила сортировки для разных сущностей
const rules = {
    users: {
        rating: `rating`,
        name: `login`,
        date: `createdAt`,
    },
    posts: {
        rating: `rating`,
        date: `createdAt`,
    },
    comments: {
        rating: `rating`,
        date: `createdAt`,
    },
    categories: {
        name: `title`,
    },
};
export default function getSortRules(rulesName) {
    return (req, res, next) => {
        try {
            const order = [];

            if (req.body.sort) {
                for (const param of Object.keys(req.body.sort)) {
                    const sortOrder = req.body.sort[param].isAscending
                        ? `ASC`
                        : `DESC`;
                    const rule = rules[rulesName][param];

                    // Если поле сортировки не поддерживается
                    if (!rule)
                        return next(
                            new ServerError(
                                `Sort rule "${param}" can't be applied to "${rulesName}"`,
                                400
                            )
                        );

                    // Добавляем правило в список сортировки
                    order.push([rule, sortOrder]);
                }
            }

            req.order = order; // прокидываем в следующий middleware/handler
            next();
        } catch (err) {
            return next(
                new ServerError(`${rulesName} sort rules went wrong`, 500)
            );
        }
    };
}

