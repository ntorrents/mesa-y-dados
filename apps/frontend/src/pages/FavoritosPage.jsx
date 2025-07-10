import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
	Heart,
	Star,
	Users,
	Clock,
	Trophy,
	Zap,
	Home,
	Gamepad2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";

const FavoritosPage = () => {
	const { games } = useData();

	// Helper function to find game by name
	const findGameByName = (name) => {
		return games.find(
			(game) =>
				game.name.toLowerCase().includes(name.toLowerCase()) ||
				name.toLowerCase().includes(game.name.toLowerCase())
		);
	};

	// Nil's favorites
	const nilFavorites = {
		avatar: "👨‍💻",
		name: "Nil",
		description: "Estratega empedernido y amante de las cartas",
		favorites: [
			{ category: "Mejor juego para 2", game: "Splendor Duel", icon: Users },
			{
				category: "Juego de cartas favorito",
				game: "High Society",
				icon: Gamepad2,
			},
			{
				category: "Juego de estrategia favorito",
				game: "Jerusalem",
				icon: Trophy,
			},
			{ category: "Mejor juego rápido", game: "Love Letter", icon: Zap },
			{ category: "Juego fácil favorito", game: "Manchas", icon: Star },
			{ category: "Mejor juego familiar", game: "Dixit", icon: Home },
		],
	};

	// Christine's favorites
	const christineFavorites = {
		avatar: "👩‍🎨",
		name: "Christine",
		description: "Fanática de los juegos rápidos y de 2 jugadores",
		favorites: [
			{ category: "Mejor juego para 2", game: "Jaipur", icon: Users },
			{
				category: "Juego de cartas favorito",
				game: "Symbiose",
				icon: Gamepad2,
			},
			{
				category: "Juego de estrategia favorito",
				game: "Catan",
				icon: Trophy,
			},
			{
				category: "Mejor juego rápido",
				game: "Exploding Kittens: Edición 2 jugadores",
				icon: Zap,
			},
			{ category: "Juego fácil favorito", game: "Pelusas", icon: Star },
			{ category: "Mejor juego familiar", game: "Azul", icon: Home },
		],
	};

	const FavoriteCard = ({ person }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="w-full">
			<Card className="glass-effect border-white/10 h-full">
				<CardHeader className="text-center pb-4">
					<div className="text-6xl mb-3">{person.avatar}</div>
					<CardTitle className="text-2xl font-bold gradient-text mb-2">
						{person.name}
					</CardTitle>
					<p className="text-gray-400 text-sm">{person.description}</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{person.favorites.map((favorite, index) => {
							const game = findGameByName(favorite.game);
							const IconComponent = favorite.icon;

							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="flex items-center justify-between p-3 glass-effect rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors group">
									<div className="flex items-center space-x-3">
										<div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20">
											<IconComponent className="h-4 w-4 text-blue-400" />
										</div>
										<div>
											<p className="text-gray-400 text-xs font-medium">
												{favorite.category}
											</p>
											<p className="text-white font-semibold text-sm">
												{favorite.game}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										{game && (
											<>
												<Link
													to={`/juego/${game.id}`}
													className="text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium opacity-0 group-hover:opacity-100">
													Ver →
												</Link>
											</>
										)}
									</div>
								</motion.div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);

	return (
		<>
			<Helmet>
				<title>Favoritos - Mesa & Dados</title>
				<meta
					name="description"
					content="Descubre los juegos favoritos de Nil y Christine, actualizados mensualmente con nuestras mejores recomendaciones por categorías."
				/>
			</Helmet>

			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12">
						<div className="flex items-center justify-center mb-4">
							<Heart className="h-8 w-8 text-red-500 mr-3" />
							<h1 className="text-4xl md:text-5xl font-bold gradient-text">
								Favoritos
							</h1>
							<Heart className="h-8 w-8 text-red-500 ml-3" />
						</div>
						<p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
							Esta es una página personal que actualizamos mensualmente con
							nuestros juegos de mesa favoritos. Os compartimos nuestras
							elecciones en diferentes categorías basándonos en lo que más hemos
							disfrutado ese mes.
						</p>
					</motion.div>

					{/* Monthly update badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="flex justify-center mb-12">
						<Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 px-4 py-2 text-sm">
							📅 Actualizado: Julio 2025
						</Badge>
					</motion.div>

					{/* Favorites Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<FavoriteCard person={nilFavorites} />
						<FavoriteCard person={christineFavorites} />
					</div>

					{/* Bottom CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mt-16 text-center">
						<Card className="glass-effect border-white/10 p-8 max-w-2xl mx-auto">
							<div className="text-4xl mb-4">🎲</div>
							<h2 className="text-2xl font-bold text-white mb-4">
								¿Quieres conocer más sobre estos juegos?
							</h2>
							<p className="text-gray-400 mb-6">
								Explora nuestro catálogo completo con reseñas detalladas de
								todos estos juegos y muchos más.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link to="/juegos">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2">
										<Gamepad2 className="h-4 w-4" />
										Ver Catálogo Completo
									</motion.button>
								</Link>
								<Link to="/contacto">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="border border-white/20 text-white hover:bg-white/5 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2">
										<Heart className="h-4 w-4" />
										Comparte tus Favoritos
									</motion.button>
								</Link>
							</div>
						</Card>
					</motion.div>
				</div>
			</div>
		</>
	);
};

export default FavoritosPage;
