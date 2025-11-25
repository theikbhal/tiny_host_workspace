const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const authRoutes = require('./routes/auth');

// Routes
app.use('/v1', authMiddleware, apiRoutes);
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Tiiny Host Mock API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
