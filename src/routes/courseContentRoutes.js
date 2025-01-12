const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/middleware');
const { createCourseContent, getAllCourseContents, getCourseContentById, updateCourseContent, deleteCourseContent } = require("../controllers/courseContentController");


router.post("/course/:courseId/contents", authenticate, isTeacher, createCourseContent);
router.get("/course/contents", getAllCourseContents);
router.get("/course/contents/:id", getCourseContentById);
router.put("/course/contents/:id", authenticate, isTeacher, updateCourseContent);
router.delete("/course/contents/:id", authenticate, isTeacher, deleteCourseContent);

module.exports = router;