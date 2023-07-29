
import mongoose from 'mongoose';

export const connectDB = async () => {
    console.log('connectDB');
    try {
        const dbURI = process.env.DATABASE;
        const response = await mongoose.connect((dbURI as string));
        console.log(`MongoDB connected ${response.connection.host}...`);
    } catch (error) {
        
    }
}