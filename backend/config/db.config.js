const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`.cyan.underline)
    }catch(error){
        console.log("MongoDB connection error!!: ".red.bold, error);
        process.exit(1);
    }
}

module.exports = connectDB;