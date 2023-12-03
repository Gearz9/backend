const app = require('express');


const PORT = process.env.PORT || 4000;

app.use(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});