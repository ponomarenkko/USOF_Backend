import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import PQueue from "p-queue";
import { fileURLToPath } from "url";
import mysqldump from "mysqldump";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = `models`;

const getModelRelativePath = (name) => `./${modelsDir}/${name}`;
const modelsPath = path.join(__dirname, modelsDir);
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		// retry: {
		//     match: [/Deadlock/i],
		//     max: 3,
		//     backoffBase: 1000,
		//     backoffExponent: 1.5,
		// },
	},
);

sequelize.readModels = async () => {
	console.log(`in reading`);
	for (const file1 of fs.readdirSync(modelsPath).filter((file) => {
		return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
	})) {
		console.log(`in foreach: ${file1}`);
		const model = await import(getModelRelativePath(file1));

		console.log(`reading: ${file1}`);
		await model.default(sequelize, Sequelize.DataTypes);
		console.log(`Read: ${file1}`);
	}
};

sequelize.testConnection = async () => {
	sequelize
		.authenticate()
		.then(() => {
			console.log(
				"Database: Connection has been established successfully",
			);
		})
		.catch((error) => {
			console.error(
				"Database: Unable to connect to the database: ",
				error,
			);
		});
};

sequelize.createTable = async (config) => {
	const associations = await import(`./associations.js`);

	console.log(`Start reading`);
	await sequelize.readModels();
	console.log(`Start associations`);
	await associations.default(sequelize);
	await sequelize.sync(config);
};

sequelize.initDatabase = async () => {
	await sequelize.testConnection();
	await sequelize.createTable();
};

sequelize.dump = (filePath) => {
	mysqldump({
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		},
		dumpToFile: filePath,
	})
		.then(() => {
			console.log(`Dump completed in ${filePath}`); // TODO: log it
		})
		.catch((err) => {
			console.log(err);
		});
};

sequelize.queue = new PQueue({
	concurrency: sequelize.connectionManager.pool.maxSize - 1,
});

sequelize.inTransaction = (fn) =>
	sequelize.queue.add(() =>
		sequelize.transaction((transaction) => fn(transaction)),
	);

sequelize.Sequelize = Sequelize;

await sequelize.initDatabase();

export default sequelize;
