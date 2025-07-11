import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import FilterSidebar from "@/components/SearchAndFilters";
import Pagination from "@/components/Pagination";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";

const GameListItem = ({ game, index }) => {
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.05 }}
			className="w-full">
			<Link to={`/juego/${game.id}`}>
				<div className="flex items-center justify-between p-3 glass-effect rounded-lg border border-white/10 hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300 h-16">
					<div className="flex-1 min-w-0 mr-4">
						<p className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
							{game.name}
						</p>
					</div>
					<div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
						<div className="flex items-center gap-2">
							<Users className="h-3 w-3 text-blue-400" />
							<span>{game.players}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="h-3 w-3 text-green-400" />
							<span>{game.duration}</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								className={`${getDifficultyColor(
									game.difficulty
								)} text-white border-0`}>
								{game.difficulty}
							</Badge>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

const LoadingSpinner = () => (
	<div className="flex items-center justify-center py-20">
		<div className="relative">
			<div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-blue-500 text-xl">🎲</span>
			</div>
		</div>
	</div>
);

const GamesPage = () => {
	const [searchParams] = useSearchParams();
	const { games } = useData();
	const [filteredGames, setFilteredGames] = useState([]);
	const [viewMode, setViewMode] = useState("grid");
	const [sortBy, setSortBy] = useState("name");
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(12);

	// Estado de filtros centralizado
	const [filters, setFilters] = useState({
		players: [],
		duration: [15, 240],
		minAge: 6,
		categories: [],
		difficulty: "",
	});

	useEffect(() => {
		// Simulate loading time to ensure all games are loaded
		const timer = setTimeout(() => {
			setIsLoading(false);

			const searchQuery = searchParams.get("search");
			if (searchQuery) {
				handleSearch(searchQuery);
			} else {
				// Aplicar solo filtros sin búsqueda
				handleFilter(filters);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [games, searchParams]);

	// Aplica el filtrado cada vez que cambian los filtros o los juegos
	useEffect(() => {
		handleFilter(filters);
	}, [filters, games]);

	const handleSearch = (searchTerm) => {
		// Aplicar búsqueda y filtros juntos
		let filtered = [...games];

		// Aplicar búsqueda si hay término
		if (searchTerm.trim()) {
			filtered = filtered.filter(
				(game) =>
					game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(game.categories || []).some(
						(cat) => cat && cat.toLowerCase().includes(searchTerm.toLowerCase())
					) ||
					(game.review || "").toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Aplicar filtros adicionales
		// Filtrado por jugadores
		if (filters.players && filters.players.length > 0) {
			filtered = filtered.filter((game) => {
				const playerRange = (game.players || "")
					.replace(/\s/g, "")
					.split("-")
					.map((p) => parseInt((p || "").replace(/\D/g, "")));
				const minPlayers = playerRange[0];
				const maxPlayers = playerRange[1] || minPlayers;

				return filters.players.some((selectedPlayers) => {
					if (selectedPlayers === 6) {
						return maxPlayers >= 6;
					} else {
						return (
							selectedPlayers >= minPlayers && selectedPlayers <= maxPlayers
						);
					}
				});
			});
		}

		// Filtrado por duración
		if (filters.duration && filters.duration.length === 2) {
			filtered = filtered.filter((game) => {
				const durationMatch = (game.duration || "")
					.replace(/\s/g, "")
					.match(/(\d+)-?(\d+)?/);
				if (durationMatch) {
					const minDuration = parseInt(durationMatch[1]);
					const maxDuration = parseInt(durationMatch[2]) || minDuration;
					return (
						!isNaN(minDuration) &&
						!isNaN(maxDuration) &&
						minDuration <= filters.duration[1] &&
						maxDuration >= filters.duration[0]
					);
				}
				return true;
			});
		}

		// Filtrado por edad mínima
		if (filters.minAge && filters.minAge !== 6) {
			filtered = filtered.filter((game) => {
				return game.minAge && game.minAge >= filters.minAge;
			});
		}

		// Filtrado por categorías
		if (filters.categories && filters.categories.length > 0) {
			filtered = filtered.filter((game) =>
				filters.categories.some((category) =>
					(game.categories || []).some(
						(cat) => cat && cat.toLowerCase() === category.toLowerCase()
					)
				)
			);
		}

		// Filtrado por dificultad
		if (filters.difficulty && filters.difficulty !== "") {
			filtered = filtered.filter(
				(game) =>
					(game.difficulty || "").toLowerCase() ===
					filters.difficulty.toLowerCase()
			);
		}

		setFilteredGames(filtered);
	};

	const handleFilter = (filters) => {
		let filtered = [...games];

		// Filtrado por jugadores
		if (filters.players && filters.players.length > 0) {
			filtered = filtered.filter((game) => {
				const playerRange = (game.players || "")
					.replace(/\s/g, "") // quitar espacios
					.split("-")
					.map((p) => parseInt((p || "").replace(/\D/g, "")));
				const minPlayers = playerRange[0];
				const maxPlayers = playerRange[1] || minPlayers;

				// Verificar si algún número de jugadores seleccionado está en el rango del juego
				return filters.players.some((selectedPlayers) => {
					if (selectedPlayers === 6) {
						// Para "6+", verificar si el juego soporta 6 o más jugadores
						return maxPlayers >= 6;
					} else {
						// Para números específicos, verificar si está en el rango
						return (
							selectedPlayers >= minPlayers && selectedPlayers <= maxPlayers
						);
					}
				});
			});
		}

		// Filtrado por duración
		if (filters.duration && filters.duration.length === 2) {
			filtered = filtered.filter((game) => {
				const durationMatch = (game.duration || "")
					.replace(/\s/g, "")
					.match(/(\d+)-?(\d+)?/);
				if (durationMatch) {
					const minDuration = parseInt(durationMatch[1]);
					const maxDuration = parseInt(durationMatch[2]) || minDuration;
					return (
						!isNaN(minDuration) &&
						!isNaN(maxDuration) &&
						minDuration <= filters.duration[1] &&
						maxDuration >= filters.duration[0]
					);
				}
				return true;
			});
		}

		// Filtrado por edad mínima
		if (filters.minAge && filters.minAge !== 6) {
			filtered = filtered.filter((game) => {
				return game.minAge && game.minAge >= filters.minAge;
			});
		}

		// Filtrado por categorías (insensible a mayúsculas)
		if (filters.categories && filters.categories.length > 0) {
			filtered = filtered.filter((game) =>
				filters.categories.some((category) =>
					(game.categories || []).some(
						(cat) => cat && cat.toLowerCase() === category.toLowerCase()
					)
				)
			);
		}

		// Filtrado por dificultad (insensible a mayúsculas)
		if (filters.difficulty && filters.difficulty !== "") {
			filtered = filtered.filter(
				(game) =>
					(game.difficulty || "").toLowerCase() ===
					filters.difficulty.toLowerCase()
			);
		}

		setFilteredGames(filtered);
	};

	const handleClearFilters = () => {
		setFilters({
			players: [],
			duration: [15, 240],
			minAge: 6,
			categories: [],
			difficulty: "",
		});
	};

	const handleSort = (sortOption) => {
		setSortBy(sortOption);
		const sorted = [...filteredGames].sort((a, b) => {
			switch (sortOption) {
				case "name":
					return a.name.localeCompare(b.name);
				case "rating":
					return (b.rating || 0) - (a.rating || 0);
				case "players":
					return parseInt(a.players) - parseInt(b.players);
				case "duration":
					const aDuration = parseInt(a.duration.match(/\d+/)?.[0] || 0);
					const bDuration = parseInt(b.duration.match(/\d+/)?.[0] || 0);
					return aDuration - bDuration;
				default:
					return 0;
			}
		});
		setFilteredGames(sorted);
	};

	// Pagination logic
	const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentGames = filteredGames.slice(startIndex, endIndex);

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filteredGames.length]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleItemsPerPageChange = (newItemsPerPage) => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
	};

	if (isLoading) {
		return (
			<>
				<Helmet>
					<title>Catálogo de Juegos - Mesa & Dados</title>
					<meta
						name="description"
						content="Explora nuestra colección completa de juegos de mesa con filtros avanzados por número de jugadores, duración, edad y categoría."
					/>
				</Helmet>

				<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center mb-8">
							<h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
								Catálogo de Juegos
							</h1>
							<p className="text-gray-400 text-base max-w-2xl mx-auto">
								Descubre tu próximo juego favorito con nuestros filtros
								avanzados y reseñas detalladas
							</p>
						</motion.div>
						<LoadingSpinner />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Helmet>
				<title>Catálogo de Juegos - Mesa & Dados</title>
				<meta
					name="description"
					content="Explora nuestra colección completa de juegos de mesa con filtros avanzados por número de jugadores, duración, edad y categoría."
				/>
			</Helmet>

			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-8">
						<h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
							Catálogo de Juegos
						</h1>
						<p className="text-gray-400 text-base max-w-2xl mx-auto">
							Descubre tu próximo juego favorito con nuestros filtros avanzados
							y reseñas detalladas
						</p>
					</motion.div>

					<div className="flex gap-6">
						{/* Sidebar de filtros */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="hidden lg:block">
							<FilterSidebar
								onSearch={handleSearch}
								onFilter={setFilters}
								filters={filters}
								onClearFilters={handleClearFilters}
							/>
						</motion.div>

						{/* Contenido principal */}
						<div className="flex-1">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
								<span className="text-gray-400 text-sm">
									{filteredGames.length} juego
									{filteredGames.length !== 1 ? "s" : ""} encontrado
									{filteredGames.length !== 1 ? "s" : ""}
								</span>

								<div className="flex items-center space-x-4">
									<select
										value={sortBy}
										onChange={(e) => handleSort(e.target.value)}
										className="bg-slate-800 border border-white/20 rounded-md px-3 py-2 text-white text-sm">
										<option value="name">Ordenar por nombre</option>
										<option value="rating">Ordenar por valoración</option>
										<option value="players">Ordenar por jugadores</option>
										<option value="duration">Ordenar por duración</option>
									</select>

									<div className="flex border border-white/20 rounded-md overflow-hidden">
										<Button
											variant={viewMode === "grid" ? "default" : "ghost"}
											size="sm"
											onClick={() => setViewMode("grid")}
											className="rounded-none">
											<Grid className="h-4 w-4" />
										</Button>
										<Button
											variant={viewMode === "list" ? "default" : "ghost"}
											size="sm"
											onClick={() => setViewMode("list")}
											className="rounded-none">
											<List className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</motion.div>

							<motion.div layout>
								<AnimatePresence>
									{currentGames.length > 0 ? (
										<div
											className={`grid gap-4 ${
												viewMode === "grid"
													? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
													: "grid-cols-1"
											}`}>
											{currentGames.map((game, index) =>
												viewMode === "grid" ? (
													<GameCard key={game.id} game={game} index={index} />
												) : (
													<GameListItem
														key={game.id}
														game={game}
														index={index}
													/>
												)
											)}
										</div>
									) : filteredGames.length === 0 ? (
										<div className="text-center py-20">
											<div className="text-6xl mb-4">🎲</div>
											<h3 className="text-2xl font-bold text-white mb-2">
												No se encontraron juegos
											</h3>
											<p className="text-gray-400 mb-6">
												Prueba a ajustar los filtros o términos de búsqueda
											</p>
											<Button onClick={handleClearFilters} variant="outline">
												Limpiar filtros
											</Button>
										</div>
									) : (
										<div className="text-center py-20">
											<div className="text-6xl mb-4">🎯</div>
											<h3 className="text-2xl font-bold text-white mb-2">
												No hay juegos en esta página
											</h3>
											<p className="text-gray-400 mb-6">
												Intenta navegar a una página anterior
											</p>
										</div>
									)}
								</AnimatePresence>
							</motion.div>

							{/* Pagination */}
							{filteredGames.length > 0 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									itemsPerPage={itemsPerPage}
									totalItems={filteredGames.length}
									onPageChange={handlePageChange}
									onItemsPerPageChange={handleItemsPerPageChange}
								/>
							)}

							{/* Filtros móviles */}
							<div className="lg:hidden mt-6">
								<FilterSidebar
									onSearch={handleSearch}
									onFilter={setFilters}
									filters={filters}
									onClearFilters={handleClearFilters}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GamesPage;
