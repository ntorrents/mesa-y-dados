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
		players,
		minAge,
		duration,
		categories,
		difficulty,
		rating,
		description,
		review,
		externalLink,
		pros,
		cons,
		featured,
		image,
		rulesFile,
		rulesSummary,
		rulesSections,
	} = game;

	// Convertir rulesSummary de string JSON a objeto JSON si es necesario
	let processedRulesSummary = rulesSummary;
	if (typeof rulesSummary === "string" && rulesSummary.trim().startsWith("[")) {
		try {
			processedRulesSummary = JSON.parse(rulesSummary);
		} catch (e) {
			// Si falla el parsing, usar el string original
		}
	}

	// Verificar rulesSections también
	let processedRulesSections = rulesSections;
	if (typeof rulesSections === "string") {
		try {
			processedRulesSections = JSON.parse(rulesSections);
		} catch (e) {
			// Si falla el parsing, usar el string original
		}
	} else if (typeof rulesSections === "object" && rulesSections !== null) {
		// Si es un objeto, convertirlo a JSON string para PostgreSQL
		processedRulesSections = JSON.stringify(rulesSections);
	}

	const res = await pool.query(
		`INSERT INTO games (
			name, players, min_age, duration, categories, difficulty, rating,
			description, review, external_link, pros, cons, featured,
			image, rules_file, rules_summary, rules_sections
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
		) RETURNING *`,
		[
			name,
			players,
			minAge,
			duration,
			categories,
			difficulty,
			rating,
			description,
			review,
			externalLink,
			pros,
			cons,
			featured,
			image,
			rulesFile,
			processedRulesSummary,
			processedRulesSections,
		]
	);
	return res.rows[0];
}

// Actualizar un juego
async function updateGame(id, game) {
	const {
		name,
		players,
		minAge,
		duration,
		categories,
		difficulty,
		rating,
		description,
		review,
		externalLink,
		pros,
		cons,
		featured,
		image,
		rulesFile,
		rulesSummary,
		rulesSections,
	} = game;

	try {
		// Convertir rulesSummary de string JSON a objeto JSON si es necesario
		let processedRulesSummary = rulesSummary;
		if (
			typeof rulesSummary === "string" &&
			rulesSummary.trim().startsWith("[")
		) {
			try {
				processedRulesSummary = JSON.parse(rulesSummary);
			} catch (e) {
				// Si falla el parsing, usar el string original
			}
		}

		// Verificar rulesSections también
		let processedRulesSections = rulesSections;
		if (typeof rulesSections === "string") {
			try {
				processedRulesSections = JSON.parse(rulesSections);
			} catch (e) {
				// Si falla el parsing, usar el string original
			}
		} else if (typeof rulesSections === "object" && rulesSections !== null) {
			// Si es un objeto, convertirlo a JSON string para PostgreSQL
			processedRulesSections = JSON.stringify(rulesSections);
		}

		const res = await pool.query(
			`UPDATE games SET 
				name = $1, players = $2, min_age = $3, duration = $4, categories = $5,
				difficulty = $6, rating = $7, description = $8, review = $9,
				external_link = $10, pros = $11, cons = $12, featured = $13,
				image = $14, rules_file = $15, rules_summary = $16, rules_sections = $17
			WHERE id = $18 RETURNING *`,
			[
				name,
				players,
				minAge,
				duration,
				categories,
				difficulty,
				rating,
				description,
				review,
				externalLink,
				pros,
				cons,
				featured,
				image,
				rulesFile,
				processedRulesSummary,
				processedRulesSections,
				id,
			]
		);
		return res.rows[0];
	} catch (error) {
		throw error;
	}
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
