import rateLimit from "express-rate-limit"

export const quoteLimiter = rateLimit(
    {
        windowMs: 60 * 1000,
        max: 5,
        message: 
        {
           content: "Từ từ đã nào, AI cũng cần nghỉ ngơi mà ní!!",
           author: "Rate Limit System"
        },
        standardHeaders: true,
        legacyHeaders: false
    }
);