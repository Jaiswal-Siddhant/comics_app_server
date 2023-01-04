const dotenv = require('dotenv');
const app = require('./app.js');

process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down server due to Uncaught Promise Rejection`);
	process.exit(1);
});

dotenv.config({ path: './config/config.env' });
const connectDB = require('./db/database');
connectDB();

const server = app.listen(process.env.PORT, () => {
	console.log(`Listening on http://localhost:${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down server due to Unhandled Promise Rejection`);
	server.close(() => {
		process.exit(1);
	});
});
