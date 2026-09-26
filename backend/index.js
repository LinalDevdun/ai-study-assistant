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

/* =========================================
   AUTHENTICATE TOKEN
   + MAINTENANCE MODE CHECK
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
        async (err, user) => {

            if (err) {

                return res
                    .status(403)
                    .json({
                        error:
                            'Invalid or expired token.'
                    });

            }


            try {

                /* =================================
                   MAINTENANCE MODE

                   ADMIN is always allowed.
                ================================= */

                if (
                    user.role !==
                    'ADMIN'
                ) {

                    const settings =
                        await pool.query(
                            `
                            SELECT
                                maintenance_mode
                            FROM system_settings
                            ORDER BY id ASC
                            LIMIT 1
                            `
                        );


                    const maintenanceMode =
                        settings.rows.length >
                            0 &&
                        settings.rows[0]
                            .maintenance_mode ===
                            true;


                    if (
                        maintenanceMode
                    ) {

                        return res
                            .status(503)
                            .json({
                                error:
                                    'CampusLearn is currently under maintenance. Please try again later.',

                                maintenanceMode:
                                    true
                            });

                    }

                }


                req.user =
                    user;


                next();


            } catch (error) {

                console.error(
                    'Maintenance Check Error:',
                    error.message
                );


                return res
                    .status(500)
                    .json({
                        error:
                            'Server error while checking system availability.'
                    });

            }

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

            if (!validPassword) {

    return res
        .status(401)
        .json({
            error:
                'Invalid email or password'
        });

}


/* =========================================
   MAINTENANCE MODE LOGIN CHECK
========================================= */

if (
    user.rows[0].role !==
    'ADMIN'
) {

    const settings =
        await pool.query(
            `
            SELECT
                maintenance_mode
            FROM system_settings
            ORDER BY id ASC
            LIMIT 1
            `
        );


    const maintenanceMode =
        settings.rows.length >
            0 &&
        settings.rows[0]
            .maintenance_mode ===
            true;


    if (
        maintenanceMode
    ) {

        return res
            .status(503)
            .json({
                error:
                    'CampusLearn is currently under maintenance. Please try again later.',

                maintenanceMode:
                    true
            });

    }

}


