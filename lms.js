/* eslint-disable no-unused-vars */
const express = require("express");
const lms = express();
const bodyParser = require("body-parser");
lms.use(bodyParser.json());
const session = require('express-session');
const { Chapters, Course, Enrollments, Pages, Progress, Reports, User } = require("./models");

lms.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'You need to be logged in' });
}

lms.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, password } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.user = user;
        res.status(200).json(user);
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/signout", (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Signed out successfully" });
});

lms.post("/course", isAuthenticated, async (req, res) => {
    try {
        const { name, description } = req.body;
        const course = await Course.create({ name, description, userId: req.session.user.id });
        res.status(201).json(course);
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/chapter", isAuthenticated, async (req, res) => {
    try {
        const { title, courseId } = req.body;
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const chapter = await Chapters.create({ title, courseId });
        res.status(201).json(chapter);
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/page", isAuthenticated, async (req, res) => {
    try {
        const { title, content, chapter_id } = req.body;

        const chapter = await Chapters.findByPk(chapter_id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }

        const page = await Pages.create({ title, content, chapter_id });
        res.status(201).json({ message: "Page created successfully", page });
    } catch (error) {
        console.error(error);
        res.status(422).json(error);
    }
});

lms.post("/enroll", isAuthenticated, async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        await Enrollments.create({ userId: req.session.user.id, courseId });
        res.status(200).json({ message: "Enrolled successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.get("/course/:courseId/chapters", async (req, res) => {
    try {
        const { courseId } = req.params;
        const chapters = await Chapters.findAll({ where: { courseId } });
        res.status(200).json(chapters);
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/page/:pageId/complete", isAuthenticated, async (req, res) => {
    try {
        const { pageId } = req.params;
        const page = await Pages.findByPk(pageId);

        if (!page) {
            return res.status(404).json({ error: "Page not found" });
        }

        await Progress.create({ userId: req.session.user.id, pageId });
        res.status(200).json({ message: "Page marked as complete" });
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.get("/course/:courseId/progress", isAuthenticated, async (req, res) => {
    try {
        const { courseId } = req.params;
        const totalPages = await Pages.count({ where: { courseId } });
        const completedPages = await Progress.count({ where: { userId: req.session.user.id } });

        const progress = (completedPages / totalPages) * 100;
        res.status(200).json({ progress });
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.get("/course/:courseId/report", isAuthenticated, async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const enrollmentCount = await Enrollments.count({ where: { courseId } });
        res.status(200).json({ enrollmentCount });
    } catch (error) {
        res.status(422).json(error);
    }
});

lms.post("/account/password", isAuthenticated, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.session.user.id);

        if (user.password !== oldPassword) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
});

module.exports = lms;
