const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/test');

// you will have to create your own .env file in the root of the backend
// it is not recommended to commit .env files;
dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (error) => {
    if (error) throw error;
    console.log('connected to db!');
});

const app = express();

// Middleware
app.use(bodyParser.json());

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/test', postRoute);

app.get('/', (req, res) => res.send('Hello, fellow developer!'));

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log(`server is now listening for requests on port ${port}`);
});
