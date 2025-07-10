import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Clock, Star, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GameCard = ({ game, index = 0 }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);

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

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	const handleImageError = () => {
		setImageError(true);
		setImageLoaded(true);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			whileHover={{ y: -8 }}
			className="group">
			<Card className="glass-effect border-white/10 overflow-hidden card-hover h-full">
				<div className="relative">
					{/* Image skeleton/placeholder */}
					{!imageLoaded && (
						<div className="w-full h-36 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
							<div className="text-gray-500 text-xs">🎲</div>
						</div>
					)}

					{/* Actual image */}
					<img
						className={`w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300 ${
							!imageLoaded ? "absolute inset-0 opacity-0" : "opacity-100"
						} ${imageError ? "hidden" : ""}`}
						src={game.image}
						alt={`Portada del juego ${game.name}`}
						onLoad={handleImageLoad}
						onError={handleImageError}
						loading="lazy"
					/>

					{/* Fallback for image error */}
					{imageError && (
						<div className="w-full h-36 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
							<div className="text-white text-2xl">🎲</div>
						</div>
					)}

					{/* Overlay con información rápida */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<div className="absolute bottom-3 left-3 right-3">
							<div className="flex items-center justify-between text-white text-xs">
								<div className="flex items-center space-x-2">
									<Users className="h-3 w-3" />
									<span>{game.players}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="h-3 w-3" />
									<span>{game.duration}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Badge de dificultad */}
					<div className="absolute top-2 right-2">
						<Badge
							className={`${getDifficultyColor(
								game.difficulty
							)} text-white border-0`}>
							{game.difficulty}
						</Badge>
					</div>
				</div>

				<CardContent className="p-4">
					<div className="space-y-3">
						{/* Título y edad */}
						<div>
							<Link to={`/juego/${game.id}`}>
								<h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">
									{game.name}
								</h3>
							</Link>
							<p className="text-gray-400 text-xs">Edad: {game.minAge}+</p>
						</div>

						{/* Categorías */}
						<div className="flex flex-wrap gap-2">
							{(game.categories || []).map((category, idx) => (
								<Badge
									key={idx}
									className={`${getCategoryColor(
										category
									)} text-white border-0 text-xs px-2 py-1`}>
									{category}
								</Badge>
							))}
						</div>

						{/* Rating */}
						{game.rating && (
							<div className="flex items-center space-x-1">
								<Star className="h-3 w-3 text-yellow-400 fill-current" />
								<span className="text-yellow-400 font-medium text-sm">
									{game.rating}
								</span>
								<span className="text-gray-400 text-xs">/5</span>
							</div>
						)}

						{/* Descripción corta */}
						<p className="text-gray-300 text-xs line-clamp-2">
							{game.description || game.review?.substring(0, 100) + "..."}
						</p>

						{/* Botones de acción */}
						<div className="flex items-center justify-between pt-1">
							<Link
								to={`/juego/${game.id}`}
								className="text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors">
								Ver detalles →
							</Link>

							{game.externalLink && (
								<a
									href={game.externalLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-white transition-colors">
									<ExternalLink className="h-3 w-3" />
								</a>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default GameCard;
