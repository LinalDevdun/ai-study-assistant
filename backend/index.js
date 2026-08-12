const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Middleware (Allows your frontend to talk to your backend)
app.use(cors());
app.use(express.json());

// Set up the PostgreSQL Database Connection
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Test the Database Connection
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database successfully!'))
    .catch(err => console.error('❌ Database connection error', err.stack));

// --- AUTHENTICATION MIDDLEWARE (The Bouncer) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format expects "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Access denied. Please log in.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        
        req.user = user; 
        next(); 
    });
};

// --- ROUTES ---

// A basic test route
app.get('/', (req, res) => {
    res.send('AI Study Assistant Backend is running!');
});

// USER REGISTRATION ENDPOINT
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [name, email, bcryptPassword]
        );

        res.json({ message: 'User registered successfully!', user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// USER LOGIN ENDPOINT
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { user_id: user.rows[0].id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.json({ message: 'Login successful!', token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// CREATE A SUBJECT (Protected Route)
app.post('/subjects', authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.user_id; 

        const newSubject = await pool.query(
            'INSERT INTO subjects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, description]
        );

        res.json({ message: 'Subject created!', subject: newSubject.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET ALL SUBJECTS FOR A USER ---
app.get('/subjects', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const subjects = await pool.query('SELECT * FROM subjects WHERE user_id = $1', [userId]);
        res.json(subjects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- CREATE A NOTE ---
app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const { subject_id, title, content } = req.body;
        const userId = req.user.user_id;

        const newNote = await pool.query(
            'INSERT INTO notes (user_id, subject_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, subject_id, title, content]
        );
        res.json({ message: 'Note created!', note: newNote.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET ALL NOTES ---
app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const notes = await pool.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
        res.json(notes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- CREATE A TASK ---
app.post('/tasks', authenticateToken, async (req, res) => {
    try {
        const { subject_id, title, description, due_date, priority } = req.body;
        const userId = req.user.user_id;

        const newTask = await pool.query(
            'INSERT INTO tasks (user_id, subject_id, title, description, due_date, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, subject_id, title, description, due_date, priority]
        );
        res.json({ message: 'Task created!', task: newTask.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET ALL TASKS ---
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- AI TUTOR ENDPOINT ---
app.post('/tutor', authenticateToken, async (req, res) => {
    try {
        const { question } = req.body;
        
        // 1. Initialize the AI with your secret key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 2. Give the AI its personality and rules (Prompt Engineering)
        const systemPrompt = `You are an expert, encouraging AI Study Tutor. 
        Your goal is to help a student understand academic concepts simply and clearly.
        Break down complex topics into beginner-friendly explanations.
        Here is the student's question: "${question}"`;

        // 3. Ask the AI and wait for the response
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        // 4. Send the AI's answer back to the React frontend
        res.json({ answer: responseText });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'AI failed to respond.' });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});