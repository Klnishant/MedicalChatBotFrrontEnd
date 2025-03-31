import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};
console.log(connection);


async function dbconnect() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;
        console.log(connection);
        console.log(connection.isConnected);
        console.log(db.connections[0]);
        console.log(db.connections[0].readyState);
        
    } catch (error: any) {
        console.error("Database connection failed");
        console.log(error);
        return Promise.reject(new Error("Database connection failed"));
      }
}

export default dbconnect;