import schedule from "node-schedule"
import sequelize from "../database/db.js";
import {transactionErrorHandler} from "../errors/handlers.js";
import retryError from "../errors/RetryError.js";
import getOffsetDate from "./getOffsetDate.js";

const Op = sequelize.Sequelize.Op
const models = sequelize.models

const rule = new schedule.RecurrenceRule()
rule.hour = 12
rule.minute = 0
rule.second = 0

const clearOldRecords = async () => {
    const currentDate = new Date()

    sequelize.inTransaction(async transaction => {
        const unverifiedUsers = await models.User.findAll({
            where: {
                verified: false
            },
            include: [{
                model: models.Token,
                where: {
                    type: `verify`,
                    expiredAt: {
                        [Op.lte]: currentDate
                    }
                },
                transaction
            }],
            transaction
        })

        for (const user of unverifiedUsers) {
            await user.destroy({ transaction })
        }

        await models.Token.destroy({
            where: {
                expiredAt: {
                    [Op.lte]: currentDate
                }
            },
            transaction
        })
    })
        .then(() => {
            console.log("Deletion job executed") // TODO: need to log this
        })
        .catch(err => {
            console.log(err)    // TODO: need to log this
            transactionErrorHandler(retryError(clearOldRecords, err), null, null, null)
        })

}

const job = schedule.scheduleJob(rule, clearOldRecords)

export default job