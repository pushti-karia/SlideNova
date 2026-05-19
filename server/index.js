require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const presentationRoutes = require('./routes/presentationRoutes');

const app = express();

// Middleware — allow configured origin or all origins as fallback
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use('/downloads', express.static('downloads'));

// Routes
app.use('/api/presentations', presentationRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
