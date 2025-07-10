const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findAdminByUsername } = require("../models/admin");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const admin = await findAdminByUsername(username);
		if (!admin) {
			return res
				.status(401)
				.json({ message: "Usuario o contraseña incorrectos" });
		}
		const valid = await bcrypt.compare(password, admin.password);
		if (!valid) {
			return res
				.status(401)
				.json({ message: "Usuario o contraseña incorrectos" });
		}
		const token = jwt.sign(
			{ id: admin.id, username: admin.username },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" }
		);
		res.json({ token });
	} catch (err) {
		res.status(500).json({ message: "Error en el servidor" });
	}
});

module.exports = router;
