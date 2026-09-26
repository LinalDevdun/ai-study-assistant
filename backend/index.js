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

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


/* =========================================
   POSTGRESQL CONNECTION
========================================= */

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});


pool.connect()
    .then(() =>
        console.log(
            '✅ Connected to PostgreSQL Database successfully!'
        )
    )
    .catch(err =>
        console.error(
            '❌ Database connection error',
            err.stack
        )
    );


/* =========================================
   FILE UPLOAD CONFIGURATION
========================================= */

const uploadDir =
    path.join(__dirname, 'uploads');


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                'uploads/'
            );

        },


        filename: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                Date.now() +
                '-' +
                file.originalname
            );

        }

    });


const upload =
    multer({
        storage: storage
    });


/* =========================================
   AUTHENTICATE TOKEN
========================================= */

const authenticateToken = (
    req,
    res,
    next
) => {

    const authHeader =
        req.headers['authorization'];


    const token =
        authHeader &&
        authHeader.split(' ')[1];


    if (!token) {

        return res
            .status(401)
            .json({
                error:
                    'Access denied. Please log in.'
            });

    }


    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, user) => {

            if (err) {

                return res
                    .status(403)
                    .json({
                        error:
                            'Invalid or expired token.'
                    });

            }


            req.user = user;

            next();

        }
    );

};


/* =========================================
   AUTHORIZE ROLES
========================================= */

const authorizeRoles =
    (...allowedRoles) => {

        return (
            req,
            res,
            next
        ) => {

            if (
                !req.user ||
                !allowedRoles.includes(
                    req.user.role
                )
            ) {

                return res
                    .status(403)
                    .json({
                        error:
                            'Access denied. You do not have permission to view this.'
                    });

            }


            next();

        };

    };


/* =========================================
   HOME
========================================= */

app.get(
    '/',
    (req, res) => {

        res.send(
            'AI Study Assistant Backend is running!'
        );

    }
);


/* =========================================
   REGISTER
========================================= */

app.post(
    '/register',
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                degree,
                batch
            } = req.body;


            const userCheck =
                await pool.query(
                    'SELECT * FROM users WHERE email = $1',
                    [email]
                );


            if (
                userCheck.rows.length > 0
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'User already exists!'
                    });

            }


            const salt =
                await bcrypt.genSalt(10);


            const bcryptPassword =
                await bcrypt.hash(
                    password,
                    salt
                );


            const newUser =
                await pool.query(
                    `
                    INSERT INTO users
                    (
                        name,
                        email,
                        password_hash,
                        degree,
                        batch
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    RETURNING *
                    `,
                    [
                        name,
                        email,
                        bcryptPassword,
                        degree,
                        batch
                    ]
                );


            res.json({
                message:
                    'User registered successfully!',

                user:
                    newUser.rows[0]
            });


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);


/* =========================================
   LOGIN
========================================= */

