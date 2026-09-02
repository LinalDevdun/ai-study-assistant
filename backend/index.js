const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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

// --- MULTER CONFIGURATION (FOR FILE UPLOADS) ---

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });

// --- AUTHENTICATION MIDDLEWARE (The Bouncer) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. Please log in.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        
        req.user = user; 
        next(); 
    });
};

// --- ROLE-BASED MIDDLEWARE ---
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to view this.' });
        }
        next();
    };
};

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send('AI Study Assistant Backend is running!');
});

// USER REGISTRATION ENDPOINT (UPDATED FOR DEGREE & BATCH)
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, degree, batch } = req.body;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, degree, batch) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, bcryptPassword, degree, batch]
        );

        res.json({ message: 'User registered successfully!', user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
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

        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.rows[0].id]);

        const token = jwt.sign(
            { 
                user_id: user.rows[0].id,
                role: user.rows[0].role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.json({ 
            message: 'Login successful!', 
            token, 
            role: user.rows[0].role 
        });

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


// --- LMS: COURSE & LESSON ROUTES ---

// UPLOAD A MODULE & SAVE TO DATABASE (Lecturers & Admins Only)
app.post('/courses', authenticateToken, authorizeRoles('LECTURER', 'ADMIN'), upload.single('file'), async (req, res) => {
  try {
    const { courseTitle, degree, batch } = req.body;
    const file = req.file;
    const lecturerId = req.user.user_id;

    if (!file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const newCourse = await pool.query(
      'INSERT INTO courses (title, degree, batch, file_path, lecturer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [courseTitle, degree, batch, file.path, lecturerId]
    );

    res.status(201).json({ 
      message: 'Module successfully uploaded and saved to database!',
      course: newCourse.rows[0] 
    });
  } catch (error) {
    console.error('Database Upload Error:', error.message);
    res.status(500).json({ error: 'Server error during upload to database' });
  }
});

// FETCH COURSES (Filtered by student's Degree and Batch automatically)
app.get('/courses', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const userRole = req.user.role;

        // Admins and Lecturers can view all courses
        if (userRole === 'ADMIN' || userRole === 'LECTURER') {
            const courses = await pool.query('SELECT * FROM courses ORDER BY id ASC');
            return res.json(courses.rows);
        }

        // Fetch student's assigned degree and batch profile
        const userResult = await pool.query('SELECT degree, batch FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        const { degree, batch } = userResult.rows[0];

        // Return only courses matching the student's specific degree and batch cohort
        const courses = await pool.query(
            'SELECT * FROM courses WHERE degree = $1 AND batch = $2 ORDER BY id ASC',
            [degree, batch]
        );

        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/courses/:courseId/lessons', authenticateToken, async (req, res) => {
    try {
        const { courseId } = req.params;
        const lessons = await pool.query(
            'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_number ASC',
            [courseId]
        );
        res.json(lessons.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- AI TUTOR ENDPOINT ---
app.post('/tutor', authenticateToken, async (req, res) => {
    try {
        const { question, context } = req.body;
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are an expert, encouraging AI Study Tutor. 
        Your goal is to help a student understand academic concepts simply and clearly.
        Break down complex topics into beginner-friendly explanations.
        
        Context provided from the lesson: "${context || 'No specific lesson context provided.'}"
        
        Here is the student's question: "${question}"`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        res.json({ answer: responseText });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'AI failed to respond.' });
    }
});

// --- ADMIN ROUTES ---

app.get('/admin/users', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const users = await pool.query('SELECT id, name, email, role, degree, batch, last_login FROM users ORDER BY id ASC');
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/admin/users/:id/role', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        const updatedUser = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
            [role, id]
        );
        
        res.json({ message: 'User role updated successfully!', user: updatedUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});