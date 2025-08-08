import mongoose from 'mongoose';


export const connectDB = async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`);
        // console.log("MongoDB connected successfully");
    }catch(err){
        console.log("MongoDB connection failed", err.message);
        
    }
};
export default connectDB;