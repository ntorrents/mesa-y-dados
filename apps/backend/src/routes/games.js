const express = require("express");
const verifyToken = require("../middleware/auth");
const {
	getAllGames,
	getGameById,
	createGame,
	updateGame,
	deleteGame,
} = require("../models/game");
const pool = require("../db");
console.log("POOL ES:", pool);
if (!pool || typeof pool.query !== "function") {
	throw new Error(
		"[IMPORT CSV] pool no está definido o no es válido. Verifica la ruta y la exportación de db.js"
	);
}
const multer = require("multer");
const path = require("path");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const csvParse = require("csv-parse").parse;
const fs = require("fs");
const os = require("os");

const router = express.Router();

console.log("🟢 Archivo games.js cargado");
console.log("🟢 Endpoint /export-csv registrado");

// Configuración de multer para imágenes
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../../../frontend/public/images/games/"));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext);
		const unique = `${base}-${Date.now()}${ext}`;
		cb(null, unique);
	},
});
const uploadImage = multer({ storage: imageStorage });

// Configuración de multer para PDFs
const pdfStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../../../frontend/public/rules/"));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext);
		const unique = `${base}-${Date.now()}${ext}`;
		cb(null, unique);
	},
});
const uploadPDF = multer({ storage: pdfStorage });

// Endpoint para subir imagen
router.post(
	"/upload-image",
	verifyToken,
	uploadImage.single("image"),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ message: "No se subió ningún archivo" });
		}
		const relativePath = `/images/games/${req.file.filename}`;
		res.json({ path: relativePath });
	}
);

// Endpoint para subir PDF
router.post(
	"/upload-rules",
	verifyToken,
	uploadPDF.single("rulesFile"),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ message: "No se subió ningún archivo" });
		}
		const relativePath = `/rules/${req.file.filename}`;
		res.json({ path: relativePath });
	}
);

// Obtener todos los juegos (público)
router.get("/", async (req, res) => {
	try {
		const games = await getAllGames();
		res.json(games);
	} catch (err) {
		console.error("Error en GET /api/games:", err);
		res.status(500).json({ message: "Error al obtener los juegos" });
	}
});

// Exportar todos los juegos como CSV
router.get("/export-csv", async (req, res) => {
	try {
		console.log("🔄 Iniciando exportación CSV...");
		const games = await getAllGames();
		console.log(`📊 Juegos obtenidos: ${games.length}`);

		if (!games || games.length === 0) {
			console.log("❌ No hay juegos para exportar");
			return res.status(404).json({ message: "No hay juegos para exportar" });
		}

		console.log("📝 Creando CSV stringifier...");
		// Usar punto y coma como delimitador
		const csvStringifier = createCsvStringifier({
			header: [
				{ id: "id", title: "id" },
				{ id: "name", title: "name" },
				{ id: "players", title: "players" },
				{ id: "min_age", title: "min_age" },
				{ id: "duration", title: "duration" },
				{ id: "categories", title: "categories" },
				{ id: "difficulty", title: "difficulty" },
				{ id: "rating", title: "rating" },
				{ id: "description", title: "description" },
				{ id: "review", title: "review" },
				{ id: "external_link", title: "external_link" },
				{ id: "pros", title: "pros" },
				{ id: "cons", title: "cons" },
				{ id: "featured", title: "featured" },
				{ id: "image", title: "image" },
				{ id: "rules_file", title: "rules_file" },
				{ id: "rules_sections", title: "rules_sections" },
			],
			delimiter: ";",
		});

		console.log("🔄 Procesando datos de juegos...");
		// Convertir arrays/objetos a string para CSV
		const records = games.map((g, index) => {
			console.log(`📋 Procesando juego ${index + 1}: ${g.name}`);
			return {
				...g,
				categories: Array.isArray(g.categories)
					? g.categories.join(",")
					: g.categories,
				pros: Array.isArray(g.pros) ? g.pros.join("\n") : g.pros,
				cons: Array.isArray(g.cons) ? g.cons.join("\n") : g.cons,
				rules_sections:
					typeof g.rules_sections === "object"
						? JSON.stringify(g.rules_sections)
						: g.rules_sections,
			};
		});

		console.log("📄 Generando CSV...");
		const csv =
			csvStringifier.getHeaderString() +
			csvStringifier.stringifyRecords(records);
		// Añadir BOM UTF-8 para compatibilidad con Excel
		const csvWithBom = "\uFEFF" + csv;
		console.log("📤 Enviando respuesta...");
		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=games_export.csv"
		);
		res.send(csvWithBom);
		console.log("✅ CSV exportado exitosamente");
	} catch (err) {
		console.error("❌ Error exportando juegos a CSV:", err);
		console.error("Stack trace:", err.stack);
		res.status(500).json({
			message: "Error exportando juegos a CSV",
			error: err.message,
			stack: err.stack,
		});
	}
});

