const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Buscar admin por nombre de usuario
async function findAdminByUsername(username) {
	const res = await pool.query("SELECT * FROM admin WHERE username = $1", [
		username,
	]);
	return res.rows[0];
}

// Crear un nuevo admin (para uso manual, no expuesto en la API)
async function createAdmin(username, password) {
	const hashedPassword = await bcrypt.hash(password, 10);
	await pool.query("INSERT INTO admin (username, password) VALUES ($1, $2)", [
		username,
		hashedPassword,
	]);
}

module.exports = {
	findAdminByUsername,
	createAdmin,
};
