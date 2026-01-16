import jwt from 'jsonwebtoken'

// Middleware để verify JWT token trước khi cho phép truy cập các protected routes
const verifyToken = (req, res, next) => {
    // 1. Lấy token từ header Authorization
    // Format: "Bearer <token>" -> cần split để lấy phần token
    const authHeader = req.headers['authorization']

    // Tách lấy token từ chuỗi "Bearer <token>"
    // authHeader.split(' ')[0] = "Bearer", authHeader.split(' ')[1] = token
    const token = authHeader && authHeader.split(' ')[1]
    
    // 2. Kiểm tra token có tồn tại không
    // Nếu không có token -> trả về 401 (Unauthorized)
    if(!token) {
        return res.status(401).json({message: "Cần đăng nhập để thực hiện thao tác"})
    }
    
    // 3. Verify token với secret key
    // Nếu token hợp lệ -> decoded chứa thông tin user (id, email từ khi tạo token)
    // Nếu token không hợp lệ hoặc hết hạn -> throw error
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Gán thông tin user vào req.user để các route handler có thể sử dụng
        req.user = decoded
        // Cho phép tiếp tục đến route handler
        next()
    } catch (error) {
        // Token không hợp lệ hoặc đã hết hạn -> trả về 403 (Forbidden)
        res.status(403).json({message: "Token không hợp lệ hoặc đã hết hạn"})
    }
}

export default verifyToken