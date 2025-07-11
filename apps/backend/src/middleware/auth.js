const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	console.log("🔐 Authorization header:", authHeader);
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		console.log("❌ Token no proporcionado");
		return res.status(401).json({ message: "Token no proporcionado" });
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			console.log("❌ Token inválido:", err.message);
			return res.status(403).json({ message: "Token inválido" });
		}
		console.log("✅ Token válido, usuario:", user.username);
		req.user = user;
		next();
	});
}

module.exports = verifyToken;
