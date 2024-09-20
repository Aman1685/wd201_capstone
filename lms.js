const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const User = require('./models/user');
const Course = require('./models/course');
const Chapter = require('./models/chapter');
const Page = require('./models/pages');
const Enrollment = require('./models/enrollments');
const CompletedPages = require('./models/completed_pages');

// Initialize express and setup middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

// Initialize Sequelize (replace with your database credentials)
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'postgres',
    host: 'localhost'
});

// Sync database and start server
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((error) => {
    console.error('Unable to sync database:', error);
});

// Routes

// Home route (show courses list)
app.get('/', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('index', { courses });
    } catch (error) {
        res.render('error', { error });
    }
});

// Display form to create a new course (Educator only)
app.get('/course/create', (req, res) => {
    res.render('createCourse');
});

// Handle course creation
app.post('/course/create', async (req, res) => {
    try {
        const { name, description } = req.body;
        const educator_id = req.session.user_id;  // Assume educator is logged in
        await Course.create({ name, description, educator_id });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});

// Add a chapter to a course
app.get('/course/:course_id/addChapter', (req, res) => {
    const { course_id } = req.params;
    res.render('addChapter', { course_id });
});

app.post('/course/:course_id/addChapter', async (req, res) => {
    try {
        const { title, order } = req.body;
        const { course_id } = req.params;
        await Chapter.create({ course_id, title, order });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});

// Add a page to a chapter
app.get('/chapter/:chapter_id/addPage', (req, res) => {
    const { chapter_id } = req.params;
    res.render('addPage', { chapter_id });
});

app.post('/chapter/:chapter_id/addPage', async (req, res) => {
    try {
        const { title, content, order } = req.body;
        const { chapter_id } = req.params;
        await Page.create({ chapter_id, title, content, order });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});

// Enroll in a course
app.post('/course/:course_id/enroll', async (req, res) => {
    try {
        const { course_id } = req.params;
        const student_id = req.session.user_id;  // Assume student is logged in
        await Enrollment.create({ student_id, course_id });
        res.redirect(`/course/${course_id}`);
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: { message: 'Something went wrong!' } });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = ("/lms.js");