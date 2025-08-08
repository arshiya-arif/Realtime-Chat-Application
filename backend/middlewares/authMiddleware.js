import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel.js';
export const protectRoute = async (req, res, next) => {
try{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized, no user found' });
    }
    req.user = user;
    next();
}
catch (error) {
    console.log("Auth middleware error: ", error);
    return res.status(401).json({ message: 'Unauthorized, invalid token' });
}
    }   