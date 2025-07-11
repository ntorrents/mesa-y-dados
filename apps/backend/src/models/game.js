const { Pool } = require("pg");

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Obtener todos los juegos
async function getAllGames() {
	const res = await pool.query("SELECT * FROM games ORDER BY id");
	return res.rows;
}

// Obtener un juego por ID
async function getGameById(id) {
	const res = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
	return res.rows[0];
}

// Crear un nuevo juego
async function createGame(game) {
	const { name, description, image, ...rest } = game;
	const res = await pool.query(
		"INSERT INTO games (name, description, image) VALUES ($1, $2, $3) RETURNING *",
		[name, description, image]
	);
	return res.rows[0];
}

// Actualizar un juego
async function updateGame(id, game) {
	const { name, description, image, ...rest } = game;
	const res = await pool.query(
		"UPDATE games SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *",
		[name, description, image, id]
	);
	return res.rows[0];
}

// Eliminar un juego
async function deleteGame(id) {
	await pool.query("DELETE FROM games WHERE id = $1", [id]);
}

module.exports = {
	getAllGames,
	getGameById,
	createGame,
	updateGame,
	deleteGame,
};
