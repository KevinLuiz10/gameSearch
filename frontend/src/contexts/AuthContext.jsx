import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Hook personalizado para facilitar o uso em outros componentes (como o Header)
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ao iniciar, verifica se já tem token salvo no navegador
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Função de Login
    const login = async (username, password) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao fazer login");
            }

            // Salva no estado e no LocalStorage
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Função de Logout
    const logout = async () => {
        const tokenToInvalidate = token || localStorage.getItem("token");

        if (tokenToInvalidate) {
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenToInvalidate}`
                    },
                });
            } catch (error) {
                console.error("Erro ao notificar logout ao servidor (token pode não ter sido invalidado no DB):", error);
            }
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.reload()
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};