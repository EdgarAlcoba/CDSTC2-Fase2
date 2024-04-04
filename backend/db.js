const mongoose = require ("mongoose");
const db = process.env.MONGO_URI;

const connectDB = async () => {
    try{
        await mongoose.connect(db);
        console.log("MongoDB connected");
    } catch(e) {
        console.error(e.message);
        process.exit(1);
    }
};

module.exports = connectDB;