app.post(
    '/login',
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            const user =
                await pool.query(
                    'SELECT * FROM users WHERE email = $1',
                    [email]
                );


            if (
                user.rows.length === 0
            ) {

                return res
                    .status(401)
                    .json({
                        error:
                            'Invalid email or password'
                    });

            }
                /* =====================================
                CHECK IF ACCOUNT IS ACTIVE
                ===================================== */

                if (
                    user.rows[0].is_active === false
                ) {

                    return res
                        .status(403)
                        .json({
                            error:
                                'Your account has been disabled. Please contact an administrator.'
                        });

                }


            const validPassword =
                await bcrypt.compare(
                    password,
                    user.rows[0]
                        .password_hash
                );


            if (!validPassword) {

                return res
                    .status(401)
                    .json({
                        error:
                            'Invalid email or password'
                    });

            }


            await pool.query(
                `
                UPDATE users
                SET last_login =
                    CURRENT_TIMESTAMP
                WHERE id = $1
                `,
                [
                    user.rows[0].id
                ]
            );


            const token =
                jwt.sign(
                    {
                        user_id:
                            user.rows[0].id,

                        role:
                            user.rows[0].role
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: '1h'
                    }
                );


            res.json({
                message:
                    'Login successful!',

                token,

                role:
                    user.rows[0].role
            });


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   GET CURRENT LOGGED-IN USER
========================================= */

app.get(
    '/me',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const user =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        role,
                        degree,
                        batch,
                        last_login
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        userId
                    ]
                );


            if (
                user.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User not found'
                    });

            }


            res.json(
                user.rows[0]
            );


        } catch (err) {

            console.error(
                'Get User Error:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);


/* =========================================
   SUBJECTS
========================================= */

app.post(
    '/subjects',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                name,
                description
            } = req.body;


            const userId =
                req.user.user_id;


            const newSubject =
                await pool.query(
                    `
                    INSERT INTO subjects
                    (
                        user_id,
                        name,
                        description
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3
                    )
                    RETURNING *
                    `,
                    [
                        userId,
                        name,
                        description
                    ]
                );


            res.json({
                message:
                    'Subject created!',

                subject:
                    newSubject.rows[0]
            });


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.get(
    '/subjects',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const subjects =
                await pool.query(
                    `
                    SELECT *
                    FROM subjects
                    WHERE user_id = $1
                    `,
                    [
                        userId
                    ]
                );


            res.json(
                subjects.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   NOTES
========================================= */

app.post(
    '/notes',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                subject_id,
                title,
                content
            } = req.body;


            const userId =
                req.user.user_id;


            const newNote =
                await pool.query(
                    `
                    INSERT INTO notes
                    (
                        user_id,
                        subject_id,
                        title,
                        content
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4
                    )
                    RETURNING *
                    `,
                    [
                        userId,
                        subject_id,
                        title,
                        content
                    ]
                );


            res.json({
                message:
                    'Note created!',

                note:
                    newNote.rows[0]
            });


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.get(
    '/notes',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const notes =
                await pool.query(
                    `
                    SELECT *
                    FROM notes
                    WHERE user_id = $1
                    `,
                    [
                        userId
                    ]
                );


            res.json(
                notes.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   TASKS
========================================= */

app.post(
    '/tasks',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                subject_id,
                title,
                description,
                due_date,
                priority
            } = req.body;


            const userId =
                req.user.user_id;


            const newTask =
                await pool.query(
                    `
                    INSERT INTO tasks
                    (
                        user_id,
                        subject_id,
                        title,
                        description,
                        due_date,
                        priority
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    RETURNING *
                    `,
                    [
                        userId,
                        subject_id,
                        title,
                        description,
                        due_date,
                        priority
                    ]
                );


            res.json({
                message:
                    'Task created!',

                task:
                    newTask.rows[0]
            });


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.get(
    '/tasks',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const tasks =
                await pool.query(
                    `
                    SELECT *
                    FROM tasks
                    WHERE user_id = $1
                    `,
                    [
                        userId
                    ]
                );


            res.json(
                tasks.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   COURSES
========================================= */

app.post(
    '/courses',
    authenticateToken,
    authorizeRoles(
        'LECTURER',
        'ADMIN'
    ),
    upload.single('file'),
    async (req, res) => {

        try {

            const {
                courseTitle,
                degree,
                batch
            } = req.body;


            const file =
                req.file;


            const lecturerId =
                req.user.user_id;


            if (!file) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Please upload a file'
                    });

            }


            const newCourse =
                await pool.query(
                    `
                    INSERT INTO courses
                    (
                        title,
                        degree,
                        batch,
                        file_path,
                        lecturer_id
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    RETURNING *
                    `,
                    [
                        courseTitle,
                        degree,
                        batch,
                        file.path,
                        lecturerId
                    ]
                );


            res
                .status(201)
                .json({
                    message:
                        'Module successfully uploaded and saved to database!',

                    course:
                        newCourse.rows[0]
                });


        } catch (error) {

            console.error(
                'Database Upload Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error during upload to database'
                });

        }

    }
);


app.get(
    '/courses',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const userRole =
                req.user.role;


            if (
                userRole === 'ADMIN' ||
                userRole === 'LECTURER'
            ) {

                const courses =
                    await pool.query(
                        `
                        SELECT *
                        FROM courses
                        ORDER BY id ASC
                        `
                    );


                return res.json(
                    courses.rows
                );

            }


            const userResult =
                await pool.query(
                    `
                    SELECT
                        degree,
                        batch
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        userId
                    ]
                );


            if (
                userResult.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User profile not found'
                    });

            }


            const {
                degree,
                batch
            } =
                userResult.rows[0];


            const courses =
                await pool.query(
                    `
                    SELECT *
                    FROM courses
                    WHERE degree = $1
                    AND batch = $2
                    ORDER BY id ASC
                    `,
                    [
                        degree,
                        batch
                    ]
                );


            res.json(
                courses.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.get(
    '/courses/:courseId',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                courseId
            } = req.params;


            const course =
                await pool.query(
                    `
                    SELECT *
                    FROM courses
                    WHERE id = $1
                    `,
                    [
                        courseId
                    ]
                );


            if (
                course.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'Course not found'
                    });

            }


            res.json(
                course.rows[0]
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.get(
    '/courses/:courseId/lessons',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                courseId
            } = req.params;


            const lessons =
                await pool.query(
                    `
                    SELECT *
                    FROM lessons
                    WHERE course_id = $1
                    ORDER BY order_number ASC
                    `,
                    [
                        courseId
                    ]
                );


            res.json(
                lessons.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   ASSIGNMENTS
========================================= */

app.post(
    '/assignments',
    authenticateToken,
    authorizeRoles(
        'LECTURER',
        'ADMIN'
    ),
    upload.single('file'),
    async (req, res) => {

        try {

            const {
                title,
                description,
                dueDate,
                degree,
                batch
            } = req.body;


            const file =
                req.file;


            const lecturerId =
                req.user.user_id;


            if (!file) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Please upload an assignment file (PDF, DOCX, etc.)'
                    });

            }


            const newAssignment =
                await pool.query(
                    `
                    INSERT INTO assignments
                    (
                        title,
                        description,
                        due_date,
                        degree,
                        batch,
                        file_path,
                        lecturer_id
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7
                    )
                    RETURNING *
                    `,
                    [
                        title,
                        description,
                        dueDate,
                        degree,
                        batch,
                        file.path,
                        lecturerId
                    ]
                );


            res
                .status(201)
                .json({
                    message:
                        'Assignment successfully uploaded!',

                    assignment:
                        newAssignment.rows[0]
                });


        } catch (error) {

            console.error(
                'Database Upload Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error during assignment upload'
                });

        }

    }
);


app.get(
    '/assignments',
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.user_id;


            const userRole =
                req.user.role;


            if (
                userRole === 'ADMIN' ||
                userRole === 'LECTURER'
            ) {

                const assignments =
                    await pool.query(
                        `
                        SELECT *
                        FROM assignments
                        ORDER BY due_date ASC
                        `
                    );


                return res.json(
                    assignments.rows
                );

            }


            const userResult =
                await pool.query(
                    `
                    SELECT
                        degree,
                        batch
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        userId
                    ]
                );


            if (
                userResult.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User profile not found'
                    });

            }


            const {
                degree,
                batch
            } =
                userResult.rows[0];


            const assignments =
                await pool.query(
                    `
                    SELECT
                        a.*,

                        EXISTS (
                            SELECT 1
                            FROM submissions s
                            WHERE
                                s.assignment_id = a.id
                                AND s.student_id = $3
                        )
                        AS is_submitted,

                        EXISTS (
                            SELECT 1
                            FROM submissions s
                            WHERE
                                s.assignment_id = a.id
                                AND s.student_id = $3
                                AND s.grade IS NOT NULL
                        )
                        AS is_graded

                    FROM assignments a

                    WHERE
                        a.degree = $1
                        AND a.batch = $2

                    ORDER BY
                        a.due_date ASC
                    `,
                    [
                        degree,
                        batch,
                        userId
                    ]
                );


            res.json(
                assignments.rows
            );


        } catch (err) {

            console.error(
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   SUBMISSIONS
========================================= */

app.post(
    '/submissions',
    authenticateToken,
    upload.single('file'),
    async (req, res) => {

        try {

            const {
                assignmentId
            } = req.body;


            const file =
                req.file;


            const studentId =
                req.user.user_id;


            if (!file) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Please attach a file to submit.'
                    });

            }


            const existing =
                await pool.query(
                    `
                    SELECT *
                    FROM submissions
                    WHERE
                        assignment_id = $1
                        AND student_id = $2
                    `,
                    [
                        assignmentId,
                        studentId
                    ]
                );


            if (
                existing.rows.length > 0
            ) {

                if (
                    existing.rows[0].grade
                ) {

                    return res
                        .status(403)
                        .json({
                            error:
                                'You cannot resubmit work that has already been graded.'
                        });

                }


                const updatedSubmission =
                    await pool.query(
                        `
                        UPDATE submissions

                        SET
                            file_path = $1,
                            submitted_at =
                                CURRENT_TIMESTAMP

                        WHERE id = $2

                        RETURNING *
                        `,
                        [
                            file.path,
                            existing.rows[0].id
                        ]
                    );


                return res
                    .status(200)
                    .json({
                        message:
                            'Assignment successfully updated and resubmitted! 🔄',

                        submission:
                            updatedSubmission
                                .rows[0]
                    });

            }


            const newSubmission =
                await pool.query(
                    `
                    INSERT INTO submissions
                    (
                        assignment_id,
                        student_id,
                        file_path
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3
                    )
                    RETURNING *
                    `,
                    [
                        assignmentId,
                        studentId,
                        file.path
                    ]
                );


            return res
                .status(201)
                .json({
                    message:
                        'Assignment submitted successfully! 🎉',

                    submission:
                        newSubmission.rows[0]
                });


        } catch (error) {

            console.error(
                'Submission Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error during submission'
                });

        }

    }
);


