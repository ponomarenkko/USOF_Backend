import sequelize from "../../database/db.js";
import ServerError from "../../errors/ServerError.js";
import { transactionErrorHandler } from "../../errors/handlers.js";
import retryError from "../../errors/RetryError.js";

const maxLoginDevices = 5; // Максимальное количество одновременных сессий для одного пользователя

// Middleware для ограничения числа одновременных авторизаций (сессий) пользователя
export default function checkMaxLoginDevices(req, res, next) {
    // Выполняем транзакцию для подсчёта количества активных токенов-сессий у пользователя
    sequelize.inTransaction(async transaction => {
        return req.user.countTokens({
            where: { type: `session` }, // фильтруем только сессионные токены
            transaction
        });
    })
        .then((count) => {
            // Если число сессий достигло лимита → запрещаем дальнейший вход
            if (count >= maxLoginDevices)
                return next(
                    new ServerError(
                        `Too many logged devices. Max: ${maxLoginDevices}`, 
                        403 // Forbidden
                    )
                );

            // Если лимит не превышен → продолжаем выполнение
            return next();
        })
        .catch(err => {
            // Обработка ошибок транзакции/базы данных
            return transactionErrorHandler(
                retryError(checkMaxLoginDevices, err),
                req,
                res,
                next
            );
        });
}

