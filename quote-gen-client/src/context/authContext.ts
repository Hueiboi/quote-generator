import { createContext } from "react";

// Định nghĩa kiểu dữ liệu cho user (thông tin hiển thị trong app)
export interface User {
    name: string;
    email: string;
}

// Giá trị cung cấp cho toàn app
// login sẽ tự gọi API, lưu token vào localStorage và set user
export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean; // trạng thái kiểm tra đăng nhập ban đầu (/auth/me)
}

// Tạo context và export để useAuth hook có thể sử dụng
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
