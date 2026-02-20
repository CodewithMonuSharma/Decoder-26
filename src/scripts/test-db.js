const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });

async function testConnection() {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log("URI present:", !!MONGODB_URI);

    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log("Connected Successfully");
        console.log("ReadyState:", conn.connection.readyState);
        await mongoose.disconnect();
        console.log("Disconnected");
    } catch (err) {
        console.error("Connection Failed:", err.message);
    }
}

testConnection();
