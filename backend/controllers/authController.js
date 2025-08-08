import { generateToken } from '../lib/utilis.js';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

//signup 
export const signup = async (req, res) => {
    const { fullName, email, password, profilePicture } = req.body;
    if(!fullName || !email || !password ) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try{
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });
        if(newUser) {
            //generate token
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePicture: newUser.profilePicture,
            });
        }
        else{
        return res.status(400).json({ message: 'Invalid user data' });
        }
        

    }catch(error) {
       console.log("Signup error: ", error);
         return res.status(500).json({ message: 'Internal server error' });
    }
};


//login
export const login = async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        //generate token
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
        });
    }catch(error){
        console.log("Login error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


//logout
export const logout = async (req, res) => {
    try{
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 0 // Set the maxAge to 0 to delete the cookie
    });
    return res.status(200).json({ message: 'Logged out successfully' });
    }catch(error){
        console.log("Logout error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


 export const updateProfile = async (req, res) => {
    try{
        const {profilePicture}=req.body;
        const userId = req.user._id; // Assuming you have middleware to set req.user
        if (!profilePicture) {
            return res.status(400).json({ message: 'Please provide a profile picture' });
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePicture: uploadResponse.secure_url,
        }, { new: true });
        res.status(200).json(updatedUser);

    }catch(error){  
        console.log("Update profile error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//check auth

export const checkAuth = async (req, res) => {

    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Check auth error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

    