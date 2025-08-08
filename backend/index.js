import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import {app,server} from './lib/socket.js'; // Import the app from socket.js
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import connectDB from './lib/db.js';
app.use(express.json({ limit: '5mb' })); // or even higher like '5mb'
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
    connectDB();
}
);
