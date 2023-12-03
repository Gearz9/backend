const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const database = require('./config/database');






const PORT = process.env.PORT || 4000;
database.dbConnect();




const userRoutes = require('./routes/User');
app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/v1/auth', userRoutes);