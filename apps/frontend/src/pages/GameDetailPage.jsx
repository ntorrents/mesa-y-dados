import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Users,
	Clock,
	Star,
	ExternalLink,
	ThumbsUp,
	ThumbsDown,
	BookOpen,
	Zap,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";

const GameDetailPage = () => {
	const { id } = useParams();
	const { toast } = useToast();
	const { games } = useData();
	const [game, setGame] = useState(null);
	const [relatedGames, setRelatedGames] = useState([]);
	const [activeTab, setActiveTab] = useState("resumen");

	useEffect(() => {
		if (games.length > 0) {
			const gameId = parseInt(id);
			const foundGame = games.find((g) => g.id === gameId);

			if (foundGame) {
				setGame(foundGame);

				const related = games
					.filter(
						(g) =>
							g.id !== gameId &&
							g.categories.some((cat) => foundGame.categories.includes(cat))
					)
					.slice(0, 3);
				setRelatedGames(related);
			}
		}
	}, [id, games]);

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Fácil":
				return "difficulty-easy";
			case "Medio":
				return "difficulty-medium";
			case "Difícil":
				return "difficulty-hard";
			default:
				return "bg-gray-500";
		}
	};

	const getCategoryColor = (category) => {
		const categoryMap = {
			Estrategia: "category-strategy",
			Party: "category-party",
			Cooperativo: "category-cooperative",
			Familiar: "category-family",
			Abstracto: "category-abstract",
			Comercio: "category-cooperative",
			Cartas: "category-strategy",
			Subasta: "category-party",
		};
		return categoryMap[category] || "bg-blue-500";
	};

	const handleExternalLink = () => {
		if (game?.externalLink) {
			window.open(game.externalLink, "_blank");
		} else {
			toast({
				title:
					"🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! ��",
			});
		}
	};

	if (!game) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-white mb-4">
						Juego no encontrado
					</h2>
					<Link to="/juegos">
						<Button variant="outline">Volver al catálogo</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>{game.name} - Mesa & Dados</title>
				<meta
					name="description"
					content={`Reseña completa de ${game.name}: ${game.description}`}
				/>
			</Helmet>

			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-8">
						<Link
							to="/juegos"
							className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Volver al catálogo
						</Link>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Sidebar con información del juego */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="lg:col-span-1">
							<Card className="glass-effect border-white/10">
								<CardContent className="p-6">
									{/* Imagen del juego */}
									{game.image && (
										<div className="mb-6">
											<img
												src={game.image}
												alt={game.name}
												className="w-full h-48 object-cover rounded-lg border border-white/10"
											/>
										</div>
									)}

									<div className="space-y-4">
										{game.rating && (
											<div className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
												<Star className="h-5 w-5 text-yellow-400 fill-current" />
												<span className="text-xl font-bold text-yellow-400">
													{game.rating}
												</span>
												<span className="text-gray-400">/5</span>
											</div>
										)}

										<div className="grid grid-cols-2 gap-3">
											<div className="text-center p-3 glass-effect rounded-lg">
												<Users className="h-5 w-5 text-blue-400 mx-auto mb-2" />
												<div className="text-white font-medium text-sm">
													{game.players}
												</div>
												<div className="text-gray-400 text-xs">Jugadores</div>
											</div>
											<div className="text-center p-3 glass-effect rounded-lg">
												<Clock className="h-5 w-5 text-green-400 mx-auto mb-2" />
												<div className="text-white font-medium text-sm">
													{game.duration}
												</div>
												<div className="text-gray-400 text-xs">Duración</div>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="text-center p-3 glass-effect rounded-lg">
												<div className="text-white font-medium text-sm">
													{game.minAge}+
												</div>
												<div className="text-gray-400 text-xs">Edad mínima</div>
											</div>
											<div className="text-center p-3 glass-effect rounded-lg">
												<Badge
													className={`${getDifficultyColor(
														game.difficulty
													)} text-white border-0 text-xs`}>
													{game.difficulty}
												</Badge>
											</div>
										</div>

										<div>
											<h3 className="text-white font-medium mb-2 text-sm">
												Categorías
											</h3>
											<div className="flex flex-wrap gap-2">
												{game.categories.map((category, idx) => (
													<Badge
														key={idx}
														className={`${getCategoryColor(
															category
														)} text-white border-0 text-xs`}>
														{category}
													</Badge>
												))}
											</div>
										</div>

										<Button
											onClick={handleExternalLink}
											className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm">
											<ExternalLink className="h-4 w-4 mr-2" />
											Ver en BoardGameGeek
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Contenido principal con tabs */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="lg:col-span-2 space-y-6">
							{/* Título del juego */}
							<div>
								<h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
									{game.name}
								</h1>
								<p className="text-lg text-gray-300">{game.description}</p>
							</div>

							{/* Navegación por tabs */}
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full">
								<TabsList className="grid w-full grid-cols-2 glass-effect border-white/10">
									<TabsTrigger
										value="resumen"
										className="flex items-center gap-2 text-sm">
										<FileText className="h-4 w-4" />
										Resumen
									</TabsTrigger>
									<TabsTrigger
										value="reglas"
										className="flex items-center gap-2 text-sm">
										<BookOpen className="h-4 w-4" />
										Reglas
									</TabsTrigger>
								</TabsList>

								{/* Contenido del tab Resumen */}
								<TabsContent value="resumen" className="mt-6">
									<Card className="glass-effect border-white/10">
										<CardHeader>
											<CardTitle className="text-white flex items-center">
												<FileText className="h-5 w-5 mr-2" />
												Resumen del Juego
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="prose prose-invert max-w-none">
												<div className="text-gray-300 leading-relaxed space-y-4">
													{game.review.split("\n\n").map((paragraph, index) => (
														<p key={index} className="text-gray-300">
															{paragraph}
														</p>
													))}
												</div>
												{(game.pros?.length > 0 || game.cons?.length > 0) && (
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
														{game.pros?.length > 0 && (
															<Card className="glass-effect border-white/10">
																<CardHeader>
																	<CardTitle className="text-green-400 flex items-center text-lg">
																		<ThumbsUp className="h-5 w-5 mr-2" />
																		Lo que me gusta
																	</CardTitle>
																</CardHeader>
																<CardContent>
																	<ul className="space-y-2">
																		{game.pros.map((pro, idx) => (
																			<li
																				key={idx}
																				className="text-gray-300 flex items-start text-sm">
																				<span className="text-green-400 mr-2">
																					•
																				</span>
																				{pro}
																			</li>
																		))}
																	</ul>
																</CardContent>
															</Card>
														)}
														{game.cons?.length > 0 && (
															<Card className="glass-effect border-white/10">
																<CardHeader>
																	<CardTitle className="text-red-400 flex items-center text-lg">
																		<ThumbsDown className="h-5 w-5 mr-2" />
																		Puntos a mejorar
																	</CardTitle>
																</CardHeader>
																<CardContent>
																	<ul className="space-y-2">
																		{game.cons.map((con, idx) => (
																			<li
																				key={idx}
																				className="text-gray-300 flex items-start text-sm">
																				<span className="text-red-400 mr-2">
																					•
																				</span>
																				{con}
																			</li>
																		))}
																	</ul>
																</CardContent>
															</Card>
														)}
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								{/* Contenido del tab Reglas */}
								<TabsContent value="reglas" className="mt-6">
									<Card className="glass-effect border-white/10">
										<CardHeader>
											<CardTitle className="text-white flex items-center">
												<BookOpen className="h-5 w-5 mr-2" />
												Reglas del Juego
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="prose prose-invert max-w-none">
												{game.rulesSummary && (
													<div className="text-gray-300 leading-relaxed space-y-4 mb-6">
														<h3 className="text-lg font-semibold text-white mb-3">
															Resumen de Reglas (2 minutos de lectura)
														</h3>
														{game.rulesSummary
															.split("\n\n")
															.map((paragraph, index) => (
																<p key={index} className="text-gray-300">
																	{paragraph}
																</p>
															))}
													</div>
												)}
												{game.rulesFile && (
													<div className="border-t border-white/10 pt-4">
														<h3 className="text-lg font-semibold text-white mb-3">
															Reglas Completas
														</h3>
														<p className="text-gray-300 mb-4">
															Descarga el manual completo con todas las reglas
															detalladas del juego.
														</p>
														<a
															href={game.rulesFile}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
															<FileText className="h-4 w-4" />
															Descargar Reglas Completas (PDF)
														</a>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>

							{/* Juegos relacionados */}
							{relatedGames.length > 0 && (
								<Card className="glass-effect border-white/10">
									<CardHeader>
										<CardTitle className="text-white">
											Juegos Relacionados
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
											{relatedGames.map((relatedGame) => (
												<Link
													key={relatedGame.id}
													to={`/juego/${relatedGame.id}`}
													className="block p-4 glass-effect rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors group">
													<h4 className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm">
														{relatedGame.name}
													</h4>
													<p className="text-gray-400 text-xs mt-1">
														{relatedGame.players} • {relatedGame.duration}
													</p>
													{relatedGame.rating && (
														<div className="flex items-center mt-2">
															<Star className="h-3 w-3 text-yellow-400 fill-current" />
															<span className="text-yellow-400 text-xs ml-1">
																{relatedGame.rating}
															</span>
														</div>
													)}
												</Link>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GameDetailPage;
