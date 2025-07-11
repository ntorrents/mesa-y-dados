import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	forwardRef,
} from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { DataContext } from "../contexts/DataContext";

const AdminGameForm = forwardRef(
	(
		{
			game,
			onSave,
			onCancel,
			inputClassName = "",
			labelClassName = "",
			fileButtonClassName = "",
		},
		ref
	) => {
		const { addGame, updateGame, games } = useContext(DataContext);
		const { toast } = useToast();
		const [formData, setFormData] = useState({
			name: "",
			players: "",
			minAge: "",
			duration: "",
			categories: [],
			difficulty: "Fácil",
			rating: "",
			description: "",
			review: "",
			externalLink: "",
			pros: "",
			cons: "",
			featured: false,
			image: "",
			rulesFile: "",
			rulesText: "", // <-- nuevo campo
		});
		const [imageFile, setImageFile] = useState(null);
		const [rulesFileFile, setRulesFileFile] = useState(null);
		const [uploading, setUploading] = useState(false);
		const [allCategories, setAllCategories] = useState([]);
		const [dropdownOpen, setDropdownOpen] = useState(false);
		const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
		const [newCategory, setNewCategory] = useState("");
		const newCategoryInputRef = useRef(null);

		// Recolectar todas las categorías únicas de los juegos
		useEffect(() => {
			const cats = new Set();
			games.forEach((g) => {
				(g.categories || []).forEach((cat) => cats.add(cat));
			});
			setAllCategories(Array.from(cats));
		}, [games]);

		// Inicializar el formulario con los datos del juego
		useEffect(() => {
			if (game) {
				setFormData({
					...formData,
					...game,
					categories: Array.isArray(game.categories)
						? game.categories
						: game.categories
						? game.categories.split(",").map((c) => c.trim())
						: [],
					pros: Array.isArray(game.pros)
						? game.pros.join("\n")
						: game.pros || "",
					cons: Array.isArray(game.cons)
						? game.cons.join("\n")
						: game.cons || "",
					rulesText: game.rulesSummary || game.rulesText || "", // <-- preferir rulesSummary
				});
			} else {
				setFormData({
					...formData,
					categories: [],
					pros: "",
					cons: "",
					rulesText: "", // <-- inicializar
				});
			}
		}, [game]);

		const handleInputChange = (e) => {
			const { name, type, value, checked } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		};

		const handleFileChange = (e) => {
			const { name, files } = e.target;
			if (name === "imageFile" && files[0]) {
				setImageFile(files[0]);
			}
			if (name === "rulesFileFile" && files[0]) {
				setRulesFileFile(files[0]);
			}
		};

		// Manejar selección de categorías
		const handleCategoryToggle = (cat) => {
			if (formData.categories.includes(cat)) {
				setFormData((prev) => ({
					...prev,
					categories: prev.categories.filter((c) => c !== cat),
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					categories: [...prev.categories, cat],
				}));
			}
		};

		// Añadir nueva categoría
		const handleAddNewCategory = () => {
			const cat = newCategory.trim();
			if (cat && !allCategories.includes(cat)) {
				setAllCategories((prev) => [...prev, cat]);
			}
			setFormData((prev) => ({
				...prev,
				categories: [...prev.categories, cat],
			}));
			setNewCategory("");
			setShowNewCategoryInput(false);
			setDropdownOpen(false);
		};

		// Eliminar tag de categoría
		const handleRemoveCategory = (cat) => {
			setFormData((prev) => ({
				...prev,
				categories: prev.categories.filter((c) => c !== cat),
			}));
		};

		// Cerrar dropdown al hacer click fuera
		useEffect(() => {
			const handleClickOutside = (e) => {
				if (!e.target.closest(".dropdown-categorias")) {
					setDropdownOpen(false);
					setShowNewCategoryInput(false);
				}
			};
			if (dropdownOpen) {
				document.addEventListener("mousedown", handleClickOutside);
				return () =>
					document.removeEventListener("mousedown", handleClickOutside);
			}
		}, [dropdownOpen]);

		const handleSubmit = async (e) => {
			e.preventDefault();
			console.log("🔄 handleSubmit iniciado");
			setUploading(true);
			let imagePath = formData.image;
			let rulesPath = formData.rulesFile;

			try {
				// Obtener token
				const adminToken = localStorage.getItem("adminToken");
				if (!adminToken) {
					throw new Error("No hay token de administrador");
				}

				// Subir imagen si hay archivo
				if (imageFile) {
					const fd = new FormData();
					fd.append("image", imageFile);
					const res = await fetch(
						"http://localhost:4000/api/games/upload-image",
						{
							method: "POST",
							headers: { Authorization: `Bearer ${adminToken}` },
							body: fd,
						}
					);
					if (!res.ok) throw new Error("Error subiendo la imagen");
					const data = await res.json();
					imagePath = data.path;
					setFormData((prev) => ({ ...prev, image: imagePath }));
				}

				// Subir PDF si hay archivo
				if (rulesFileFile) {
					console.log("📤 Subiendo PDF:", rulesFileFile.name);
					const fd = new FormData();
					fd.append("rulesFile", rulesFileFile);
					const res = await fetch(
						"http://localhost:4000/api/games/upload-rules",
						{
							method: "POST",
							headers: { Authorization: `Bearer ${adminToken}` },
							body: fd,
						}
					);
					console.log("📡 Respuesta subida PDF:", res.status, res.statusText);
					if (!res.ok) throw new Error("Error subiendo el PDF de reglas");
					const data = await res.json();
					rulesPath = data.path;
					console.log("📁 Ruta PDF subido:", rulesPath);
					setFormData((prev) => ({ ...prev, rulesFile: rulesPath }));
				}

				// Procesar datos
				const processedData = {
					...formData,
					minAge: parseInt(formData.minAge) || 0,
					rating: parseFloat(formData.rating) || null,
					categories: formData.categories, // <-- usar array directamente
					pros:
						typeof formData.pros === "string"
							? formData.pros.split("\n").filter((pro) => pro.trim())
							: [],
					cons:
						typeof formData.cons === "string"
							? formData.cons.split("\n").filter((con) => con.trim())
							: [],
					featured: formData.featured,
					image: imagePath,
					rulesFile: rulesPath,
					rulesSummary: formData.rulesText, // <-- mapear aquí
				};
				delete processedData.rulesText; // eliminar del objeto enviado

				console.log("📤 Datos procesados:", processedData);

				// Guardar o actualizar
				if (game) {
					await updateGame(game.id, processedData, adminToken);
				} else {
					await addGame(processedData, adminToken);
				}

				setUploading(false);
				onSave();
			} catch (err) {
				console.error("❌ Error en handleSubmit:", err);
				setUploading(false);
				toast({
					title: "Error",
					description: err.message,
					variant: "destructive",
				});
			}
		};

		return (
			<form onSubmit={handleSubmit} className="space-y-6" ref={ref}>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<label className={labelClassName}>Nombre *</label>
						<Input
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							placeholder="Nombre del juego"
							className={inputClassName}
						/>
					</div>
					<div>
						<label className={labelClassName}>Jugadores</label>
						<Input
							name="players"
							value={formData.players}
							onChange={handleInputChange}
							placeholder="ej: 2-4"
							className={inputClassName}
						/>
					</div>
					<div>
						<label className={labelClassName}>Edad mínima</label>
						<Input
							name="minAge"
							type="number"
							value={formData.minAge}
							onChange={handleInputChange}
							placeholder="8"
							className={inputClassName}
						/>
					</div>
					<div>
						<label className={labelClassName}>Duración</label>
						<Input
							name="duration"
							value={formData.duration}
							onChange={handleInputChange}
							placeholder="ej: 30-45 min"
							className={inputClassName}
						/>
					</div>
					<div>
						<label className={labelClassName}>Categorías</label>
						<div className="relative dropdown-categorias">
							<button
								type="button"
								className={`w-full rounded-md px-3 py-2 border border-[#5a6170] text-left bg-[linear-gradient(90deg,#3e4555_0%,#414a59_100%)] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
									formData.categories.length === 0 ? "text-blue-200" : ""
								}`}
								onClick={() => setDropdownOpen((open) => !open)}>
								{formData.categories.length === 0
									? "Seleccionar"
									: formData.categories.join(", ")}
							</button>
							{dropdownOpen && (
								<div className="absolute z-20 mt-2 w-full rounded-md shadow-lg bg-[linear-gradient(90deg,#3e4555_0%,#414a59_100%)] border border-[#5a6170] p-2 max-h-60 overflow-y-auto">
									{allCategories.map((cat) => (
										<label
											key={cat}
											className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-900/30 cursor-pointer text-white">
											<input
												type="checkbox"
												checked={formData.categories.includes(cat)}
												onChange={() => handleCategoryToggle(cat)}
												className="accent-blue-500"
											/>
											<span>{cat}</span>
										</label>
									))}
									<label className="flex items-center gap-2 py-1 px-2 rounded hover:bg-blue-900/30 cursor-pointer text-white">
										<input
											type="checkbox"
											checked={showNewCategoryInput}
											onChange={() => setShowNewCategoryInput((v) => !v)}
											className="accent-blue-500"
										/>
										<span>Otra...</span>
									</label>
									{showNewCategoryInput && (
										<div className="flex gap-2 mt-2 px-2">
											<input
												ref={newCategoryInputRef}
												type="text"
												value={newCategory}
												onChange={(e) => setNewCategory(e.target.value)}
												placeholder="Nueva categoría"
												className="flex-1 rounded-md px-3 py-2 border border-[#5a6170] bg-[linear-gradient(90deg,#3e4555_0%,#414a59_100%)] text-white"
											/>
											<Button
												type="button"
												onClick={handleAddNewCategory}
												className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
												Añadir
											</Button>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
					<div>
						<label className={labelClassName}>Dificultad</label>
						<select
							name="difficulty"
							value={formData.difficulty}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}>
							<option value="Fácil">Fácil</option>
							<option value="Medio">Medio</option>
							<option value="Difícil">Difícil</option>
						</select>
					</div>
					<div>
						<label className={labelClassName}>Rating</label>
						<Input
							name="rating"
							type="number"
							step="0.1"
							min="0"
							max="5"
							value={formData.rating}
							onChange={handleInputChange}
							placeholder="4.5"
							className={inputClassName}
						/>
					</div>
					<div>
						<label className={labelClassName}>Enlace externo</label>
						<Input
							name="externalLink"
							type="url"
							value={formData.externalLink}
							onChange={handleInputChange}
							placeholder="https://..."
							className={inputClassName}
						/>
					</div>
					<div className="flex items-center space-x-2 mt-6">
						<input
							name="featured"
							type="checkbox"
							checked={formData.featured}
							onChange={handleInputChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label className={labelClassName}>Juego destacado</label>
					</div>
				</div>
				<div>
					<label className={labelClassName}>Descripción</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						rows={3}
						placeholder="Breve descripción del juego..."
						className={`w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
					/>
				</div>
				<div>
					<label className={labelClassName}>Reseña</label>
					<textarea
						name="review"
						value={formData.review}
						onChange={handleInputChange}
						rows={6}
						placeholder="Reseña detallada del juego..."
						className={`w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className={labelClassName}>Pros (uno por línea)</label>
						<textarea
							name="pros"
							value={formData.pros}
							onChange={handleInputChange}
							rows={4}
							placeholder="Componentes de calidad\nReglas simples\nEscalabilidad excelente"
							className={`w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
						/>
					</div>
					<div>
						<label className={labelClassName}>Contras (uno por línea)</label>
						<textarea
							name="cons"
							value={formData.cons}
							onChange={handleInputChange}
							rows={4}
							placeholder="Puede ser frustrante\nTemática abstracta"
							className={`w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className={labelClassName}>Imagen de portada</label>
						<div
							className="rounded-md"
							style={{
								background: "linear-gradient(90deg, #3e4555 0%, #414a59 100%)",
							}}>
							<label className="block">
								<span className="sr-only">Seleccionar archivo</span>
								<input
									type="file"
									name="imageFile"
									accept="image/*"
									onChange={handleFileChange}
									className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1c2638] file:text-white hover:file:bg-blue-700 focus:outline-none"
								/>
							</label>
							<Input
								name="image"
								value={formData.image}
								onChange={handleInputChange}
								placeholder="Ruta de la imagen (se actualiza automáticamente)"
								className={`mt-2 ${inputClassName}`}
							/>
						</div>
					</div>
					<div>
						<label className={labelClassName}>Archivo de reglas (PDF)</label>
						<div
							className="rounded-md"
							style={{
								background: "linear-gradient(90deg, #3e4555 0%, #414a59 100%)",
							}}>
							<label className="block">
								<span className="sr-only">Seleccionar archivo</span>
								<input
									type="file"
									name="rulesFileFile"
									accept=".pdf"
									onChange={handleFileChange}
									className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1c2638] file:text-white hover:file:bg-blue-700 focus:outline-none"
								/>
							</label>
							<Input
								name="rulesFile"
								value={formData.rulesFile}
								onChange={handleInputChange}
								placeholder="Ruta del PDF (se actualiza automáticamente)"
								className={`mt-2 ${inputClassName}`}
							/>
						</div>
					</div>
				</div>
				<div>
					<label className={labelClassName}>Normas rápidas / resumen</label>
					<textarea
						name="rulesText"
						value={formData.rulesText}
						onChange={handleInputChange}
						rows={5}
						placeholder="Escribe aquí las normas rápidas, resumen o explicación personalizada para este juego..."
						className={`w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
					/>
					<div className="text-xs text-blue-300 mt-1 space-y-1">
						<div>
							<b>
								Soporta <span className="text-blue-200">Markdown</span>:
							</b>{" "}
							Usa formato para mejorar la legibilidad.
						</div>
						<pre className="bg-[#232946] text-white rounded p-2 mt-1 overflow-x-auto">
							{`## Título grande
Texto normal, con salto de línea.

- Lista con guiones
- Otro ítem

**Negrita** y *cursiva*.
`}
						</pre>
						<div>
							<b>Ejemplo:</b>
							<span className="ml-2">
								Encabezados (<code>##</code>), listas (<code>-</code>), negrita
								(<code>**texto**</code>), cursiva (<code>*texto*</code>), saltos
								de línea (Enter).
							</span>
						</div>
					</div>
				</div>
			</form>
		);
	}
);

export default AdminGameForm;
