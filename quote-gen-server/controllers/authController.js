import { User } from '../model/authModel.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {username, email, password} = req.body
    
    try {
        // Kiểm tra email đã được đăng ký chưa
        const existingUser = await User.findByEmail(email)
        if(existingUser) {
            return res.status(400).json({message: "Email đã được đăng ký"})
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        // genSalt(10): tạo salt với độ phức tạp 10 rounds
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Tạo user mới trong database
        const newUser = await User.create(email, username, hashedPassword)

        // Trả về thông tin user vừa tạo (không bao gồm password)
        res.status(201).json({
            message: "Đăng ký thành công",
            user: newUser
        })
    } catch (error) {
        console.error("Lỗi đăng ký:", error.message)
        res.status(500).json({message: "Lỗi server"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Kiểm tra email và password đã được gửi lên chưa
        if(!email || !password) {
            return res.status(400).json({message: "Thiếu email hoặc mật khẩu"})
        }

        // Tìm user trong database theo email (PHẢI có await vì đây là async function)
        const existingUser = await User.findByEmail(email)
        if(!existingUser) {
            return res.status(401).json({message: "Tài khoản không tồn tại"})
        }

        // So sánh password người dùng nhập với password đã hash trong database
        const checkLogin = await bcrypt.compare(password, existingUser.password) 
        if(!checkLogin) {
            return res.status(401).json({message: "Email hoặc mật khẩu không chính xác"})
        }
        
        // Tạo JWT access token (hết hạn sau 1 giờ)
        const accessToken = jwt.sign({id: existingUser.id, email: existingUser.email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        })
        
        // Tạo JWT refresh token (hết hạn sau 7 ngày)
        const refreshToken = jwt.sign({id: existingUser.id, email: existingUser.email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'
        })

        // Lưu refresh token vào database để có thể refresh access token sau này
        await User.updateRefreshToken(existingUser.id, refreshToken)

        // Trả về thông tin user và tokens cho client
        return res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Lỗi đăng nhập", error.message)
        res.status(500).json({message: "Lỗi server"})
    }
}

export const logout = async (req, res) => {
    const {userId} = req.body

    try {
        await User.updateRefreshToken(userId, null)
        res.status(200).json({message: "Đăng xuất thành công"})
    } catch (error) {
        console.error("Lỗi đăng xuất", error.message)
        res.status(500).json({message: "Lỗi server"})
    }
}

export const refreshToken = async (req, res) => {
    const {refreshToken} = req.body
    if(!refreshToken) {
        return res.status(401).json({message: "Thiếu refresh token"})
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = await User.findById(decoded.id)

        if(!existingUser || existingUser.refreshToken !== refreshToken) {
            return res.status(401).json({message: "Refresh token không hợp lệ"})
        }

        const newAccessToken = jwt.sign({id: existingUser.id, email: existingUser.email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        })

        return res.status(200).json({
            message: "Refresh token thành công",
            accessToken: newAccessToken
        })
    } catch (error) {
        return res.status(403).json({ message: "Phiên đăng nhập hết hạn, vui lòng login lại" });
    }
}


export const getUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }
        return res.status(200).json({
            message: "Lấy user thành công",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Lỗi lấy user", error.message)
        res.status(500).json({message: "Lỗi server"})
    }
}