import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FilterSidebar = ({ onSearch, onFilter, filters, onClearFilters }) => {
	const [searchTerm, setSearchTerm] = useState("");
	// Elimina localFilters y usa filters directamente
	// const [localFilters, setLocalFilters] = useState(filters);
	// React.useEffect(() => { setLocalFilters(filters); }, [filters]);

	const [expandedSections, setExpandedSections] = useState({
		categories: false,
		players: false,
		duration: false,
		age: false,
		difficulty: false,
	});

	const categories = [
		"Estrategia",
		"Party",
		"Cooperativo",
		"Familiar",
		"Abstracto",
		"Comercio",
		"Cartas",
		"Subasta",
	];
	const difficulties = ["Fácil", "Medio", "Difícil"];

	// Player count options
	const playerOptions = [
		{ label: "1 jugador", value: [1, 1] },
		{ label: "2 jugadores", value: [2, 2] },
		{ label: "3-4 jugadores", value: [3, 4] },
		{ label: "5-6 jugadores", value: [5, 6] },
		{ label: "7+ jugadores", value: [7, 8] },
		{ label: "Cualquier número", value: [1, 8] },
	];

	// Duration options
	const durationOptions = [
		{ label: "Rápido (15-30 min)", value: [15, 30] },
		{ label: "Medio (30-60 min)", value: [30, 60] },
		{ label: "Largo (60-120 min)", value: [60, 120] },
		{ label: "Épico (120+ min)", value: [120, 240] },
		{ label: "Cualquier duración", value: [15, 240] },
	];

	// Age options
	const ageOptions = [
		{ label: "Niños (3-7 años)", value: [3, 7] },
		{ label: "Familiar (8-12 años)", value: [8, 12] },
		{ label: "Adolescente (13+ años)", value: [13, 18] },
		{ label: "Cualquier edad", value: [3, 18] },
	];

	const handleSearch = (value) => {
		setSearchTerm(value);
		onSearch(value);
	};

	const handleFilterChange = (key, value) => {
		const newFilters = { ...filters, [key]: value };
		// setLocalFilters(newFilters); // Ya no hace falta
		onFilter(newFilters);
	};

	const toggleCategory = (category) => {
		const newCategories = filters.categories.includes(category)
			? filters.categories.filter((c) => c !== category)
			: [...filters.categories, category];
		handleFilterChange("categories", newCategories);
	};

	const clearAllFilters = () => {
		const resetFilters = {
			players: [1, 8],
			duration: [15, 240],
			minAge: [3, 18],
			categories: [],
			difficulty: "",
		};
		// setLocalFilters(resetFilters); // Ya no hace falta
		setSearchTerm("");
		onClearFilters();
		onSearch("");
	};

	const toggleSection = (section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const hasActiveFilters =
		filters.categories.length > 0 ||
		filters.difficulty !== "" ||
		searchTerm !== "" ||
		JSON.stringify(filters.players) !== JSON.stringify([1, 8]) ||
		JSON.stringify(filters.duration) !== JSON.stringify([15, 240]) ||
		JSON.stringify(filters.minAge) !== JSON.stringify([3, 18]);

	const FilterSection = ({ title, sectionKey, children }) => (
		<div className="border-b border-white/10 pb-4 mb-4">
			<button
				onClick={() => toggleSection(sectionKey)}
				className="flex items-center justify-between w-full text-left text-white font-medium mb-3 hover:text-blue-400 transition-colors">
				<span className="text-sm">{title}</span>
				{expandedSections[sectionKey] ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
			</button>
			{expandedSections[sectionKey] && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.2 }}>
					{children}
				</motion.div>
			)}
		</div>
	);

	const isOptionSelected = (currentValue, optionValue) => {
		return JSON.stringify(currentValue) === JSON.stringify(optionValue);
	};

	return (
		<div className="w-80 glass-effect rounded-lg border border-white/10 h-fit sticky top-8 max-h-[calc(100vh-4rem)] flex flex-col">
			{/* Fixed Header */}
			<div className="p-6 border-b border-white/10 flex-shrink-0">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-bold text-white">Filtros</h2>
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearAllFilters}
							className="text-gray-400 hover:text-white text-xs">
							<X className="h-3 w-3 mr-1" />
							Limpiar
						</Button>
					)}
				</div>

				{/* Búsqueda */}
				<div className="mb-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							type="text"
							placeholder="Buscar juegos..."
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-10 glass-effect border-white/20 text-white placeholder-gray-400 text-sm h-9"
						/>
					</div>
				</div>

				{/* Filtros activos */}
				{hasActiveFilters && (
					<div className="mb-6">
						<div className="flex flex-wrap gap-2">
							{searchTerm && (
								<Badge className="bg-blue-500 text-white text-xs">
									"{searchTerm}"
								</Badge>
							)}
							{filters.categories.map((category) => (
								<Badge
									key={category}
									className="bg-blue-500 text-white text-xs">
									{category}
								</Badge>
							))}
							{filters.difficulty && (
								<Badge className="bg-blue-500 text-white text-xs">
									{filters.difficulty}
								</Badge>
							)}
							{!isOptionSelected(filters.players, [1, 8]) && (
								<Badge className="bg-blue-500 text-white text-xs">
									{filters.players[0]}-{filters.players[1]} jugadores
								</Badge>
							)}
							{!isOptionSelected(filters.duration, [15, 240]) && (
								<Badge className="bg-blue-500 text-white text-xs">
									{filters.duration[0]}-{filters.duration[1]} min
								</Badge>
							)}
							{!isOptionSelected(filters.minAge, [3, 18]) && (
								<Badge className="bg-blue-500 text-white text-xs">
									{filters.minAge[0]}-{filters.minAge[1]} años
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto p-6 pt-0">
				{/* Categorías */}
				<FilterSection title="Categorías" sectionKey="categories">
					<div className="grid grid-cols-2 gap-2">
						{categories.map((category) => (
							<Badge
								key={category}
								variant={
									filters.categories.includes(category) ? "default" : "outline"
								}
								className={`cursor-pointer transition-colors text-xs py-1 px-2 ${
									filters.categories.includes(category)
										? "bg-blue-500 text-white"
										: "border-white/20 text-gray-300 hover:bg-white/5"
								}`}
								onClick={() => toggleCategory(category)}>
								{category}
							</Badge>
						))}
					</div>
				</FilterSection>

				{/* Número de jugadores */}
				<FilterSection title="Jugadores" sectionKey="players">
					<div className="space-y-1">
						{playerOptions.map((option, index) => (
							<button
								key={index}
								onClick={() => handleFilterChange("players", option.value)}
								className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
									isOptionSelected(filters.players, option.value)
										? "bg-blue-500 text-white"
										: "text-gray-300 hover:bg-white/5"
								}`}>
								{option.label}
							</button>
						))}
					</div>
				</FilterSection>

				{/* Duración */}
				<FilterSection title="Duración" sectionKey="duration">
					<div className="space-y-1">
						{durationOptions.map((option, index) => (
							<button
								key={index}
								onClick={() => handleFilterChange("duration", option.value)}
								className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
									isOptionSelected(filters.duration, option.value)
										? "bg-blue-500 text-white"
										: "text-gray-300 hover:bg-white/5"
								}`}>
								{option.label}
							</button>
						))}
					</div>
				</FilterSection>

				{/* Edad mínima */}
				<FilterSection title="Edad" sectionKey="age">
					<div className="space-y-1">
						{ageOptions.map((option, index) => (
							<button
								key={index}
								onClick={() => handleFilterChange("minAge", option.value)}
								className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
									isOptionSelected(filters.minAge, option.value)
										? "bg-blue-500 text-white"
										: "text-gray-300 hover:bg-white/5"
								}`}>
								{option.label}
							</button>
						))}
					</div>
				</FilterSection>

				{/* Dificultad */}
				<FilterSection title="Dificultad" sectionKey="difficulty">
					<div className="space-y-1">
						{difficulties.map((difficulty) => (
							<Badge
								key={difficulty}
								variant={
									filters.difficulty === difficulty ? "default" : "outline"
								}
								className={`cursor-pointer transition-colors text-xs py-1 px-3 w-full justify-center ${
									filters.difficulty === difficulty
										? "bg-blue-500 text-white"
										: "border-white/20 text-gray-300 hover:bg-white/5"
								}`}
								onClick={() =>
									handleFilterChange(
										"difficulty",
										filters.difficulty === difficulty ? "" : difficulty
									)
								}>
								{difficulty}
							</Badge>
						))}
					</div>
				</FilterSection>
			</div>
		</div>
	);
};

export default FilterSidebar;
