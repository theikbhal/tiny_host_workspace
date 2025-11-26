const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const subdomainMiddleware = require('./middleware/subdomain');
const apiRoutes = require('./routes/api');
const siteRoutes = require('./routes/site');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply subdomain extraction middleware globally
app.use(subdomainMiddleware);


const authRoutes = require('./routes/auth');

// Routes
app.use('/v1', apiRoutes);
app.use('/auth', authRoutes);

// Site rendering routes (must be after other routes to avoid conflicts)
app.use(siteRoutes);

// Static files (for login, dashboard, etc.)
app.use(express.static('public'));


// Health check
app.get('/', (req, res) => {
    res.send('Tiiny Host Mock API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