app.get(
    '/submissions',
    authenticateToken,
    authorizeRoles(
        'LECTURER',
        'ADMIN'
    ),
    async (req, res) => {

        try {

            const submissions =
                await pool.query(
                    `
                    SELECT
                        s.id
                            AS submission_id,

                        s.file_path,

                        s.submitted_at,

                        s.grade,

                        s.feedback,

                        a.title
                            AS assignment_title,

                        u.name
                            AS student_name,

                        u.degree,

                        u.batch

                    FROM submissions s

                    JOIN assignments a
                        ON s.assignment_id =
                           a.id

                    JOIN users u
                        ON s.student_id =
                           u.id

                    ORDER BY
                        s.submitted_at DESC
                    `
                );


            res.json(
                submissions.rows
            );


        } catch (err) {

            console.error(
                'Fetch Submissions Error:',
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


app.put(
    '/submissions/:id/grade',
    authenticateToken,
    authorizeRoles(
        'LECTURER',
        'ADMIN'
    ),
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                grade,
                feedback
            } = req.body;


            const updatedSubmission =
                await pool.query(
                    `
                    UPDATE submissions

                    SET
                        grade = $1,
                        feedback = $2

                    WHERE id = $3

                    RETURNING *
                    `,
                    [
                        grade,
                        feedback,
                        id
                    ]
                );


            if (
                updatedSubmission
                    .rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'Submission not found'
                    });

            }


            res.json({
                message:
                    'Grade and feedback saved successfully!',

                submission:
                    updatedSubmission
                        .rows[0]
            });


        } catch (err) {

            console.error(
                'Grading Error:',
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   STUDENT GRADES
========================================= */

app.get(
    '/my-grades',
    authenticateToken,
    async (req, res) => {

        try {

            const studentId =
                req.user.user_id;


            const grades =
                await pool.query(
                    `
                    SELECT
                        s.id
                            AS submission_id,

                        s.submitted_at,

                        s.grade,

                        s.feedback,

                        a.title
                            AS assignment_title

                    FROM submissions s

                    JOIN assignments a
                        ON s.assignment_id =
                           a.id

                    WHERE
                        s.student_id = $1
                        AND s.grade IS NOT NULL

                    ORDER BY
                        s.submitted_at DESC
                    `,
                    [
                        studentId
                    ]
                );


            res.json(
                grades.rows
            );


        } catch (err) {

            console.error(
                'Fetch Grades Error:',
                err.message
            );


            res
                .status(500)
                .send(
                    'Server Error'
                );

        }

    }
);


/* =========================================
   AI TUTOR
========================================= */

app.post(
    '/tutor',
    authenticateToken,
    async (req, res) => {

        try {

            const {
                question,
                context
            } = req.body;


            const genAI =
                new GoogleGenerativeAI(
                    process.env
                        .GEMINI_API_KEY
                );


            const model =
                genAI.getGenerativeModel({
                    model:
                        'gemini-3.6-flash'
                });


            const systemPrompt =
                `
                You are an expert, encouraging AI Study Tutor.

                Your goal is to help a student
                understand academic concepts
                simply and clearly.

                Break down complex topics into
                beginner-friendly explanations.

                Context provided from the lesson:
                "${context ||
                    'No specific lesson context provided.'}"

                Here is the student's question:
                "${question}"
                `;


            const result =
                await model
                    .generateContent(
                        systemPrompt
                    );


            const responseText =
                result.response.text();


            res.json({
                answer:
                    responseText
            });


        } catch (err) {

            console.error(
                'AI API ERROR:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'AI failed to respond.'
                });

        }

    }
);


/* =========================================
   ADMIN ROUTES
========================================= */


/* =========================================
   GET ALL USERS
========================================= */

app.get(
    '/admin/users',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const users =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        role,
                        degree,
                        batch,
                        last_login,
                        is_active

                    FROM users

                    ORDER BY id ASC
                    `
                );


            res.json(
                users.rows
            );


        } catch (err) {

            console.error(
                'Fetch Admin Users Error:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);


/* =========================================
   CREATE USER BY ADMIN
========================================= */

app.post(
    '/admin/users',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                role,
                degree,
                batch
            } = req.body;


            /* ------------------------------
               REQUIRED FIELDS
            ------------------------------ */

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Name, email, password and role are required.'
                    });

            }


            /* ------------------------------
               VALID ROLE
            ------------------------------ */

            const allowedRoles = [
                'STUDENT',
                'LECTURER',
                'ADMIN'
            ];


            if (
                !allowedRoles.includes(
                    role
                )
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Invalid user role.'
                    });

            }


            /* ------------------------------
               PASSWORD LENGTH
            ------------------------------ */

            if (
                password.length < 6
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Password must contain at least 6 characters.'
                    });

            }


            /* ------------------------------
               NORMALIZE EMAIL
            ------------------------------ */

            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();


            /* ------------------------------
               CHECK EXISTING EMAIL
            ------------------------------ */

            const existingUser =
                await pool.query(
                    `
                    SELECT id
                    FROM users
                    WHERE LOWER(email) =
                          LOWER($1)
                    `,
                    [
                        cleanEmail
                    ]
                );


            if (
                existingUser.rows.length >
                0
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'A user with this email already exists.'
                    });

            }


            /* ------------------------------
               HASH PASSWORD
            ------------------------------ */

            const salt =
                await bcrypt.genSalt(10);


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    salt
                );


            /* ------------------------------
               INSERT USER
            ------------------------------ */

            const newUser =
                await pool.query(
                    `
                    INSERT INTO users
                    (
                        name,
                        email,
                        password_hash,
                        role,
                        degree,
                        batch
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )

                    RETURNING
                        id,
                        name,
                        email,
                        role,
                        degree,
                        batch,
                        last_login,
                        is_active
                    `,
                    [
                        name.trim(),
                        cleanEmail,
                        hashedPassword,
                        role,
                        degree || null,
                        batch || null
                    ]
                );


            res
                .status(201)
                .json({
                    message:
                        'User created successfully!',

                    user:
                        newUser.rows[0]
                });


        } catch (err) {

            console.error(
                'Create Admin User Error:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);


/* =========================================
   UPDATE USER ROLE
========================================= */

/* =========================================
   UPDATE USER BY ADMIN
========================================= */

app.put(
    '/admin/users/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                name,
                email,
                role,
                degree,
                batch
            } = req.body;


            /* ------------------------------
               REQUIRED FIELDS
            ------------------------------ */

            if (
                !name ||
                !email ||
                !role
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Name, email and role are required.'
                    });

            }


            /* ------------------------------
               VALID ROLE
            ------------------------------ */

            const allowedRoles = [
                'STUDENT',
                'LECTURER',
                'ADMIN'
            ];


            if (
                !allowedRoles.includes(
                    role
                )
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Invalid user role.'
                    });

            }


            /* ------------------------------
               STUDENT VALIDATION
            ------------------------------ */

            if (
                role === 'STUDENT' &&
                (
                    !degree ||
                    !batch
                )
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Degree and batch are required for students.'
                    });

            }


            /* ------------------------------
               NORMALIZE EMAIL
            ------------------------------ */

            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();


            /* ------------------------------
               CHECK DUPLICATE EMAIL
            ------------------------------ */

            const existingEmail =
                await pool.query(
                    `
                    SELECT id
                    FROM users

                    WHERE LOWER(email) =
                          LOWER($1)

                    AND id <> $2
                    `,
                    [
                        cleanEmail,
                        id
                    ]
                );


            if (
                existingEmail.rows.length > 0
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Another user already uses this email.'
                    });

            }


            /* ------------------------------
               UPDATE USER
            ------------------------------ */

            const updatedUser =
                await pool.query(
                    `
                    UPDATE users

                    SET
                        name = $1,
                        email = $2,
                        role = $3,
                        degree = $4,
                        batch = $5

                    WHERE id = $6

                    RETURNING
                        id,
                        name,
                        email,
                        role,
                        degree,
                        batch,
                        last_login,
                        is_active
                    `,
                    [
                        name.trim(),
                        cleanEmail,
                        role,
                        degree || null,
                        batch || null,
                        id
                    ]
                );


            /* ------------------------------
               USER NOT FOUND
            ------------------------------ */

            if (
                updatedUser.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User not found.'
                    });

            }


            /* ------------------------------
               SUCCESS
            ------------------------------ */

            res.json({
                message:
                    'User updated successfully!',

                user:
                    updatedUser.rows[0]
            });


        } catch (err) {

            console.error(
                'Update Admin User Error:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);




/* =========================================
   ENABLE / DISABLE USER BY ADMIN
========================================= */

app.put(
    '/admin/users/:id/status',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                is_active
            } = req.body;


            /* ------------------------------
               VALIDATE STATUS VALUE
            ------------------------------ */

            if (
                typeof is_active !==
                'boolean'
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'is_active must be true or false.'
                    });

            }


            /* ------------------------------
               PREVENT SELF-DISABLE
            ------------------------------ */

            if (
                Number(id) ===
                    Number(
                        req.user.user_id
                    ) &&
                is_active === false
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'You cannot disable your own administrator account.'
                    });

            }


            /* ------------------------------
               UPDATE USER STATUS
            ------------------------------ */

            const updatedUser =
                await pool.query(
                    `
                    UPDATE users

                    SET is_active = $1

                    WHERE id = $2

                    RETURNING
                        id,
                        name,
                        email,
                        role,
                        degree,
                        batch,
                        last_login,
                        is_active
                    `,
                    [
                        is_active,
                        id
                    ]
                );


            /* ------------------------------
               USER NOT FOUND
            ------------------------------ */

            if (
                updatedUser.rows.length ===
                0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User not found.'
                    });

            }


            /* ------------------------------
               SUCCESS
            ------------------------------ */

            res.json({
                message:
                    is_active
                        ? 'User enabled successfully!'
                        : 'User disabled successfully!',

                user:
                    updatedUser.rows[0]
            });


        } catch (err) {

            console.error(
                'Update User Status Error:',
                err.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);

/* =========================================
   DELETE USER BY ADMIN
========================================= */

app.delete(
    '/admin/users/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            /* =================================
               PREVENT ADMIN DELETING THEMSELVES
            ================================= */

            if (
                Number(id) ===
                Number(req.user.user_id)
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'You cannot delete your own administrator account.'
                    });

            }


            /* =================================
               CHECK USER EXISTS
            ================================= */

            const existingUser =
                await pool.query(
                    `
                    SELECT
                        id,
                        name,
                        email,
                        role
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        id
                    ]
                );


            if (
                existingUser.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'User not found.'
                    });

            }


            /* =================================
               DELETE USER
            ================================= */

            const deletedUser =
                await pool.query(
                    `
                    DELETE FROM users
                    WHERE id = $1

                    RETURNING
                        id,
                        name,
                        email,
                        role
                    `,
                    [
                        id
                    ]
                );


            res.json({
                message:
                    'User deleted successfully!',

                user:
                    deletedUser.rows[0]
            });


        } catch (err) {

            console.error(
                'Delete User Error:',
                err.message
            );


            /*
              PostgreSQL foreign-key error.

              This can happen if the user owns
              submissions, courses, assignments,
              notes, etc.
            */

            if (
                err.code === '23503'
            ) {

                return res
                    .status(409)
                    .json({
                        error:
                            'This user cannot be deleted because related records still exist.'
                    });

            }


            res
                .status(500)
                .json({
                    error:
                        'Server Error'
                });

        }

    }
);


/* =========================================
   SERVER START
========================================= */

const PORT =
    process.env.PORT ||
    5000;


app.listen(
    PORT,
    () => {

        console.log(
            `🚀 Server is running on http://localhost:${PORT}`
        );

    }
);