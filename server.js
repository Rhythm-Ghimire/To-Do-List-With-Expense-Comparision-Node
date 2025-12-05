require('dotenv').config();  

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./back-end/config/database');
const authRoutes = require('./back-end/routes/auth');
const planRoutes = require('./back-end/routes/plan');  
const profileRoutes = require('./back-end/routes/profile');
const { protect } = require('./back-end/middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;


if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file!");
  process.exit(1);
}

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/plan', protect, planRoutes);
app.use('/api/profile', protect, profileRoutes);


app.get('/expenses', (req, res) => res.sendFile(path.join(__dirname, 'views', 'expenses.html')));
app.get('/todolist', (req, res) => res.sendFile(path.join(__dirname, 'views', 'todolist.html')));
app.get('/graphs', (req, res) => res.sendFile(path.join(__dirname, 'views', 'graphs.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/create-plan', (req, res) => { res.sendFile(path.join(__dirname, 'views', 'create-plan.html'));});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

