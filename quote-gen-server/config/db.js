import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20, // Số kết nối tối đa trong hồ (nên có)
    idleTimeoutMillis: 30000 // Tự đóng kết nối nếu không dùng sau 30 giây
});

// Kiểm tra kết nối ngay khi khởi động app
const checkConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Kết nối cơ sở dữ liệu thành công!");
        client.release(); // Quan trọng: Giải phóng kết nối ngay sau khi kiểm tra
    } catch (err) {
        console.error("Lỗi kết nối database:", err.message);
    }
};

checkConnection();

export default {
    // Sử dụng pool.query trực tiếp giúp tự động mượn/trả kết nối
    query: (text, params) => pool.query(text, params),
    pool // Xuất thêm pool nếu cần dùng cho Transactions (giao dịch)
};