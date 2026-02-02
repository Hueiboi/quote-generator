import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import type { User } from "./authContext";
import { request } from "../utils/api";

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await request("/auth/me");
                if (res && res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Lỗi checkAuth", error);
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Xử lý login: gọi API, lưu token vào localStorage và set user
    const login = async (email: string, password: string) => {
        // Gửi request đăng nhập đến server
        const response = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        // Nếu response không ok -> cố gắng đọc message từ server rồi throw error
        if (!response.ok) {
            let errorMessage = "Đăng nhập thất bại";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.user || !data.accessToken) {
            throw new Error("Dữ liệu người dùng hoặc token không hợp lệ");
        }

        const userData: User = {
            name: data.user.username || data.user.name || "",
            email: data.user.email,
        };

        setUser(userData);
        localStorage.setItem("token", data.accessToken);
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    };
    
    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {loading ? (
                <div className="flex h-screen items-center justify-center">
                    <p className="animate-pulse">Đang kiểm tra đăng nhập...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};