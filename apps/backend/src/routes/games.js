const express = require("express");
const verifyToken = require("../middleware/auth");
const {
	getAllGames,
	getGameById,
	createGame,
	updateGame,
	deleteGame,
} = require("../models/game");
const multer = require("multer");
const path = require("path");

const router = express.Router();

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
		if (!updatedGame)
			return res.status(404).json({ message: "Juego no encontrado" });
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

module.exports = router;
