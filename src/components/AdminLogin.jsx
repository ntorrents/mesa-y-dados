import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin = ({ onLogin }) => {
	const { toast } = useToast();
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Simple client-side validation (for private use only)
	const validateCredentials = (username, password) => {
		// You can change these credentials as needed
		const validCredentials = [
			{
				username: import.meta.env.VITE_ADMIN_USERNAME,
				password: import.meta.env.VITE_ADMIN_PASSWORD,
			},
		];

		return validCredentials.some(
			(cred) => cred.username === username && cred.password === password
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate loading time
		setTimeout(() => {
			if (validateCredentials(credentials.username, credentials.password)) {
				// Store session
				localStorage.setItem(
					"admin-session",
					JSON.stringify({
						username: credentials.username,
						loginTime: Date.now(),
						expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
					})
				);

				toast({
					title: "¡Acceso concedido!",
					description: `Bienvenido/a, ${credentials.username}`,
				});

				onLogin(credentials.username);
			} else {
				toast({
					title: "Credenciales incorrectas",
					description: "Usuario o contraseña incorrectos",
					variant: "destructive",
				});
			}
			setIsLoading(false);
		}, 1000);
	};

	const handleChange = (e) => {
		setCredentials({
			...credentials,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-md">
				<Card className="glass-effect border-white/10">
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
							<Shield className="h-8 w-8 text-white" />
						</div>
						<CardTitle className="text-2xl font-bold text-white">
							Acceso Administrativo
						</CardTitle>
						<p className="text-gray-400 text-sm">
							Introduce tus credenciales para acceder al panel de administración
						</p>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="username"
									className="block text-white font-medium mb-2">
									Usuario
								</label>
								<Input
									id="username"
									name="username"
									type="text"
									required
									value={credentials.username}
									onChange={handleChange}
									placeholder="Introduce tu usuario"
									className="glass-effect border-white/20 text-white placeholder-gray-400"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-white font-medium mb-2">
									Contraseña
								</label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										required
										value={credentials.password}
										onChange={handleChange}
										placeholder="Introduce tu contraseña"
										className="glass-effect border-white/20 text-white placeholder-gray-400 pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50">
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Verificando...
									</>
								) : (
									<>
										<Lock className="h-4 w-4 mr-2" />
										Iniciar Sesión
									</>
								)}
							</Button>
						</form>

						<div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
							<p className="text-blue-400 text-xs text-center">
								🔒 Acceso restringido solo para administradores autorizados
							</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default AdminLogin;
