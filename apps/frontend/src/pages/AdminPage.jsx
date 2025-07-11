import React, { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../contexts/DataContext";
import AdminGameForm from "../components/AdminGameForm";
import AdminLogin from "../components/AdminLogin";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";

const AdminPage = () => {
	const { games, fetchGames, deleteGame, isAdminAuthenticated, logoutAdmin } =
		useContext(DataContext);
	const [selectedTab, setSelectedTab] = useState("games");
	const [selectedGame, setSelectedGame] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const { toast } = useToast();
	const formRef = useRef(null); // referencia al formulario

	useEffect(() => {
		if (isAdminAuthenticated) {
			fetchGames();
		}
	}, [isAdminAuthenticated]); // Solo depende de isAdminAuthenticated

	if (!isAdminAuthenticated) {
		return (
			<div
				className="min-h-screen"
				style={{
					background:
						"linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
				}}>
				<div className="max-w-md w-full flex items-center justify-center min-h-screen mx-auto">
					<AdminLogin />
				</div>
			</div>
		);
	}

	const filteredGames = games.filter((game) =>
		game.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleGameSelect = (game) => {
		setSelectedGame(game);
		setIsEditing(true);
	};

	const handleNewGame = () => {
		setSelectedGame(null);
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		fetchGames();
		toast({
			title: "Juego guardado",
			description: "El juego se ha guardado correctamente.",
		});
	};

	const handleCancel = () => {
		setIsEditing(false);
		setSelectedGame(null);
	};

	const handleDelete = async (gameId) => {
		if (window.confirm("¿Estás seguro de que quieres eliminar este juego?")) {
			try {
				await deleteGame(gameId);
				setSelectedGame(null);
				setIsEditing(false);
				toast({
					title: "Juego eliminado",
					description: "El juego se ha eliminado correctamente.",
				});
			} catch (error) {
				toast({
					title: "Error",
					description: "No se pudo eliminar el juego.",
					variant: "destructive",
				});
			}
		}
	};

	const handleLogout = () => {
		logoutAdmin();
		window.location.reload();
	};

	return (
		<div
			className="min-h-screen"
			style={{
				background:
					"linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
			}}>
			{/* Header */}
			<header className="bg-slate-900/80 shadow-sm border-b border-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-white drop-shadow">
								🎮 Mesa y Dados - Panel de Administración
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-blue-200">👤 Admin</span>
							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="border-blue-400 text-blue-200 hover:bg-blue-900/40">
								🚪 Cerrar Sesión
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="bg-slate-900/80 border-b border-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						<button
							onClick={() => setSelectedTab("games")}
							className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
								selectedTab === "games"
									? "border-blue-400 text-blue-200"
									: "border-transparent text-blue-300 hover:text-white hover:border-blue-400"
							}`}>
							🎮 Juegos
						</button>
						<button
							onClick={() => setSelectedTab("blog")}
							className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
								selectedTab === "blog"
									? "border-blue-400 text-blue-200"
									: "border-transparent text-blue-300 hover:text-white hover:border-blue-400"
							}`}>
							📝 Blog
						</button>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				{selectedTab === "games" && (
					<div className="flex gap-8" style={{ height: "calc(100vh - 100px)" }}>
						{/* Sidebar - Lista de juegos */}
						<div
							className="w-1/3 rounded-2xl shadow-lg border border-slate-800/40 p-4 flex flex-col overflow-hidden"
							style={{
								height: "100%",
								background: "linear-gradient(90deg, #3e4555 0%, #414a59 100%)",
							}}>
							<div className="mb-4">
								<Input
									placeholder="🔍 Buscar juegos..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="flex-1"
									style={{
										background:
											"linear-gradient(90deg, #3e4555 0%, #414a59 100%)",
										color: "white",
										borderColor: "#5a6170",
									}}
								/>
							</div>
							<div className="text-sm text-blue-200 mb-2">
								📊 Total: {filteredGames.length} juegos
							</div>
							<Button
								onClick={handleNewGame}
								className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold"
								size="lg">
								➕ Nuevo Juego
							</Button>
							<div
								className="flex-1 overflow-y-auto pr-1 custom-scrollbar"
								style={{ maxHeight: "100%" }}>
								{filteredGames.map((game) => {
									const isSelected = selectedGame?.id === game.id;
									return (
										<div
											key={game.id}
											onClick={() => handleGameSelect(game)}
											className={`mb-1 last:mb-0 px-3 py-2 rounded-lg border shadow transition-colors cursor-pointer flex items-center`}
											style={{
												minHeight: "36px",
												fontSize: "1rem",
												background: isSelected
													? "linear-gradient(90deg, #50596a 0%, #586073 100%)"
													: "linear-gradient(90deg, #3e4555 0%, #414a59 100%)",
												color: "white",
												borderColor: isSelected ? "#bfc4ce" : "#5a6170",
												boxShadow: isSelected ? "0 0 0 2px #bfc4ce" : undefined,
											}}>
											<span className="truncate font-medium">{game.name}</span>
										</div>
									);
								})}
							</div>
						</div>

						{/* Panel principal - Formulario */}
						<div
							className="flex-1 bg-white/10 rounded-2xl shadow-lg border border-slate-800/40 p-0 flex flex-col justify-center"
							style={{ height: "100%" }}>
							{isEditing ? (
								<div className="h-full flex flex-col justify-center">
									<div className="flex items-center justify-between px-8 pt-8 mb-4">
										<h2 className="text-xl font-bold text-white flex items-center gap-2">
											<span role="img" aria-label="gamepad">
												🎮
											</span>
											Editando:{" "}
											{selectedGame ? selectedGame.name : "Nuevo Juego"}
										</h2>
										<div className="flex space-x-2">
											<Button
												onClick={() =>
													formRef.current && formRef.current.requestSubmit()
												}
												size="sm"
												className="bg-blue-600 hover:bg-blue-700 text-white">
												💾 Guardar
											</Button>
											<Button
												variant="outline"
												onClick={handleCancel}
												size="sm"
												className="border-blue-400 text-blue-200 hover:bg-blue-900/40">
												❌ Cancelar
											</Button>
											{selectedGame && (
												<Button
													variant="destructive"
													onClick={() => handleDelete(selectedGame.id)}
													size="sm"
													className="bg-red-600 hover:bg-red-700 text-white">
													🗑️ Eliminar
												</Button>
											)}
										</div>
									</div>
									<div className="flex-1 overflow-y-auto px-8 pb-8">
										<div className="max-w-3xl mx-auto">
											<AdminGameForm
												ref={formRef}
												game={selectedGame}
												onSave={handleSave}
												onCancel={handleCancel}
												inputClassName="bg-[linear-gradient(90deg,#3e4555_0%,#414a59_100%)] text-white placeholder:text-blue-200 border border-[#5a6170] focus:ring-2 focus:ring-blue-400 focus:border-[#5a6170]"
												labelClassName="block text-sm font-medium text-blue-100 mb-1"
												fileButtonClassName="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded transition border-0"
											/>
										</div>
									</div>
								</div>
							) : (
								<div className="text-center py-12">
									<div className="text-6xl mb-4 flex justify-center">
										<span role="img" aria-label="gamepad">
											🎮
										</span>
									</div>
									<h3 className="text-xl font-bold text-white mb-2">
										Selecciona un juego para editar
									</h3>
									<p className="text-blue-200 mb-8">
										O crea un nuevo juego desde la lista de la izquierda
									</p>
									<Button
										onClick={handleNewGame}
										className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-lg">
										➕ Crear Nuevo Juego
									</Button>
								</div>
							)}
						</div>
					</div>
				)}

				{selectedTab === "blog" && (
					<div className="flex gap-8 h-[calc(100vh-160px)]">
						{/* Sidebar - Lista de posts (placeholder) */}
						<div
							className="w-1/3 bg-white/10 rounded-2xl shadow-lg border border-slate-800/40 p-4 flex flex-col"
							style={{ height: "calc(100vh - 160px)" }}>
							<div className="mb-4">
								<Input
									placeholder="🔍 Buscar posts..."
									className="flex-1 bg-slate-900/60 text-white placeholder:text-blue-200 border-slate-800 focus:ring-blue-400 focus:border-blue-400"
								/>
							</div>
							<div className="text-sm text-blue-200 mb-2">
								📊 Total: 0 posts
							</div>
							<Button
								className="w-full mb-4 bg-blue-600 text-white font-bold"
								size="lg"
								disabled>
								➕ Nuevo Post
							</Button>
							<div className="flex-1 flex items-center justify-center text-blue-200">
								<div className="text-center">
									<div className="text-4xl mb-4">📝</div>
									<p>Funcionalidad de blog</p>
									<p className="text-sm">próximamente...</p>
								</div>
							</div>
						</div>

						{/* Panel principal - Blog (placeholder) */}
						<div
							className="flex-1 bg-white/10 rounded-2xl shadow-lg border border-slate-800/40 p-8 flex items-center justify-center"
							style={{ height: "calc(100vh - 160px)" }}>
							<div className="text-center text-blue-200">
								<div className="text-6xl mb-4">📝</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Gestión de Blog
								</h3>
								<p className="text-blue-200">
									Esta funcionalidad estará disponible próximamente
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminPage;
