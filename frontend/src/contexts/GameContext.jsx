import { createContext, useState, useEffect, useCallback } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGames = useCallback(async (categories = ['all'], searchTerm = '') => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("Usuário não autenticado");
            }

            const primaryCategory = Array.isArray(categories) ? categories[0] : categories;

            const params = new URLSearchParams();
            if (primaryCategory && primaryCategory !== 'all') {
                params.append('category', primaryCategory);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const url = `/api/games?${params.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Sessão expirada. Faça login novamente.");
                }
                throw new Error(`Erro do servidor: ${response.status}`);
            }

            const data = await response.json();
            setGames(data);

        } catch (err) {
            console.error("Erro no frontend:", err);
            if (err.message.includes("Sessão expirada")) {
                localStorage.removeItem('token');
                window.location.reload(); // Força recarregar para cair no login
            }
            setError(err.message || "Falha na comunicação com o servidor.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca inicial ao carregar a página
    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    const applyFilter = (categories, searchTerm) => {
        fetchGames(categories, searchTerm);
    };

    return (
        <GameContext.Provider value={{ games, loading, error, applyFilter }}>
            {children}
        </GameContext.Provider>
    );
};