import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/allRoutes.js';

dotenv.config();

// Khởi tạo server Express và Middleware để xử lý request
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

// Khởi động server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
} )