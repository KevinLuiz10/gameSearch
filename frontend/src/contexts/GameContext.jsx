import { createContext, useState, useEffect, useCallback } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGames = useCallback(async (categories = ['all']) => {
        try {
            setLoading(true);
            setError(null);


            if (categories.includes('all') || categories.length === 0) {
                const response = await fetch("/api/games");
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                const data = await response.json();
                setGames(data);
                return;
            }

            const requests = categories.map(cat =>
                fetch(`/api/games?category=${cat}`).then(res => {
                    if (!res.ok) return [];
                    return res.json();
                })
            );

            console.log("Disparando múltiplas requisições para:", categories);

            const results = await Promise.all(requests);

            const allFetchedGames = results.flat();

            const uniqueGamesMap = new Map();
            allFetchedGames.forEach(game => {
                uniqueGamesMap.set(game.id, game);
            });

            const uniqueGamesList = Array.from(uniqueGamesMap.values());

            setGames(uniqueGamesList);

        } catch (err) {
            console.error("Erro ao buscar jogos:", err);
            setError("Falha ao carregar a lista de jogos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Primeira busca
    useEffect(() => {
        fetchGames(['all']);
    }, [fetchGames]);


    const applyFilter = (selectedCategories) => {
        const categoriesArray = Array.isArray(selectedCategories)
            ? selectedCategories
            : [selectedCategories];

        fetchGames(categoriesArray);
    };

    return (
        <GameContext.Provider value={{ games, loading, error, applyFilter }}>
            {children}
        </GameContext.Provider>
    );
};