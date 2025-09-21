import logger from "morgan"
import fs from "fs";

logger.getFileLogger = () => {
    if (!fs.existsSync(`./logs`))
        fs.mkdirSync(`./logs`);

    return logger('combined', {
                stream: fs.createWriteStream('./logs/log.log', {flags: 'a'})
            })
}

logger.getConsoleLogger = () => {
    return logger(`dev`)
}

export default logger