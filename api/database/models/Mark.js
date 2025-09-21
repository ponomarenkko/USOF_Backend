const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substring(1)}`

export default async function (sequelize, DataTypes) {
    const Mark = await sequelize.define(`Mark`, {
        type: {
            type: DataTypes.ENUM(`like`, `dislike`),
            allowNull: false,
            defaultValue: `like`
        },
        markableType: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
        instanceMethods: { // TODO: Test it
            getMarkable: (options) => {
                if (!this.markableType)
                    return Promise.resolve(null)
                const mixinMethodName = `get${uppercaseFirst(this.markableType)}`
                return this[mixinMethodName](options)
            }
        }
    })
}