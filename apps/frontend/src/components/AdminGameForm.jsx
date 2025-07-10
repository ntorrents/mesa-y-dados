import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminGameForm = ({ initialData, onSubmit, onCancel }) => {
	const { adminToken } = useData();
	const { toast } = useToast();
	const [formData, setFormData] = useState({
		name: "",
		players: "",
		minAge: "",
		duration: "",
		categories: "",
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
	});
	const [imageFile, setImageFile] = useState(null);
	const [rulesFileFile, setRulesFileFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name || "",
				players: initialData.players || "",
				minAge: initialData.minAge?.toString() || "",
				duration: initialData.duration || "",
				categories: initialData.categories?.join(", ") || "",
				difficulty: initialData.difficulty || "Fácil",
				rating: initialData.rating?.toString() || "",
				description: initialData.description || "",
				review: initialData.review || "",
				externalLink: initialData.externalLink || "",
				pros: initialData.pros?.join("\n") || "",
				cons: initialData.cons?.join("\n") || "",
				featured: initialData.featured || false,
				image: initialData.image || "",
				rulesFile: initialData.rulesFile || "",
			});
		} else {
			setFormData({
				name: "",
				players: "",
				minAge: "",
				duration: "",
				categories: "",
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
			});
		}
	}, [initialData]);

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
			setFormData((prev) => ({ ...prev, image: "" }));
		}
		if (name === "rulesFileFile" && files[0]) {
			setRulesFileFile(files[0]);
			setFormData((prev) => ({ ...prev, rulesFile: "" }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		let imagePath = formData.image;
		let rulesPath = formData.rulesFile;
		try {
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
			}
			// Subir PDF si hay archivo
			if (rulesFileFile) {
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
				if (!res.ok) throw new Error("Error subiendo el PDF de reglas");
				const data = await res.json();
				rulesPath = data.path;
			}
			// Procesar el resto de datos
			const processedData = {
				...formData,
				minAge: parseInt(formData.minAge) || 0,
				rating: parseFloat(formData.rating) || null,
				categories: formData.categories
					.split(",")
					.map((cat) => cat.trim())
					.filter((cat) => cat),
				pros: formData.pros.split("\n").filter((pro) => pro.trim()),
				cons: formData.cons.split("\n").filter((con) => con.trim()),
				featured: formData.featured,
				image: imagePath,
				rulesFile: rulesPath,
			};
			await onSubmit(processedData);
			setUploading(false);
		} catch (err) {
			setUploading(false);
			toast({
				title: "Error al subir archivo",
				description: err.message,
				variant: "destructive",
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="mb-8">
			<Card className="glass-effect border-white/10">
				<CardHeader>
					<CardTitle className="text-white">
						{initialData ? "Editar Juego" : "Añadir Nuevo Juego"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div>
								<label className="block text-white font-medium mb-2">
									Nombre *
								</label>
								<Input
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Ej: Wingspan"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Jugadores
								</label>
								<Input
									name="players"
									value={formData.players}
									onChange={handleInputChange}
									placeholder="Ej: 1-5"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Edad Mínima
								</label>
								<Input
									name="minAge"
									type="number"
									value={formData.minAge}
									onChange={handleInputChange}
									placeholder="Ej: 10"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Duración
								</label>
								<Input
									name="duration"
									value={formData.duration}
									onChange={handleInputChange}
									placeholder="Ej: 40-70 min"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Dificultad
								</label>
								<select
									name="difficulty"
									value={formData.difficulty}
									onChange={handleInputChange}
									className="w-full h-10 px-3 py-2 bg-slate-800 border border-white/20 rounded-md text-white">
									<option value="Fácil">Fácil</option>
									<option value="Medio">Medio</option>
									<option value="Difícil">Difícil</option>
								</select>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Rating (1-5)
								</label>
								<Input
									name="rating"
									type="number"
									step="0.1"
									min="1"
									max="5"
									value={formData.rating}
									onChange={handleInputChange}
									placeholder="Ej: 4.5"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="featured"
									name="featured"
									checked={formData.featured}
									onChange={handleInputChange}
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
								/>
								<label htmlFor="featured" className="text-white font-medium">
									¿Juego destacado en la página principal?
								</label>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-white font-medium mb-2">
									Categorías (separadas por comas)
								</label>
								<Input
									name="categories"
									value={formData.categories}
									onChange={handleInputChange}
									placeholder="Ej: Estrategia, Familiar"
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Enlace Externo
								</label>
								<Input
									name="externalLink"
									value={formData.externalLink}
									onChange={handleInputChange}
									placeholder="https://boardgamegeek.com/..."
									className="glass-effect border-white/20 text-white"
								/>
							</div>
						</div>

						<div>
							<label className="block text-white font-medium mb-2">
								Descripción Corta
							</label>
							<Input
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Una breve descripción del juego"
								className="glass-effect border-white/20 text-white"
							/>
						</div>

						<div>
							<label className="block text-white font-medium mb-2">
								Reseña Completa
							</label>
							<Textarea
								name="review"
								value={formData.review}
								onChange={handleInputChange}
								placeholder="Tu reseña detallada del juego..."
								rows={6}
								className="glass-effect border-white/20 text-white"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-white font-medium mb-2">
									Pros (uno por línea)
								</label>
								<Textarea
									name="pros"
									value={formData.pros}
									onChange={handleInputChange}
									placeholder="Componentes de calidad&#10;Mecánicas elegantes"
									rows={4}
									className="glass-effect border-white/20 text-white"
								/>
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Contras (uno por línea)
								</label>
								<Textarea
									name="cons"
									value={formData.cons}
									onChange={handleInputChange}
									placeholder="Curva de aprendizaje inicial&#10;Puede ser lento"
									rows={4}
									className="glass-effect border-white/20 text-white"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-white font-medium mb-2">
									Imagen de portada (ruta relativa o subir archivo)
								</label>
								<input
									type="text"
									name="image"
									value={formData.image}
									onChange={handleInputChange}
									placeholder="/images/games/mi-juego.jpg"
									className="glass-effect border-white/20 text-white w-full mb-2"
								/>
								<input
									type="file"
									name="imageFile"
									accept="image/*"
									onChange={handleFileChange}
									className="block w-full text-xs text-gray-400"
								/>
								{(formData.image || imageFile) && (
									<div className="mt-2">
										<img
											src={
												imageFile
													? URL.createObjectURL(imageFile)
													: formData.image
											}
											alt="Previsualización"
											className="max-h-32 rounded border border-white/10"
											onError={(e) => (e.target.style.display = "none")}
										/>
									</div>
								)}
							</div>
							<div>
								<label className="block text-white font-medium mb-2">
									Archivo de reglas (PDF, ruta relativa o subir archivo)
								</label>
								<input
									type="text"
									name="rulesFile"
									value={formData.rulesFile}
									onChange={handleInputChange}
									placeholder="/rules/mi-juego.pdf"
									className="glass-effect border-white/20 text-white w-full mb-2"
								/>
								<input
									type="file"
									name="rulesFileFile"
									accept="application/pdf"
									onChange={handleFileChange}
									className="block w-full text-xs text-gray-400"
								/>
								{(formData.rulesFile || rulesFileFile) && (
									<div className="mt-2">
										<a
											href={
												rulesFileFile
													? URL.createObjectURL(rulesFileFile)
													: formData.rulesFile
											}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-400 underline text-xs">
											Ver PDF de reglas
										</a>
									</div>
								)}
							</div>
						</div>
						{uploading && (
							<div className="text-blue-400 text-xs mt-2">
								Subiendo archivos...
							</div>
						)}

						<div className="flex space-x-4 pt-4">
							<Button
								type="submit"
								className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
								<Save className="h-4 w-4 mr-2" />
								{initialData ? "Guardar Cambios" : "Añadir Juego"}
							</Button>
							<Button
								type="button"
								onClick={onCancel}
								variant="outline"
								className="border-white/20 text-white hover:bg-white/5">
								<X className="h-4 w-4 mr-2" />
								Cancelar
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AdminGameForm;
