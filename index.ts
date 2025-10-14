import express from 'express';
import cors from "cors";
import routes from "./routers/index.routes";
import dotenv from "dotenv";
import cookieParser = require('cookie-parser');

import { connectDB } from './configs/database';

// Load biến môi trường
dotenv.config();

// Kết nối DB
connectDB();

const app = express();
const port = 4000;

// Cấu hình CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Cho phép gửi cookie
}));

// Cấu hình lấy cookie
app.use(cookieParser());


// Cho phép gửi data lên dạng json
app.use(express.json());

// Thiết lập đường dẫn
app.use("/", routes);



app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
