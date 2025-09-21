export default async function (sequelize, DataTypes) {
    const Post = await sequelize.define(`Post`, {
        title: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                len: [10, 150],
                notEmpty: true
            }
        },
        // status: {
        //     type: DataTypes.ENUM(`active`, `inactive`),
        //     allowNull: false,
        //     defaultValue: `active`
        // },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [10, 65535],
                notEmpty: true
            }
        },
        rating: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        }
    })

    return Post
}