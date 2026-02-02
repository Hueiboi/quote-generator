import con from "../config/db.js";

// Model để tương tác với bảng users trong database
export const User = {
    // Tìm user theo email
    findByEmail: async (email) => {
        try {
            const result = await con.query("SELECT * FROM users where email = $1", [email])
            // Lưu ý: phải dùng result.rows (có 's'), không phải result.row
            return result.rows[0]
        } catch (error) {
            console.log("Error at findByEmail: ", error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await con.query("SELECT * FROM users WHERE id = $1", [id])
            return result.rows[0];
        } catch (error) {
            console.log("Error at findById: ", error)
            throw error;
        }
    },

    // Tạo user mới trong database
    create: async (email, username, hashedPassword) => {
        const result = await con.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email", [username, email, hashedPassword])
        // RETURNING trả về user vừa tạo (không bao gồm password)
        return result.rows[0];
    },

    // Cập nhật refresh token cho user (dùng khi đăng nhập hoặc đăng xuất)
    updateRefreshToken: async (id, token) => {
        const result = await con.query("UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING id", [token, id])
        // rowCount > 0 nghĩa là đã update thành công ít nhất 1 row
        return result.rowCount > 0;
    }
}