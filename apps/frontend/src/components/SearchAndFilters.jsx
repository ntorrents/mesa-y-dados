import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FilterSidebar = ({ onSearch, onFilter, filters, onClearFilters }) => {
	const [searchTerm, setSearchTerm] = useState("");
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

	// Player count options - individual numbers
	const playerOptions = [
		{ label: "1", value: 1 },
		{ label: "2", value: 2 },
		{ label: "3", value: 3 },
		{ label: "4", value: 4 },
		{ label: "5", value: 5 },
		{ label: "6+", value: 6 },
	];

	// Duration options
	const durationOptions = [
		{ label: "Rápido (15-30 min)", value: [15, 30] },
		{ label: "Medio (30-60 min)", value: [30, 60] },
		{ label: "Largo (60-120 min)", value: [60, 120] },
		{ label: "Épico (120+ min)", value: [120, 240] },
		{ label: "Cualquier duración", value: [15, 240] },
	];

	// Age options - minimum ages
	const ageOptions = [
		{ label: "6+", value: 6 },
		{ label: "8+", value: 8 },
		{ label: "10+", value: 10 },
		{ label: "12+", value: 12 },
		{ label: "14+", value: 14 },
	];

	const handleSearch = useCallback(
		(value) => {
			setSearchTerm(value);
			onSearch(value);
		},
		[onSearch]
	);

	const handleFilterChange = useCallback(
		(key, value) => {
			const newFilters = { ...filters, [key]: value };
			onFilter(newFilters);
		},
		[filters, onFilter]
	);

	const toggleCategory = useCallback(
		(category) => {
			const newCategories = filters.categories.includes(category)
				? filters.categories.filter((c) => c !== category)
				: [...filters.categories, category];
			handleFilterChange("categories", newCategories);
		},
		[filters.categories, handleFilterChange]
	);

	const clearAllFilters = useCallback(() => {
		setSearchTerm("");
		onClearFilters();
		onSearch("");
	}, [onClearFilters, onSearch]);

	const toggleSection = useCallback((section) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	}, []);

	const hasActiveFilters =
		filters.categories.length > 0 ||
		filters.difficulty !== "" ||
		searchTerm !== "" ||
		filters.players.length > 0 ||
		JSON.stringify(filters.duration) !== JSON.stringify([15, 240]) ||
		filters.minAge !== 6;

	// Función para eliminar un filtro activo desde el badge
	const handleRemoveFilter = (type, value) => {
		if (type === "search") {
			setSearchTerm("");
			onSearch("");
		} else if (type === "category") {
			handleFilterChange(
				"categories",
				filters.categories.filter((c) => c !== value)
			);
		} else if (type === "player") {
			handleFilterChange(
				"players",
				filters.players.filter((p) => p !== value)
			);
		} else if (type === "difficulty") {
			handleFilterChange("difficulty", "");
		} else if (type === "duration") {
			handleFilterChange("duration", [15, 240]);
		} else if (type === "minAge") {
			handleFilterChange("minAge", 6);
		}
	};

	// Ajustar FilterSection para menos espacio entre filtros
	const FilterSection = ({ title, sectionKey, children, isLast }) => (
		<motion.div
			className={`border-b border-white/10 pb-2 ${isLast ? "" : "mb-4"}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			layout>
			<button
				onClick={() => toggleSection(sectionKey)}
				className="flex items-center justify-between w-full text-left text-white font-medium mb-2 hover:text-blue-400 transition-colors duration-200">
				<span className="text-sm font-semibold">{title}</span>
				<motion.div
					animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
					transition={{ duration: 0.2 }}>
					<ChevronDown className="h-4 w-4" />
				</motion.div>
			</button>
			<AnimatePresence initial={false}>
				{expandedSections[sectionKey] && (
					<motion.div
						key="content"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { height: "auto", opacity: 1 },
							collapsed: { height: 0, opacity: 0 },
						}}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						style={{ overflow: "hidden" }}
						layout>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);

	const isOptionSelected = (currentValue, optionValue) => {
		return JSON.stringify(currentValue) === JSON.stringify(optionValue);
	};

	return (
		<motion.div
			className="w-80 glass-effect rounded-lg border border-white/10 h-fit sticky top-8 max-h-[calc(100vh-4rem)] flex flex-col"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header fijo */}
			<div className="p-6 border-b border-white/10 flex-shrink-0 bg-transparent z-10">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-bold text-white">Filtros</h2>
					{hasActiveFilters && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAllFilters}
								className="text-gray-400 hover:text-white text-xs transition-colors duration-200">
								<X className="h-3 w-3 mr-1" />
								Limpiar
							</Button>
						</motion.div>
					)}
				</div>

				{/* Búsqueda */}
				<div className="mb-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							type="text"
							placeholder="Buscar juegos..."
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-10 glass-effect border-white/20 text-white placeholder-gray-400 text-sm h-9 transition-all duration-200 focus:border-blue-400"
						/>
					</div>
				</div>

				{/* Filtros activos */}
				<AnimatePresence>
					{hasActiveFilters && (
						<motion.div
							className="mb-6"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}>
							<div className="flex flex-wrap gap-2">
								{searchTerm && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("search")}>
											"{searchTerm}"
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								)}
								{filters.categories.map((category, index) => (
									<motion.div
										key={category}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2, delay: index * 0.05 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("category", category)}>
											{category}
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								))}
								{filters.difficulty && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("difficulty")}>
											{filters.difficulty}
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								)}
								{filters.players.length > 0 && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("player")}>
											{filters.players.join(", ")}
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								)}
								{!isOptionSelected(filters.duration, [15, 240]) && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("duration")}>
											{filters.duration[0]}-{filters.duration[1]} min
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								)}
								{filters.minAge !== 6 && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.2 }}>
										<Badge
											className="bg-blue-500 text-white text-xs cursor-pointer pr-2"
											onClick={() => handleRemoveFilter("minAge")}>
											{filters.minAge}+
											<X className="ml-1 h-3 w-3 inline" />
										</Badge>
									</motion.div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
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
					<div className="grid grid-cols-3 gap-2">
						{playerOptions.map((option) => (
							<Badge
								key={option.value}
								variant={
									filters.players.includes(option.value) ? "default" : "outline"
								}
								className={`cursor-pointer transition-colors text-xs py-1 px-2 ${
									filters.players.includes(option.value)
										? "bg-blue-500 text-white"
										: "border-white/20 text-gray-300 hover:bg-white/5"
								}`}
								onClick={() => {
									const newPlayers = filters.players.includes(option.value)
										? filters.players.filter((p) => p !== option.value)
										: [...filters.players, option.value];
									handleFilterChange("players", newPlayers);
								}}>
								{option.label}
							</Badge>
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

				{/* Dificultad */}
				<FilterSection title="Dificultad" sectionKey="difficulty">
					<div className="grid grid-cols-1 gap-2">
						{difficulties.map((difficulty) => (
							<button
								key={difficulty}
								onClick={() => handleFilterChange("difficulty", difficulty)}
								className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
									filters.difficulty === difficulty
										? "bg-blue-500 text-white"
										: "text-gray-300 hover:bg-white/5"
								}`}>
								{difficulty}
							</button>
						))}
					</div>
				</FilterSection>

				{/* Edad mínima */}
				<FilterSection title="Edad mínima" sectionKey="age" isLast>
					<div className="grid grid-cols-3 gap-2">
						{ageOptions.map((option) => (
							<Badge
								key={option.value}
								variant={
									filters.minAge === option.value ? "default" : "outline"
								}
								className={`cursor-pointer transition-colors text-xs py-1 px-2 ${
									filters.minAge === option.value
										? "bg-blue-500 text-white"
										: "border-white/20 text-gray-300 hover:bg-white/5"
								}`}
								onClick={() => handleFilterChange("minAge", option.value)}>
								{option.label}
							</Badge>
						))}
					</div>
				</FilterSection>
			</div>
		</motion.div>
	);
};

export default FilterSidebar;
