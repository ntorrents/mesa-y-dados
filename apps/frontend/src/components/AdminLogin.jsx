import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminLogin = () => {
	const { loginAdmin, isAdminAuthenticated, logoutAdmin } = useData();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		const result = await loginAdmin(username, password);
		setLoading(false);
		if (result.success) {
			setSuccess(true);
		} else {
			setError(result.message || "Error de autenticación");
		}
	};

	if (isAdminAuthenticated) {
		return (
			<div className="text-center p-6">
				<p className="text-green-400 font-bold mb-4">
					¡Sesión iniciada como administrador!
				</p>
				<button onClick={logoutAdmin} className="text-blue-400 underline">
					Cerrar sesión
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-sm mx-auto">
			<h2 className="text-xl font-bold text-white mb-4">
				Login de Administrador
			</h2>
			{error && <div className="text-red-400 text-sm mb-2">{error}</div>}
			<div>
				<label className="block text-white mb-1">Usuario</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full p-2 rounded bg-slate-800 text-white border border-white/20"
					required
				/>
			</div>
			<div>
				<label className="block text-white mb-1">Contraseña</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-2 rounded bg-slate-800 text-white border border-white/20"
					required
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition">
				{loading ? "Entrando..." : "Entrar"}
			</button>
		</form>
	);
};

export default AdminLogin;
