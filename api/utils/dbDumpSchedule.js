import mysqldump from "mysqldump"
import schedule from "node-schedule"
import sequelize from "../database/db.js";
import fs from "fs";
import path from "path";

const rule = new schedule.RecurrenceRule()
rule.hour = 2
rule.minute = 16
rule.second = 10

const dumpDb = () => {
    const fileName = new Date().toJSON().slice(0, 19).replaceAll(`:`, `-`)
    const dirPath = `./dumps`
    const fileExt = `.sql`

    const filePath = path.join(dirPath, fileName + fileExt)

    if (!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath, { recursive: true })

    // console.log(fileName)
    sequelize.dump(filePath)
}

const job = schedule.scheduleJob(rule, dumpDb)

export default job