/* =========================================
   UPDATE LAST LOGIN
========================================= */

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
                batch,
                lecturerId
            } = req.body;


            /* =====================================
               VALIDATION
            ===================================== */

            if (
                !courseTitle ||
                !courseTitle.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Course title is required.'
                    });

            }


            if (
                !degree ||
                !degree.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Degree / program is required.'
                    });

            }


            if (
                !batch ||
                !batch.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Batch is required.'
                    });

            }


            /* =====================================
               OPTIONAL COURSE FILE
            ===================================== */

            const filePath =
                req.file
                    ? req.file.path
                    : null;


            /* =====================================
               DETERMINE LECTURER
            ===================================== */

            let finalLecturerId =
                null;


            /*
              Lecturer creates course:
              automatically assign themselves.
            */

            if (
                req.user.role ===
                'LECTURER'
            ) {

                finalLecturerId =
                    Number(
                        req.user.user_id
                    );

            }


            /*
              Admin creates course:
              use lecturer selected in frontend.
            */

            if (
                req.user.role ===
                'ADMIN'
            ) {

                finalLecturerId =
                    lecturerId
                        ? Number(
                            lecturerId
                          )
                        : null;

            }


            /* =====================================
               VALIDATE SELECTED LECTURER
            ===================================== */

            if (finalLecturerId) {

                if (
                    !Number.isInteger(
                        finalLecturerId
                    )
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Invalid lecturer ID.'
                        });

                }


                const lecturerCheck =
                    await pool.query(
                        `
                        SELECT
                            id,
                            name,
                            email,
                            role,
                            is_active
                        FROM users
                        WHERE id = $1
                        `,
                        [
                            finalLecturerId
                        ]
                    );


                if (
                    lecturerCheck
                        .rows.length ===
                    0
                ) {

                    return res
                        .status(404)
                        .json({
                            error:
                                'Selected lecturer was not found.'
                        });

                }


                if (
                    lecturerCheck
                        .rows[0]
                        .role !==
                    'LECTURER'
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Selected user is not a lecturer.'
                        });

                }


                if (
                    lecturerCheck
                        .rows[0]
                        .is_active ===
                    false
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Selected lecturer account is disabled.'
                        });

                }

            }


            /* =====================================
               CREATE COURSE
            ===================================== */

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
                        courseTitle.trim(),
                        degree.trim(),
                        batch.trim(),
                        filePath,
                        finalLecturerId
                    ]
                );


            res
                .status(201)
                .json({
                    message:
                        'Course created successfully!',

                    course:
                        newCourse.rows[0]
                });


        } catch (error) {

            console.error(
                'Create Course Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while creating course.'
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
   UPDATE COURSE BY ADMIN
========================================= */

app.put(
    '/admin/courses/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    upload.single('file'),
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                courseTitle,
                degree,
                batch,
                lecturerId
            } = req.body;


            /* ==============================
               CHECK COURSE EXISTS
            ============================== */

            const existingCourse =
                await pool.query(
                    `
                    SELECT *
                    FROM courses
                    WHERE id = $1
                    `,
                    [
                        id
                    ]
                );


            if (
                existingCourse.rows.length ===
                0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'Course not found.'
                    });

            }


            /* ==============================
               VALIDATION
            ============================== */

            if (
                !courseTitle ||
                !courseTitle.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Course title is required.'
                    });

            }


            if (
                !degree ||
                !degree.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Program is required.'
                    });

            }


            if (
                !batch ||
                !batch.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Batch is required.'
                    });

            }


            /* ==============================
               LECTURER
            ============================== */

            let finalLecturerId =
                lecturerId
                    ? Number(
                        lecturerId
                      )
                    : null;


            if (finalLecturerId) {

                const lecturerCheck =
                    await pool.query(
                        `
                        SELECT
                            id,
                            role,
                            is_active
                        FROM users
                        WHERE id = $1
                        `,
                        [
                            finalLecturerId
                        ]
                    );


                if (
                    lecturerCheck.rows.length ===
                    0
                ) {

                    return res
                        .status(404)
                        .json({
                            error:
                                'Selected lecturer was not found.'
                        });

                }


                if (
                    lecturerCheck.rows[0].role !==
                    'LECTURER'
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Selected user is not a lecturer.'
                        });

                }


                if (
                    lecturerCheck.rows[0]
                        .is_active ===
                    false
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Selected lecturer is disabled.'
                        });

                }

            }


            /* ==============================
               FILE

               If admin uploads a new file,
               replace old file path.

               Otherwise keep old file.
            ============================== */

            let finalFilePath =
                existingCourse
                    .rows[0]
                    .file_path;


            if (req.file) {

                finalFilePath =
                    req.file.path;

            }


            /* ==============================
               UPDATE COURSE
            ============================== */

            const updatedCourse =
                await pool.query(
                    `
                    UPDATE courses

                    SET
                        title = $1,
                        degree = $2,
                        batch = $3,
                        lecturer_id = $4,
                        file_path = $5

                    WHERE id = $6

                    RETURNING *
                    `,
                    [
                        courseTitle.trim(),
                        degree.trim(),
                        batch.trim(),
                        finalLecturerId,
                        finalFilePath,
                        id
                    ]
                );


            res.json({
                message:
                    'Course updated successfully!',

                course:
                    updatedCourse.rows[0]
            });


        } catch (error) {

            console.error(
                'Update Course Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while updating course.'
                });

        }

    }
);

/* =========================================
   DELETE COURSE BY ADMIN
========================================= */

/* =========================================
   DELETE COURSE BY ADMIN
========================================= */

