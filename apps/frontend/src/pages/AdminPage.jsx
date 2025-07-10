import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
	Plus,
	Edit,
	Trash2,
	Download,
	RefreshCw,
	LogOut,
	User,
	Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AdminGameForm from "@/components/AdminGameForm";
import AdminBlogForm from "@/components/AdminBlogForm";
import AdminLogin from "@/components/AdminLogin";
import { useData } from "@/contexts/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
	const { toast } = useToast();
	const {
		games,
		addGame,
		updateGame,
		deleteGame,
		blogPosts,
		saveBlogPosts,
		resetToOriginalData,
		exportData,
		isAdminAuthenticated,
	} = useData();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const [isGameFormVisible, setIsGameFormVisible] = useState(false);
	const [editingGame, setEditingGame] = useState(null);

	const [isBlogFormVisible, setIsBlogFormVisible] = useState(false);
	const [editingPost, setEditingPost] = useState(null);

	// Check for existing session on component mount
	useEffect(() => {
		const checkSession = () => {
			try {
				const session = localStorage.getItem("admin-session");
				if (session) {
					const sessionData = JSON.parse(session);
					if (sessionData.expiresAt > Date.now()) {
						setIsAuthenticated(true);
						setCurrentUser(sessionData.username);
					} else {
						localStorage.removeItem("admin-session");
					}
				}
			} catch (error) {
				console.error("Error checking session:", error);
				localStorage.removeItem("admin-session");
			}
			setIsLoading(false);
		};

		checkSession();
	}, []);

	const handleLogin = (username) => {
		setIsAuthenticated(true);
		setCurrentUser(username);
	};

	const handleLogout = () => {
		localStorage.removeItem("admin-session");
		setIsAuthenticated(false);
		setCurrentUser(null);
		toast({
			title: "Sesión cerrada",
			description: "Has cerrado sesión correctamente",
		});
	};

	const handleShowAddGameForm = () => {
		setEditingGame(null);
		setIsGameFormVisible(true);
	};

	const handleEditGame = (game) => {
		setEditingGame(game);
		setIsGameFormVisible(true);
	};

	const handleDeleteGame = async (gameId) => {
		if (window.confirm("¿Estás seguro de que quieres eliminar este juego?")) {
			// Obtener token de sesión
			const session = JSON.parse(localStorage.getItem("admin-session"));
			const token = session?.token;
			const result = await deleteGame(gameId, token);
			if (result.success) {
				toast({
					title: "Juego eliminado",
					description: "El juego se ha eliminado del catálogo",
				});
			} else {
				toast({
					title: "Error",
					description: result.message || "No se pudo eliminar el juego",
				});
			}
		}
	};

	const handleGameFormSubmit = async (formData) => {
		// Obtener token de sesión
		const session = JSON.parse(localStorage.getItem("admin-session"));
		const token = session?.token;
		let result;
		if (editingGame) {
			result = await updateGame(editingGame.id, formData, token);
			if (result.success) {
				toast({
					title: "¡Juego actualizado!",
					description: "Los cambios se han guardado correctamente",
				});
			} else {
				toast({
					title: "Error",
					description: result.message || "No se pudo actualizar el juego",
				});
			}
		} else {
			result = await addGame(formData, token);
			if (result.success) {
				toast({
					title: "¡Juego añadido!",
					description: `${formData.name} se ha añadido al catálogo`,
				});
			} else {
				toast({
					title: "Error",
					description: result.message || "No se pudo añadir el juego",
				});
			}
		}
		setIsGameFormVisible(false);
		setEditingGame(null);
	};

	const handleShowAddBlogForm = () => {
		setEditingPost(null);
		setIsBlogFormVisible(true);
	};

	const handleEditPost = (post) => {
		setEditingPost(post);
		setIsBlogFormVisible(true);
	};

	const handleDeletePost = (postId) => {
		if (
			window.confirm("¿Estás seguro de que quieres eliminar este artículo?")
		) {
			const updatedPosts = blogPosts.filter((post) => post.id !== postId);
			saveBlogPosts(updatedPosts);
			toast({
				title: "Artículo eliminado",
				description: "El artículo ha sido eliminado del blog",
			});
		}
	};

	const handleBlogFormSubmit = (formData) => {
		if (editingPost) {
			const updatedPosts = blogPosts.map((post) =>
				post.id === editingPost.id ? { ...post, ...formData } : post
			);
			saveBlogPosts(updatedPosts);
			toast({
				title: "¡Artículo actualizado!",
				description: "Los cambios se han guardado.",
			});
		} else {
			const newPost = {
				...formData,
				id: Date.now(),
				author: "Mesa & Dados",
				date: new Date().toISOString().slice(0, 10),
			};
			const updatedPosts = [...blogPosts, newPost];
			saveBlogPosts(updatedPosts);
			toast({
				title: "¡Artículo añadido!",
				description: `El artículo "${newPost.title}" se ha publicado.`,
			});
		}
		setIsBlogFormVisible(false);
		setEditingPost(null);
	};

	const handleResetData = () => {
		if (
			window.confirm(
				"¿Estás seguro de que quieres resetear todos los datos a los valores originales? Esta acción no se puede deshacer."
			)
		) {
			resetToOriginalData();
			toast({
				title: "Datos reseteados",
				description:
					"Todos los datos han sido restaurados a los valores originales",
			});
		}
	};

	const handleExportData = () => {
		exportData();
		toast({
			title: "Datos exportados",
			description: "El archivo de respaldo se ha descargado correctamente",
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!isAdminAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="max-w-md w-full">
					<AdminLogin />
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Administración - Mesa & Dados</title>
				<meta
					name="description"
					content="Panel de administración para gestionar el catálogo de juegos de mesa y el blog."
				/>
			</Helmet>

			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Header with user info and logout */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-4xl font-bold gradient-text mb-2">
								Panel de Administración
							</h1>
							<p className="text-gray-400">
								Gestiona el contenido de tu web: juegos y artículos del blog.
							</p>
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 text-gray-400">
								<User className="h-4 w-4" />
								<span className="text-sm">Hola, {currentUser}</span>
							</div>
							<Button
								onClick={handleLogout}
								variant="outline"
								size="sm"
								className="border-red-500/30 text-red-400 hover:bg-red-500/10">
								<LogOut className="h-4 w-4 mr-2" />
								Cerrar Sesión
							</Button>
						</div>
					</motion.div>

					{/* Data management tools */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mb-8">
						<Card className="glass-effect border-white/10">
							<CardHeader>
								<CardTitle className="text-white flex items-center">
									<Database className="h-5 w-5 mr-2" />
									Gestión de Datos
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-4">
									<Button
										onClick={handleExportData}
										variant="outline"
										className="border-green-500/30 text-green-400 hover:bg-green-500/10">
										<Download className="h-4 w-4 mr-2" />
										Exportar Backup
									</Button>
									<Button
										onClick={handleResetData}
										variant="outline"
										className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
										<RefreshCw className="h-4 w-4 mr-2" />
										Resetear a Original
									</Button>
								</div>
								<p className="text-gray-400 text-sm mt-3">
									Exporta un backup de todos los datos o resetea a los valores
									originales del código fuente.
								</p>
							</CardContent>
						</Card>
					</motion.div>

					<Tabs defaultValue="games" className="w-full">
						<TabsList className="grid w-full grid-cols-2 glass-effect mb-8">
							<TabsTrigger value="games">
								Gestionar Juegos ({games.length})
							</TabsTrigger>
							<TabsTrigger value="blog">
								Gestionar Blog ({blogPosts.length})
							</TabsTrigger>
						</TabsList>

						<TabsContent value="games">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}>
								<div className="flex justify-end mb-4">
									<Button
										onClick={handleShowAddGameForm}
										className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
										<Plus className="h-4 w-4 mr-2" /> Añadir Juego
									</Button>
								</div>
								<AnimatePresence>
									{isGameFormVisible && (
										<AdminGameForm
											initialData={editingGame}
											onSubmit={handleGameFormSubmit}
											onCancel={() => setIsGameFormVisible(false)}
										/>
									)}
								</AnimatePresence>

								<Card className="glass-effect border-white/10">
									<CardHeader>
										<CardTitle className="text-white">
											Juegos en el Catálogo
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4 max-h-96 overflow-y-auto">
											{games.map((game) => (
												<div
													key={game.id}
													className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/10">
													<div className="flex-1">
														<h3 className="text-white font-semibold">
															{game.name}
														</h3>
														<p className="text-gray-400 text-sm">
															{(game.categories || []).join(", ")} •{" "}
															{game.players} jugadores
														</p>
														{game.rating && (
															<div className="flex items-center mt-1">
																<span className="text-yellow-400 text-sm">
																	★ {game.rating}
																</span>
															</div>
														)}
													</div>
													<div className="flex space-x-2">
														<Button
															onClick={() => handleEditGame(game)}
															variant="outline"
															size="sm"
															className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															onClick={() => handleDeleteGame(game.id)}
															variant="outline"
															size="sm"
															className="border-red-500/30 text-red-400 hover:bg-red-500/10">
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</TabsContent>

						<TabsContent value="blog">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}>
								<div className="flex justify-end mb-4">
									<Button
										onClick={handleShowAddBlogForm}
										className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
										<Plus className="h-4 w-4 mr-2" /> Añadir Artículo
									</Button>
								</div>
								<AnimatePresence>
									{isBlogFormVisible && (
										<AdminBlogForm
											initialData={editingPost}
											onSubmit={handleBlogFormSubmit}
											onCancel={() => setIsBlogFormVisible(false)}
										/>
									)}
								</AnimatePresence>

								<Card className="glass-effect border-white/10">
									<CardHeader>
										<CardTitle className="text-white">
											Artículos del Blog
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4 max-h-96 overflow-y-auto">
											{blogPosts.map((post) => (
												<div
													key={post.id}
													className="flex items-center justify-between p-4 glass-effect rounded-lg border border-white/10">
													<div className="flex-1">
														<h3 className="text-white font-semibold">
															{post.title}
														</h3>
														<p className="text-gray-400 text-sm">
															{post.category} • {post.date} • {post.readTime}
														</p>
														{post.featured && (
															<Badge className="bg-yellow-500 text-black text-xs mt-1">
																Destacado
															</Badge>
														)}
													</div>
													<div className="flex space-x-2">
														<Button
															onClick={() => handleEditPost(post)}
															variant="outline"
															size="sm"
															className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															onClick={() => handleDeletePost(post.id)}
															variant="outline"
															size="sm"
															className="border-red-500/30 text-red-400 hover:bg-red-500/10">
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default AdminPage;
