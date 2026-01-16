import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { generateQuote } from "../controllers/quoteController.js";
import { quoteLimiter } from "../middlewares/rateLimiter.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Auth endpoint
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', verifyToken, logout);

// Endpoint để tạo quote
router.post('/generate', verifyToken, quoteLimiter ,generateQuote);

export default router;