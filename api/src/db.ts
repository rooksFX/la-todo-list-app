
import mongoose from 'mongoose';

export const connectDB = async () => {
    console.log('Trying to connect to DB...');
    try {
        const dbURI = process.env.DATABASE;
        const response = await mongoose.connect((dbURI as string));
        console.log(`MongoDB response ${response}...`);
        console.log(`MongoDB connected ${response.connection.host}...`);
    } catch (error) {
        console.log(`MongoDB error ${error}...`);
    }
}