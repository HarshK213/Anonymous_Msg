import mongoose from "mongoose";

type connectionObj = {
    isConnected?: number,
}

const connection: connectionObj = {}

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection failed : ", error);
        process.exit(1);
    }
}

export default dbConnect;