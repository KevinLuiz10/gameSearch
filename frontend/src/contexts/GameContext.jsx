import { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { triggerSessionExpired } = useAuth();

    const fetchGames = async (query = '', category = '') => {
        setLoading(true);
        setError(null);

        try {
            let url = '/api/games?';
            if (category && category !== 'all') url += `category=${category}&`;
            if (query) url += `search=${query}&`;
            url += `_t=${Date.now()}`;

            const token = localStorage.getItem('token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                triggerSessionExpired();
                throw new Error('Sessão expirada');
            }

            if (!response.ok) throw new Error('Erro ao buscar jogos');

            const data = await response.json();
            setGames(data);

        } catch (err) {
            if (err.message !== 'Sessão expirada') {
                console.error(err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- NOVA FUNÇÃO: CRIAR JOGO ---
    const createGame = async (gameData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });

            if (response.status === 401 || response.status === 403) {
                triggerSessionExpired();
                throw new Error('Sessão expirada');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar jogo');
            }

            // Se deu certo, recarrega a lista para mostrar o novo jogo
            await fetchGames();
            return { success: true };

        } catch (err) {
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <GameContext.Provider value={{ games, loading, error, fetchGames, createGame, setGames }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;