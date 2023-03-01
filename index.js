// Import packages
const express = require('express');
const home = require('./routes/home');

// Middleware
const app = express();
app.use(express.json());

// Routes
app.use('/api', home);

// connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Running On PORT: ${port}`));
