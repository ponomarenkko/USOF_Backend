import sequelize from "../database/db.js";

const models = sequelize.models;

export default async function createToken(type, redirectUrl, owner, transaction, expiredAt) {
    const token = await models.Token.create({
        type,
        expiredAt
    }, { transaction })

    if (redirectUrl) {
        redirectUrl = redirectUrl.replace(`:token`, token.token)
        token.update({
            redirectUrl
        }, { transaction })
    }

    await token.setOwner(owner, { transaction })

    return token
}