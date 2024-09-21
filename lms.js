/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const lms = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require("bcrypt");
const { Chapters, Course, Enrollments, Pages, Progress, Reports, User } = require("./models");
const path = require('path');

lms.use(bodyParser.json());

lms.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

lms.set('view engine', 'ejs');
lms.set('views', path.join(__dirname, 'views'));

lms.use(express.urlencoded({ extended: true }));
lms.use(express.static('public'));

lms.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Home page route
lms.get('/', (req, res) => {
    const title = 'Home';
    const user = req.session.user || null;
    res.render('index', { title, user });
});

// GET route for signup page
lms.get("/signup", (req, res) => {
    res.render("signup");
});

// POST route for handling signup
lms.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send("Email already in use");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        req.session.user = newUser;
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Error creating user");
    }
});

// GET route for login page
lms.get("/login", (req, res) => {
    res.render("login");
});

// POST route for handling login
lms.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Invalid email or password");
        }
        req.session.user = user;
        res.redirect('/courses');
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect("/login");
    }
}

// Educator - Create and manage courses
lms.get("/courses/new", isAuthenticated, (req, res) => {
    res.render("new-course");
});

lms.post("/courses", isAuthenticated, async (req, res) => {
    const { name, description } = req.body;
    try {
        await Course.create({ name, description, educatorId: req.session.user.id });
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).send("Error creating course");
    }
});

// Enroll in course
lms.post("/courses/:id/enroll", isAuthenticated, async (req, res) => {
    try {
        const courseId = req.params.id;
        await Enrollments.create({ courseId, studentId: req.session.user.id });
        res.redirect(`/courses/${courseId}`);
    } catch (error) {
        res.status(500).send("Error enrolling in course");
    }
});

// Student - View course progress and mark pages as complete
lms.post("/courses/:courseId/chapters/:chapterId/pages/:pageId/complete", isAuthenticated, async (req, res) => {
    const { courseId, pageId } = req.params;
    try {
        await Progress.create({
            studentId: req.session.user.id,
            courseId,
            pageId,
            completed: true
        });
        res.redirect(`/courses/${courseId}`);
    } catch (error) {
        res.status(500).send("Error marking page as complete");
    }
});

// Educator - View reports
lms.get("/reports", isAuthenticated, async (req, res) => {
    try {
        const reports = await Reports.findAll({
            where: { educatorId: req.session.user.id }
        });
        res.render("reports", { reports });
    } catch (error) {
        res.status(500).send("Error fetching reports");
    }
});

// Change password route
lms.get("/account/password", isAuthenticated, (req, res) => {
    res.render("change-password");
});

lms.post("/account/password", isAuthenticated, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.session.user;
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).send("Old password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).send("Error updating password");
    }
});
// GET route to display courses
lms.get("/courses", isAuthenticated, async (req, res) => {
    try {
        const courses = await Course.findAll(); // Fetch all courses
        res.render("course", { course }); // Render the courses page with the list of courses
    } catch (error) {
        res.status(500).send("Error loading courses");
    }
});

// Logout route
lms.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = lms;
