import { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);      // Lista de jogos
    const [loading, setLoading] = useState(true); // Status de carregamento
    const [error, setError] = useState(null);     // Mensagem de erro

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);

                //const url = "https://api.allorigins.win/raw?url=https://www.freetogame.com/api/games";
                //const url = "https://www.freetogame.com/api/games";

                const response = await fetch("/api/games");

                if (!response.ok) {
                    throw new Error(`Erro na conexão: ${response.status}`);
                }

                const data = await response.json();

                setGames(data); // Salvar os jogos no estado
                setError(null); // Limpar erros antigos

            } catch (err) {
                console.error("Erro ao buscar jogos:", err);
                setError("Falha ao carregar a lista de jogos. Verifique sua conexão.");
            } finally {
                setLoading(false); //Retirar o loading
            }
        };

        fetchGames();
    }, []);


    return (
        <GameContext.Provider value={{ games, loading, error }}>
            {children}
        </GameContext.Provider>
    );
};