app.delete(
    '/admin/courses/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        const client =
            await pool.connect();

        try {

            const {
                id
            } = req.params;


            /* ==============================
               START TRANSACTION
            ============================== */

            await client.query(
                'BEGIN'
            );


            /* ==============================
               CHECK COURSE EXISTS
            ============================== */

            const existingCourse =
                await client.query(
                    `
                    SELECT *
                    FROM courses
                    WHERE id = $1
                    `,
                    [
                        id
                    ]
                );


            if (
                existingCourse.rows.length ===
                0
            ) {

                await client.query(
                    'ROLLBACK'
                );


                return res
                    .status(404)
                    .json({
                        error:
                            'Course not found.'
                    });

            }


            const course =
                existingCourse.rows[0];


            /* ==============================
               DELETE COURSE LESSONS
            ============================== */

            await client.query(
                `
                DELETE FROM lessons
                WHERE course_id = $1
                `,
                [
                    id
                ]
            );


            /* ==============================
               DELETE COURSE
            ============================== */

            const deletedCourse =
                await client.query(
                    `
                    DELETE FROM courses
                    WHERE id = $1

                    RETURNING *
                    `,
                    [
                        id
                    ]
                );


            /* ==============================
               COMMIT
            ============================== */

            await client.query(
                'COMMIT'
            );


            /* ==============================
               DELETE MAIN COURSE FILE

               Do this AFTER database delete.
               A file problem should not stop
               PostgreSQL from deleting course.
            ============================== */

            if (
                course.file_path &&
                fs.existsSync(
                    course.file_path
                )
            ) {

                try {

                    fs.unlinkSync(
                        course.file_path
                    );

                } catch (fileError) {

                    console.error(
                        'Course file cleanup warning:',
                        fileError.message
                    );

                }

            }


            /* ==============================
               SUCCESS
            ============================== */

            res.json({

                message:
                    'Course deleted successfully!',

                course:
                    deletedCourse.rows[0]

            });


        } catch (error) {

            try {

                await client.query(
                    'ROLLBACK'
                );

            } catch (
                rollbackError
            ) {

                console.error(
                    'Rollback Error:',
                    rollbackError.message
                );

            }


            console.error(
                'Delete Course Error:',
                error.message
            );

            console.error(
                'PostgreSQL Error Code:',
                error.code
            );


            if (
                error.code ===
                '23503'
            ) {

                return res
                    .status(409)
                    .json({
                        error:
                            'This course has related records and cannot be deleted yet.'
                    });

            }


            res
                .status(500)
                .json({
                    error:
                        'Server error while deleting course.'
                });


        } finally {

            client.release();

        }

    }
);

/* =========================================
   ADMIN COURSE SUMMARY
========================================= */

