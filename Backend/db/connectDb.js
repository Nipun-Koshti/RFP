import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected!!!!!!!");

    } catch (error) {
        console.error("Error:->", error);
        process.exit(1);
    }
}

export default connectDb;