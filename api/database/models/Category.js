export default async function (sequelize, DataTypes) {
	const Category = await sequelize.define(
		`Category`,
		{
			title: {
				type: DataTypes.STRING(40),
				unique: true,
			},
			content: {
				type: DataTypes.STRING(1000),
			},
		},
		{
			timestamps: false,
		},
	);

	return Category;
}