// Obtener un juego por ID (público)
router.get("/:id", async (req, res) => {
	try {
		const game = await getGameById(req.params.id);
		if (!game) return res.status(404).json({ message: "Juego no encontrado" });
		res.json(game);
	} catch (err) {
		res.status(500).json({ message: "Error al obtener el juego" });
	}
});

// Crear un juego (solo admin)
router.post("/", verifyToken, async (req, res) => {
	console.log("POST /api/games recibido");
	console.log("Body:", req.body);
	try {
		const newGame = await createGame(req.body);
		res.status(201).json(newGame);
	} catch (err) {
		console.error("Error en POST /api/games:", err);
		res.status(500).json({ message: "Error al crear el juego" });
	}
});

// Actualizar un juego (solo admin)
router.put("/:id", verifyToken, async (req, res) => {
	try {
		const updatedGame = await updateGame(req.params.id, req.body);
		if (!updatedGame) {
			return res.status(404).json({ message: "Juego no encontrado" });
		}
		res.json(updatedGame);
	} catch (err) {
		res.status(500).json({ message: "Error al actualizar el juego" });
	}
});

// Eliminar un juego (solo admin)
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		await deleteGame(req.params.id);
		res.status(204).end();
	} catch (err) {
		res.status(500).json({ message: "Error al eliminar el juego" });
	}
});

// Importar juegos desde CSV (actualiza o inserta)
router.post("/import-csv", uploadImage.single("file"), async (req, res) => {
	try {
		// Limpiar todos los juegos antes de importar
		await pool.query("DELETE FROM games");
		if (!req.file) {
			return res
				.status(400)
				.json({ message: "No se subió ningún archivo CSV" });
		}
		const results = [];
		const errors = [];
		const filePath = req.file.path;
		const tryParse = (delimiter) =>
			new Promise((resolve, reject) => {
				const tempResults = [];
				fs.createReadStream(filePath)
					.pipe(
						csvParse({
							columns: true,
							trim: true,
							delimiter,
							relax_quotes: true,
						})
					)
					.on("data", (row) => tempResults.push(row))
					.on("end", () => resolve(tempResults))
					.on("error", (err) => reject(err));
			});
		let parsedRows = [];
		try {
			parsedRows = await tryParse(";");
			// Si no hay suficientes columnas, reintenta con coma
			if (parsedRows.length > 0 && Object.keys(parsedRows[0]).length < 5) {
				parsedRows = await tryParse(",");
			}
		} catch (err) {
			// Si falla con punto y coma, intenta con coma
			try {
				parsedRows = await tryParse(",");
			} catch (err2) {
				fs.unlinkSync(filePath);
				console.error("❌ Error procesando el CSV:", err2);
				return res
					.status(500)
					.json({ message: "Error procesando el CSV", error: err2.message });
			}
		}
		for (const row of parsedRows) {
			try {
				if (row.categories)
					row.categories = row.categories.split(",").map((c) => c.trim());
				if (row.pros) row.pros = row.pros.split("\n");
				if (row.cons) row.cons = row.cons.split("\n");
				if (row.rules_sections) {
					try {
						row.rules_sections = JSON.parse(row.rules_sections);
					} catch (e) {
						// dejar como string si no es JSON válido
					}
				}
				if (row.rating) {
					if (Array.isArray(row.rating)) {
						row.rating = row.rating[0];
					}
					if (typeof row.rating === "string") {
						row.rating = row.rating.trim().replace(/"/g, "").replace(",", ".");
						row.rating = parseFloat(row.rating);
					}
					if (typeof row.rating !== "number" || isNaN(row.rating)) {
						row.rating = null;
					}
				}
				if (row.id) {
					const updated = await updateGame(row.id, row);
					if (!updated) {
						const { id, ...rowWithoutId } = row;
						await createGame(rowWithoutId);
					}
				} else {
					await createGame(row);
				}
				// Normaliza min_age
				if (row.min_age === undefined && row.minAge !== undefined) {
					row.min_age = row.minAge;
				}
				if (row.min_age !== undefined) {
					row.min_age = parseInt(row.min_age, 10) || null;
				}
			} catch (err) {
				errors.push({ row, error: err.message });
			}
		}
		fs.unlinkSync(filePath);
		if (errors.length > 0) {
			return res
				.status(207)
				.json({ message: "Algunos juegos no se importaron", errors });
		}
		res.json({ message: "Importación completada" });
	} catch (err) {
		console.error("❌ Error inesperado en import-csv:", err);
		res
			.status(500)
			.json({ message: "Error inesperado en import-csv", error: err.message });
	}
});

module.exports = router;
