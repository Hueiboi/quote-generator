import { createContext } from "react";

// Định nghĩa kiểu dữ liệu cho user
export interface User {
    name: string;
    email: string;
}

// ĐN giá trị cung cấp cho toàn app
export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

// Tạo context và export để useAuth hook có thể sử dụng
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
