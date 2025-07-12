const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const router = express.Router();

// Configuración de la base de datos
const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Ruta de login
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Usuario y contraseña son requeridos" });
		}

		// Buscar el usuario en la tabla admin
		const query = "SELECT * FROM admin WHERE username = $1";
		const result = await pool.query(query, [username]);

		if (result.rows.length === 0) {
			return res.status(401).json({ message: "Usuario no encontrado" });
		}

		const user = result.rows[0];

		// Verificar la contraseña
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return res.status(401).json({ message: "Contraseña incorrecta" });
		}

		// Generar token JWT
		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				isAdmin: true,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.json({
			token,
			user: {
				id: user.id,
				username: user.username,
				isAdmin: true,
			},
		});
	} catch (error) {
		console.error("Error en login:", error);
		res.status(500).json({ message: "Error interno del servidor" });
	}
});

module.exports = router;
