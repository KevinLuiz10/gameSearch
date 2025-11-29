import { createContext, useState, useEffect, useContext } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Novo estado para controlar o Pop-up de sessão expirada
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

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

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

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
                console.error("Erro no logout API:", error);
            }
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Recarrega a página
        window.location.reload();
    };

    // Função que será chamada pelos outros contextos quando der erro 401
    const triggerSessionExpired = () => {
        setSessionExpired(true);
    };

    // Ao fechar o modal, fazemos o logout forçado
    const handleExpiredConfirm = () => {
        setSessionExpired(false);
        logout();
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            triggerSessionExpired, // Exportamos essa função nova
            isAuthenticated: !!user
        }}>
            {children}

            {/* MODAL DE SESSÃO EXPIRADA (GLOBAL) */}
            <Dialog
                open={sessionExpired}
                onClose={handleExpiredConfirm} // Fecha se clicar fora (opcional, aqui força logout)
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Sessão Expirada"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sua sessão de login expirou ou é inválida. Por favor, faça login novamente para continuar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExpiredConfirm} autoFocus variant="contained">
                        OK, Entendi
                    </Button>
                </DialogActions>
            </Dialog>

        </AuthContext.Provider>
    );
};