app.get(
    '/admin/courses/summary',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const courses =
                await pool.query(
                    `
                    SELECT
                        c.id,
                        c.title,
                        c.degree,
                        c.batch,
                        c.file_path,
                        c.lecturer_id,


                        /* =====================
                           LECTURER NAME
                        ===================== */

                        COALESCE(
                            lecturer.name,
                            'Not assigned'
                        )
                        AS lecturer_name,


                        /* =====================
                           MATCHING STUDENTS
                        ===================== */

                        (
                            SELECT COUNT(*)

                            FROM users student

                            WHERE
                                student.role = 'STUDENT'

                                AND student.degree =
                                    c.degree

                                AND student.batch =
                                    c.batch
                        )::int
                        AS student_count,


                        /* =====================
                           LESSONS
                        ===================== */

                        (
                            SELECT COUNT(*)

                            FROM lessons l

                            WHERE
                                l.course_id =
                                    c.id
                        )::int
                        AS lesson_count,


                        /* =====================
                           TOTAL MATERIALS

                           Course file = 1
                           Each lesson = 1
                        ===================== */

                        (
                            (
                                CASE

                                    WHEN
                                        c.file_path
                                        IS NOT NULL

                                        AND
                                        c.file_path <> ''

                                    THEN 1

                                    ELSE 0

                                END
                            )

                            +

                            (
                                SELECT COUNT(*)

                                FROM lessons l

                                WHERE
                                    l.course_id =
                                        c.id
                            )
                        )::int
                        AS material_count


                    FROM courses c


                    LEFT JOIN users lecturer

                        ON lecturer.id =
                           c.lecturer_id


                    ORDER BY
                        c.id ASC
                    `
                );


            res.json(
                courses.rows
            );


        } catch (err) {

            console.error(
                'Admin Course Summary Error:',
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
   ADMIN STUDENT ACADEMIC SUMMARY
========================================= */

app.get(
    '/admin/students/academic-summary',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const students =
                await pool.query(
                    `
                    WITH student_stats AS (

                        SELECT
                            u.id,
                            u.name,
                            u.email,
                            u.degree,
                            u.batch,
                            u.last_login,
                            u.is_active,


                            /* -------------------------
                               MATCHING COURSES
                            ------------------------- */

                            (
                                SELECT COUNT(*)

                                FROM courses c

                                WHERE
                                    c.degree = u.degree
                                    AND c.batch = u.batch
                            )::int
                            AS courses,


                            /* -------------------------
                               TOTAL ASSIGNMENTS
                            ------------------------- */

                            (
                                SELECT COUNT(*)

                                FROM assignments a

                                WHERE
                                    a.degree = u.degree
                                    AND a.batch = u.batch
                            )::int
                            AS total_assignments,


                            /* -------------------------
                               SUBMITTED ASSIGNMENTS
                            ------------------------- */

                            (
                                SELECT
                                    COUNT(
                                        DISTINCT s.assignment_id
                                    )

                                FROM submissions s

                                JOIN assignments a
                                    ON a.id =
                                       s.assignment_id

                                WHERE
                                    s.student_id = u.id

                                    AND a.degree =
                                        u.degree

                                    AND a.batch =
                                        u.batch
                            )::int
                            AS submitted_assignments,


                            /* -------------------------
                               GRADED ASSIGNMENTS
                            ------------------------- */

                            (
                                SELECT COUNT(*)

                                FROM submissions s

                                JOIN assignments a
                                    ON a.id =
                                       s.assignment_id

                                WHERE
                                    s.student_id = u.id

                                    AND s.grade
                                        IS NOT NULL

                                    AND a.degree =
                                        u.degree

                                    AND a.batch =
                                        u.batch
                            )::int
                            AS graded_assignments,


                            /* -------------------------
                               AVERAGE SCORE
                            ------------------------- */

                            COALESCE(

                                (
                                    SELECT
                                        ROUND(
                                            AVG(

                                                CASE

                                                    WHEN
                                                        s.grade::text
                                                        ~
                                                        '^[0-9]+([.][0-9]+)?$'

                                                    THEN
                                                        s.grade::text::numeric

                                                    ELSE NULL

                                                END

                                            ),
                                            2
                                        )

                                    FROM submissions s

                                    JOIN assignments a
                                        ON a.id =
                                           s.assignment_id

                                    WHERE
                                        s.student_id =
                                            u.id

                                        AND s.grade
                                            IS NOT NULL

                                        AND a.degree =
                                            u.degree

                                        AND a.batch =
                                            u.batch
                                ),

                                0

                            )::float
                            AS average_score


                        FROM users u

                        WHERE
                            u.role = 'STUDENT'
                    )


                    SELECT
                        *,

                        CASE

                            WHEN
                                total_assignments = 0

                            THEN 0

                            ELSE

                                ROUND(
                                    (
                                        submitted_assignments::numeric
                                        /
                                        total_assignments
                                    ) * 100
                                )::int

                        END
                        AS progress

                    FROM student_stats

                    ORDER BY id ASC
                    `
                );


            res.json(
                students.rows
            );


        } catch (err) {

            console.error(
                'Admin Student Academic Summary Error:',
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
   ADMIN REPORTS & ANALYTICS
========================================= */

app.get(
    '/admin/reports/overview',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            /* =====================================
               RUN REPORT QUERIES
            ===================================== */

            const [
                userStatsResult,
                courseStatsResult,
                averageScoreResult,
                assignmentCompletionResult,
                fullCompletionResult,
                courseEnrollmentResult,
                recentActivityResult
            ] = await Promise.all([


                /* =================================
                   USER COUNTS
                ================================= */

                pool.query(
                    `
                    SELECT

                        COUNT(*)::int
                            AS total_users,

                        COUNT(*) FILTER (
                            WHERE role = 'STUDENT'
                        )::int
                            AS students,

                        COUNT(*) FILTER (
                            WHERE role = 'LECTURER'
                        )::int
                            AS lecturers,

                        COUNT(*) FILTER (
                            WHERE role = 'ADMIN'
                        )::int
                            AS administrators,

                        COUNT(*) FILTER (
                            WHERE COALESCE(
                                is_active,
                                TRUE
                            ) = TRUE
                        )::int
                            AS active_accounts

                    FROM users
                    `
                ),


                /* =================================
                   COURSE COUNT
                ================================= */

                pool.query(
                    `
                    SELECT
                        COUNT(*)::int
                            AS active_courses
                    FROM courses
                    `
                ),


                /* =================================
                   AVERAGE STUDENT SCORE
                ================================= */

                pool.query(
                    `
                    SELECT

                        COALESCE(
                            ROUND(
                                AVG(
                                    CASE

                                        WHEN
                                            grade::text
                                            ~
                                            '^[0-9]+([.][0-9]+)?$'

                                        THEN
                                            grade::text::numeric

                                        ELSE
                                            NULL

                                    END
                                ),
                                2
                            ),
                            0
                        )::float
                            AS average_score

                    FROM submissions

                    WHERE
                        grade IS NOT NULL
                    `
                ),


                /* =================================
                   ASSIGNMENT COMPLETION

                   Expected:
                   Every active student matched
                   to every assignment for their
                   degree + batch.

                   Actual:
                   Their submitted assignments.
                ================================= */

                pool.query(
                    `
                    WITH expected AS (

                        SELECT
                            COUNT(*)::numeric
                                AS total_expected

                        FROM assignments a

                        JOIN users u
                            ON u.role =
                               'STUDENT'

                            AND u.degree =
                                a.degree

                            AND u.batch =
                                a.batch

                            AND COALESCE(
                                u.is_active,
                                TRUE
                            ) = TRUE

                    ),

                    actual AS (

                        SELECT

                            COUNT(
                                DISTINCT (
                                    s.assignment_id,
                                    s.student_id
                                )
                            )::numeric
                                AS total_submitted

                        FROM submissions s

                        JOIN assignments a
                            ON a.id =
                               s.assignment_id

                        JOIN users u
                            ON u.id =
                               s.student_id

                        WHERE
                            u.role =
                                'STUDENT'

                            AND u.degree =
                                a.degree

                            AND u.batch =
                                a.batch

                            AND COALESCE(
                                u.is_active,
                                TRUE
                            ) = TRUE

                    )

                    SELECT

                        CASE

                            WHEN
                                expected.total_expected =
                                0

                            THEN 0

                            ELSE

                                ROUND(
                                    (
                                        actual.total_submitted
                                        /
                                        expected.total_expected
                                    ) * 100
                                )::int

                        END
                            AS assignment_completion

                    FROM expected,
                         actual
                    `
                ),


                /* =================================
                   FULL ASSIGNMENT COMPLETION

                   Percentage of active students
                   who submitted every assignment
                   assigned to their degree/batch.
                ================================= */

                pool.query(
                    `
                    WITH student_stats AS (

                        SELECT

                            u.id,

                            (
                                SELECT
                                    COUNT(*)

                                FROM assignments a

                                WHERE
                                    a.degree =
                                        u.degree

                                    AND a.batch =
                                        u.batch
                            )::int
                                AS total_assignments,


                            (
                                SELECT
                                    COUNT(
                                        DISTINCT
                                        s.assignment_id
                                    )

                                FROM submissions s

                                JOIN assignments a
                                    ON a.id =
                                       s.assignment_id

                                WHERE
                                    s.student_id =
                                        u.id

                                    AND a.degree =
                                        u.degree

                                    AND a.batch =
                                        u.batch
                            )::int
                                AS submitted_assignments


                        FROM users u

                        WHERE
                            u.role =
                                'STUDENT'

                            AND COALESCE(
                                u.is_active,
                                TRUE
                            ) = TRUE

                    )


                    SELECT

                        CASE

                            WHEN
                                COUNT(*) FILTER (
                                    WHERE
                                        total_assignments >
                                        0
                                ) = 0

                            THEN 0

                            ELSE

                                ROUND(

                                    (
                                        COUNT(*) FILTER (
                                            WHERE
                                                total_assignments >
                                                0

                                                AND

                                                submitted_assignments >=
                                                total_assignments
                                        )::numeric

                                        /

                                        COUNT(*) FILTER (
                                            WHERE
                                                total_assignments >
                                                0
                                        )
                                    )

                                    * 100

                                )::int

                        END
                            AS full_completion

                    FROM student_stats
                    `
                ),


                /* =================================
                   COURSE ENROLLMENT

                   Student matching is based on
                   course degree + batch, matching
                   your existing application logic.
                ================================= */

                pool.query(
                    `
                    WITH course_counts AS (

                        SELECT

                            c.id,

                            c.title,

                            c.degree,

                            c.batch,

                            COUNT(
                                u.id
                            )::int
                                AS students


                        FROM courses c


                        LEFT JOIN users u

                            ON u.role =
                               'STUDENT'

                            AND u.degree =
                                c.degree

                            AND u.batch =
                                c.batch

                            AND COALESCE(
                                u.is_active,
                                TRUE
                            ) = TRUE


                        GROUP BY

                            c.id,
                            c.title,
                            c.degree,
                            c.batch

                    ),


                    maximum AS (

                        SELECT

                            GREATEST(
                                MAX(students),
                                1
                            )::numeric
                                AS max_students

                        FROM course_counts

                    )


                    SELECT

                        cc.id,

                        cc.title
                            AS name,

                        cc.degree,

                        cc.batch,

                        cc.students,

                        ROUND(
                            (
                                cc.students::numeric
                                /
                                maximum.max_students
                            ) * 100
                        )::int
                            AS percentage


                    FROM course_counts cc

                    CROSS JOIN maximum


                    ORDER BY

                        cc.students DESC,

                        cc.id ASC


                    LIMIT 8
                    `
                ),


                /* =================================
                   RECENT REAL ACTIVITY

                   Current database does not have
                   created_at for users/courses.

                   So use timestamps that really
                   exist:
                   - assignment submissions
                   - user logins
                ================================= */

                pool.query(
                    `
                    SELECT *

                    FROM (

                        SELECT

                            'SUBMISSION'
                                AS event_type,

                            'Assignment submitted'
                                AS title,

                            u.name
                            ||
                            ' submitted "'
                            ||
                            a.title
                            ||
                            '".'
                                AS description,

                            s.submitted_at
                                AS event_time


                        FROM submissions s

                        JOIN users u
                            ON u.id =
                               s.student_id

                        JOIN assignments a
                            ON a.id =
                               s.assignment_id


                        WHERE
                            s.submitted_at
                            IS NOT NULL



                        UNION ALL



                        SELECT

                            'LOGIN'
                                AS event_type,

                            'User login'
                                AS title,

                            u.name
                            ||
                            ' logged in to CampusLearn.'
                                AS description,

                            u.last_login
                                AS event_time


                        FROM users u

                        WHERE
                            u.last_login
                            IS NOT NULL

                    )
                    AS activity


                    ORDER BY
                        event_time DESC


                    LIMIT 8
                    `
                )

            ]);


            /* =====================================
               EXTRACT RESULTS
            ===================================== */

            const userStats =
                userStatsResult.rows[0];


            const courseStats =
                courseStatsResult.rows[0];


            const averageScore =
                Number(
                    averageScoreResult
                        .rows[0]
                        .average_score
                ) || 0;


            const assignmentCompletion =
                Number(
                    assignmentCompletionResult
                        .rows[0]
                        .assignment_completion
                ) || 0;


            const fullCompletion =
                Number(
                    fullCompletionResult
                        .rows[0]
                        .full_completion
                ) || 0;


            /* =====================================
               SEND REPORT DATA
            ===================================== */

            res.json({

                summary: {

                    total_users:
                        Number(
                            userStats.total_users
                        ) || 0,

                    students:
                        Number(
                            userStats.students
                        ) || 0,

                    lecturers:
                        Number(
                            userStats.lecturers
                        ) || 0,

                    administrators:
                        Number(
                            userStats.administrators
                        ) || 0,

                    active_accounts:
                        Number(
                            userStats.active_accounts
                        ) || 0,

                    active_courses:
                        Number(
                            courseStats.active_courses
                        ) || 0,

                    average_score:
                        averageScore

                },


                user_distribution: {

                    students:
                        Number(
                            userStats.students
                        ) || 0,

                    lecturers:
                        Number(
                            userStats.lecturers
                        ) || 0,

                    administrators:
                        Number(
                            userStats.administrators
                        ) || 0,

                    active_accounts:
                        Number(
                            userStats.active_accounts
                        ) || 0

                },


                academic_performance: {

                    average_score:
                        averageScore,

                    assignment_completion:
                        assignmentCompletion,

                    full_assignment_completion:
                        fullCompletion

                },


                course_enrollment:

                    courseEnrollmentResult
                        .rows
                        .map(
                            (course) => ({

                                id:
                                    course.id,

                                name:
                                    course.name,

                                degree:
                                    course.degree,

                                batch:
                                    course.batch,

                                students:
                                    Number(
                                        course.students
                                    ) || 0,

                                percentage:
                                    Number(
                                        course.percentage
                                    ) || 0

                            })
                        ),


                recent_activity:

                    recentActivityResult
                        .rows

            });


        } catch (error) {

            console.error(
                'Admin Reports Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while generating reports.'
                });

        }

    }
);

/* =========================================
   ADMIN SYSTEM SETTINGS
========================================= */


/* =========================================
   GET SYSTEM SETTINGS
========================================= */

app.get(
    '/admin/settings',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        id,
                        system_name,
                        contact_email,
                        current_semester,
                        academic_year,
                        email_notifications,
                        assignment_alerts,
                        maintenance_mode,
                        updated_at

                    FROM system_settings

                    ORDER BY id ASC

                    LIMIT 1
                    `
                );


            if (
                result.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'System settings were not found.'
                    });

            }


            res.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                'Get System Settings Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while loading system settings.'
                });

        }

    }
);



/* =========================================
   UPDATE SYSTEM SETTINGS
========================================= */

app.put(
    '/admin/settings',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                systemName,
                contactEmail,
                semester,
                academicYear,
                emailNotifications,
                assignmentAlerts,
                maintenanceMode
            } = req.body;


            /* =====================================
               VALIDATION
            ===================================== */

            if (
                !systemName ||
                !systemName.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'System name is required.'
                    });

            }


            if (
                !contactEmail ||
                !contactEmail.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Contact email is required.'
                    });

            }


            if (
                !semester ||
                !semester.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Current semester is required.'
                    });

            }


            if (
                !academicYear ||
                !String(
                    academicYear
                ).trim()
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Academic year is required.'
                    });

            }


            /* =====================================
               FIND SETTINGS ROW
            ===================================== */

            const existingSettings =
                await pool.query(
                    `
                    SELECT id
                    FROM system_settings
                    ORDER BY id ASC
                    LIMIT 1
                    `
                );


            if (
                existingSettings.rows.length ===
                0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'System settings were not found.'
                    });

            }


            const settingsId =
                existingSettings
                    .rows[0]
                    .id;


            /* =====================================
               UPDATE
            ===================================== */

            const updatedSettings =
                await pool.query(
                    `
                    UPDATE system_settings

                    SET
                        system_name = $1,
                        contact_email = $2,
                        current_semester = $3,
                        academic_year = $4,
                        email_notifications = $5,
                        assignment_alerts = $6,
                        maintenance_mode = $7,
                        updated_at = CURRENT_TIMESTAMP

                    WHERE id = $8

                    RETURNING *
                    `,
                    [
                        systemName.trim(),

                        contactEmail.trim(),

                        semester.trim(),

                        String(
                            academicYear
                        ).trim(),

                        emailNotifications ===
                            true,

                        assignmentAlerts ===
                            true,

                        maintenanceMode ===
                            true,

                        settingsId
                    ]
                );


            res.json({
                message:
                    'System settings updated successfully!',

                settings:
                    updatedSettings.rows[0]
            });


        } catch (error) {

            console.error(
                'Update System Settings Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while updating system settings.'
                });

        }

    }
);

/* =========================================
   ADMIN CHANGE PASSWORD
========================================= */

app.put(
    '/admin/change-password',
    authenticateToken,
    authorizeRoles('ADMIN'),
    async (req, res) => {

        try {

            const {
                currentPassword,
                newPassword
            } = req.body;


            const adminId =
                req.user.user_id;


            /* =====================================
               REQUIRED FIELDS
            ===================================== */

            if (
                !currentPassword ||
                !newPassword
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Current password and new password are required.'
                    });

            }


            /* =====================================
               NEW PASSWORD LENGTH
            ===================================== */

            if (
                newPassword.length < 6
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'New password must contain at least 6 characters.'
                    });

            }


            /* =====================================
               CURRENT AND NEW MUST DIFFER
            ===================================== */

            if (
                currentPassword ===
                newPassword
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            'New password must be different from your current password.'
                    });

            }


            /* =====================================
               GET ADMIN
            ===================================== */

            const admin =
                await pool.query(
                    `
                    SELECT
                        id,
                        password_hash,
                        role
                    FROM users
                    WHERE id = $1
                    `,
                    [
                        adminId
                    ]
                );


            if (
                admin.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            'Administrator account not found.'
                    });

            }


            if (
                admin.rows[0].role !==
                'ADMIN'
            ) {

                return res
                    .status(403)
                    .json({
                        error:
                            'Access denied.'
                    });

            }


            /* =====================================
               CHECK CURRENT PASSWORD
            ===================================== */

            const validPassword =
                await bcrypt.compare(
                    currentPassword,
                    admin.rows[0]
                        .password_hash
                );


            if (!validPassword) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Current password is incorrect.'
                    });

            }


            /* =====================================
               HASH NEW PASSWORD
            ===================================== */

            const salt =
                await bcrypt.genSalt(
                    10
                );


            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    salt
                );


            /* =====================================
               UPDATE PASSWORD
            ===================================== */

            await pool.query(
                `
                UPDATE users

                SET
                    password_hash = $1

                WHERE id = $2
                `,
                [
                    hashedPassword,
                    adminId
                ]
            );


            /* =====================================
               SUCCESS
            ===================================== */

            res.json({
                message:
                    'Password changed successfully!'
            });


        } catch (error) {

            console.error(
                'Admin Change Password Error:',
                error.message
            );


            res
                .status(500)
                .json({
                    error:
                        'Server error while changing password.'
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