import React, { createContext, useContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Utilidad para convertir snake_case a camelCase
function toCamelCase(str) {
	return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// Convierte todas las claves de un objeto a camelCase (recursivo para arrays)
function keysToCamel(obj) {
	if (Array.isArray(obj)) {
		return obj.map(keysToCamel);
	} else if (obj !== null && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj).map(([k, v]) => [toCamelCase(k), keysToCamel(v)])
		);
	}
	return obj;
}

const ADMIN_TOKEN_KEY = "adminToken";

export const DataProvider = ({ children }) => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [adminToken, setAdminToken] = useState(() =>
		localStorage.getItem(ADMIN_TOKEN_KEY)
	);
	const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
		!!localStorage.getItem(ADMIN_TOKEN_KEY)
	);

	// Valores por defecto para blogPosts y funciones
	const blogPosts = [];
	const saveBlogPosts = () => {};
	const resetToOriginalData = () => {};
	const exportData = () => {};

	// CRUD de juegos usando la API
	const fetchGames = async () => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:4000/api/games");
			if (!res.ok) throw new Error("Error al obtener los juegos");
			const data = await res.json();
			// Convertir todos los juegos a camelCase
			setGames(keysToCamel(data));
			setError(null);
		} catch (err) {
			setError(err.message);
			setGames([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchGames();
	}, []);

	// Añadir juego
	const addGame = async (game, token) => {
		try {
			const res = await fetch("http://localhost:4000/api/games", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token || adminToken}`,
				},
				body: JSON.stringify(game),
			});
			if (!res.ok) throw new Error("Error al añadir el juego");
			await fetchGames();
			return { success: true };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};

	// Actualizar juego
	const updateGame = async (id, game, token) => {
		try {
			const res = await fetch(`http://localhost:4000/api/games/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token || adminToken}`,
				},
				body: JSON.stringify(game),
			});
			if (!res.ok) throw new Error("Error al actualizar el juego");
			await fetchGames();
			return { success: true };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};

	// Eliminar juego
	const deleteGame = async (id, token) => {
		try {
			const res = await fetch(`http://localhost:4000/api/games/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token || adminToken}`,
				},
			});
			if (!res.ok) throw new Error("Error al eliminar el juego");
			await fetchGames();
			return { success: true };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};

	// Login de admin
	const loginAdmin = async (username, password) => {
		try {
			const res = await fetch("http://localhost:4000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Error de autenticación");
			}
			const data = await res.json();
			localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
			setAdminToken(data.token);
			setIsAdminAuthenticated(true);
			return { success: true };
		} catch (err) {
			logoutAdmin();
			return { success: false, message: err.message };
		}
	};

	// Logout de admin
	const logoutAdmin = () => {
		localStorage.removeItem(ADMIN_TOKEN_KEY);
		setAdminToken(null);
		setIsAdminAuthenticated(false);
	};

	return (
		<DataContext.Provider
			value={{
				games,
				loading,
				error,
				blogPosts,
				addGame,
				updateGame,
				deleteGame,
				saveBlogPosts,
				resetToOriginalData,
				exportData,
				// Auth
				adminToken,
				isAdminAuthenticated,
				loginAdmin,
				logoutAdmin,
			}}>
			{children}
		</DataContext.Provider>
	);
};
