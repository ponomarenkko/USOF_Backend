export default async function (sequelize, DataTypes) {
    const Comment = await sequelize.define(`Comment`, {
        content: {
            type: DataTypes.TEXT
        },
        rating: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        }
    })

    return Comment
}