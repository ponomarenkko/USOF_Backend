import bcrypt from "bcrypt";

export default async function (sequelize, DataTypes) {
	const User = await sequelize.define("User", {
		login: {
			type: DataTypes.STRING(40),
			unique: true,
			allowNull: false,
			validate: {
				len: [5, 40],
				isAlphanumeric: true,
				notEmpty: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [5, 254],
			},
			set(psw) {
				this.setDataValue(
					`password`,
					bcrypt.hashSync(psw, parseInt(process.env.SALT)),
				);
			},
		},
		fullName: {
			type: DataTypes.STRING,
			defaultValue: "John Doe",
			validate: {
				len: [0, 100],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				len: [0, 255],
			},
		},
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: `uploads/avatars/default.jpg`,
		},
		rating: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0,
		},
		role: {
			type: DataTypes.ENUM(`admin`, `user`),
			allowNull: false,
			defaultValue: "user",
		},
	});

	return User;
}
