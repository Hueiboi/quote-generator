import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { getFavQuotes, createFavQuotes, deleteFavQuotes } from "../controllers/favController.js";
import { generateQuote } from "../controllers/quoteController.js";
import { quoteLimiter } from "../middlewares/rateLimiter.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Auth endpoint
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', verifyToken, logout);

// Quote endpoint
router.post('/generate', verifyToken, quoteLimiter ,generateQuote);

// Favourite endpoint
router.get('/favourites', verifyToken, getFavQuotes);
router.post('/favourites', verifyToken, createFavQuotes);
router.delete('/favourites/:id', verifyToken, deleteFavQuotes)

export default router;