import { createContext, useState, useContext } from 'react';
// Importamos o hook de Auth para usar a função de expiração
import { useAuth } from './AuthContext';

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pegamos a função que abre o modal de erro do AuthContext
    const { triggerSessionExpired } = useAuth();

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

            // Anti-cache do navegador
            url += `_t=${Date.now()}`;

            // Pega o token atual do storage
            const token = localStorage.getItem('token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token
                    'Content-Type': 'application/json'
                }
            });

            // --- LÓGICA DE INTERCEPTAÇÃO DE ERRO 401/403 ---
            if (response.status === 401 || response.status === 403) {
                // Dispara o modal global
                triggerSessionExpired();
                // Interrompe o fluxo lançando um erro específico
                throw new Error('Sessão expirada');
            }

            if (!response.ok) {
                throw new Error('Erro ao buscar jogos');
            }

            const data = await response.json();
            setGames(data);

        } catch (err) {
            // Se for erro de sessão, não precisamos mostrar msg de erro na tela de jogos
            // pois o Modal já vai aparecer.
            if (err.message !== 'Sessão expirada') {
                console.error(err);
                setError(err.message);
            }
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