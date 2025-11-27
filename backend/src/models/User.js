const db = require('../config/db');

class User {
    // Busca usuário pelo nome de login (username)
    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    // Buscar usuário pelo ID 
    static async findById(id) {
        const [rows] = await db.execute('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;