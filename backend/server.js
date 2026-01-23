const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db.config');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const {notFound, errorHandler} = require('./middlewares/error.middleware')

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); //to accept JSON data

app.get('/', (req, res) => {
    res.send("API is running.");
})

app.get('/api/chats', (req, res) =>{
    res.send(chats);
})

app.get('/api/chats/:id', (req,res) =>{
    const singleChat = chats.find((c) => c._id === req.params.id)
    res.send(singleChat);
})

app.use('/api/user', userRoutes)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.yellow.bold);
});