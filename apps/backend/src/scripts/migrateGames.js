const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

console.log("Configuración de conexión:", {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Ruta al archivo gamesData.js
const gamesDataPath = path.resolve(
	__dirname,
	"../../../frontend/src/data/gamesData.js"
);

console.log("Intentando leer:", gamesDataPath);

let gamesData;
try {
	const fileContent = fs.readFileSync(gamesDataPath, "utf-8");
	// Extraer el array de juegos del export
	const match = fileContent.match(
		/export const gamesData\s*=\s*(\[[\s\S]*?\]);/
	);
	if (!match) throw new Error("No se pudo extraer el array de juegos");
	// Usar Function para evaluar solo el array, evitando 'export'
	gamesData = Function('"use strict";return (' + match[1] + ")")();
	console.log("Juegos leídos:", gamesData.length);
	console.log(gamesData[0]);
} catch (err) {
	console.error("Error leyendo gamesData.js:", err);
	process.exit(1);
}

async function migrate() {
	for (const game of gamesData) {
		try {
			await pool.query(
				`INSERT INTO games
        (name, image, players, min_age, duration, categories, difficulty, rating, description, review, external_link, pros, cons, featured, rules_summary, rules_file)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
				[
					game.name,
					game.image,
					game.players,
					game.minAge,
					game.duration,
					game.categories,
					game.difficulty,
					game.rating,
					game.description,
					game.review,
					game.externalLink,
					game.pros,
					game.cons,
					game.featured || false,
					game.rules_summary || null,
					game.rules_file || null,
				]
			);
			console.log(`Juego insertado: ${game.name}`);
		} catch (err) {
			console.error(`Error insertando ${game.name}:`, err.message);
		}
	}
	await pool.end();
	console.log("Migración completada.");
}

migrate();
