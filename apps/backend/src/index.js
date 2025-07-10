require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 4000;

// Configuración de CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// Probar conexión a la base de datos
pool.connect((err, client, release) => {
	if (err) {
		return console.error("Error conectando a la base de datos:", err.stack);
	}
	console.log("Conectado a PostgreSQL");
	release();
});

// Ruta de prueba
app.get("/", (req, res) => {
	res.send("API de Mesa y Dados funcionando");
});

// Aquí se agregarán las rutas de autenticación y juegos

// Rutas de autenticación (por ejemplo: /api/auth/login)
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Rutas de juegos (por ejemplo: /api/games)
const gamesRoutes = require("./routes/games");
app.use("/api/games", gamesRoutes);

app.listen(port, () => {
	console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
