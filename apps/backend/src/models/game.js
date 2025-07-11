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
	const {
		name,
		description,
		image,
		players,
		minAge,
		duration,
		categories,
		difficulty,
		rating,
		review,
		externalLink,
		pros,
		cons,
		featured,
		rulesSummary,
		rulesFile,
	} = game;
	const res = await pool.query(
		`INSERT INTO games
		(name, description, image, players, min_age, duration, categories, difficulty, rating, review, external_link, pros, cons, featured, rules_summary, rules_file)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
		RETURNING *`,
		[
			name,
			description,
			image,
			players,
			minAge,
			duration,
			categories,
			difficulty,
			rating,
			review,
			externalLink,
			pros,
			cons,
			featured || false,
			rulesSummary || null,
			rulesFile || null,
		]
	);
	return res.rows[0];
}

// Actualizar un juego
async function updateGame(id, game) {
	const {
		name,
		description,
		image,
		players,
		minAge,
		duration,
		categories,
		difficulty,
		rating,
		review,
		externalLink,
		pros,
		cons,
		featured,
		rulesSummary,
		rulesFile,
	} = game;
	const res = await pool.query(
		`UPDATE games SET
		name = $1,
		description = $2,
		image = $3,
		players = $4,
		min_age = $5,
		duration = $6,
		categories = $7,
		difficulty = $8,
		rating = $9,
		review = $10,
		external_link = $11,
		pros = $12,
		cons = $13,
		featured = $14,
		rules_summary = $15,
		rules_file = $16
		WHERE id = $17 RETURNING *`,
		[
			name,
			description,
			image,
			players,
			minAge,
			duration,
			categories,
			difficulty,
			rating,
			review,
			externalLink,
			pros,
			cons,
			featured || false,
			rulesSummary || null,
			rulesFile || null,
			id,
		]
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
