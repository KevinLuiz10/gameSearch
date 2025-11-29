import { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGames = async (query = '', category = '') => {
        setLoading(true);
        setError(null);

        try {
            let url = '/api/games?';

            if (category && category !== 'all') {
                url += `category=${category}&`;
            }

            if (query) {
                url += `search=${query}&`;
            }

            url += `_t=${Date.now()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Não autorizado. Faça login novamente.');
                }
                throw new Error('Erro ao buscar jogos');
            }

            const data = await response.json();
            setGames(data);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GameContext.Provider value={{ games, loading, error, fetchGames, setGames }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;