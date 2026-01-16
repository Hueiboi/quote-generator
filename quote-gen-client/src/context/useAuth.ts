import { useContext } from "react";
import { AuthContext } from "./authContext";

// Custom hook để sử dụng context trong các component
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) 
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
