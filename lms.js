/* eslint-disable no-unused-vars */
const express = require("express");
const lms = express();
const bodyParser = require("body-parser");
lms.use(bodyParser.json());
const session = require('express-session');
const { request } = require("http");
const path = require("path");
const { Chapters, Course, Enrollments, Pages, Progress, Reports, User } = require("./models");

lms.post("/page", async function (request, response) {
    try {
        await Pages.create({
            title: request.body.title,
            content: request.body.content,
            chapter_id: null ,
        });
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    } 
});


module.exports = lms ;