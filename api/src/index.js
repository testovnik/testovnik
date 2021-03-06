const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/test');
const userRoute = require('./routes/user');

// you will have to create your own .env file in the root of the backend
// it is not recommended to commit .env files;
dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (error) => {
    if (error) throw error;
    console.log('connected to db!');
});
mongoose.set('useFindAndModify', false);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/test', postRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => res.send('Hello, fellow developer!'));

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`server is now listening for requests on port ${port}`);
});
