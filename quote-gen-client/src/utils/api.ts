export const request = async (url: string, options: RequestInit = {}) => {
    const baseURL = "http://localhost:5000/api";
    const token = localStorage.getItem("token");
  
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
  
    let response = await fetch(`${baseURL}${url}`, { ...options, headers });
  
    // Out of token
    if (response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${baseURL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
  
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newToken = data.accessToken;
  
            localStorage.setItem("token", newToken);
  
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            
            response = await fetch(`${baseURL}${url}`, {
              ...options,
              headers: retryHeaders,
            });
            
            return response; 
          }
        } catch (err) {
          console.error("Refresh token failed", err);
        }
      }
  
      localStorage.clear();
      window.location.href = "/login";
    }
  
    return response;
  };