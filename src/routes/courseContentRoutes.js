const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/middleware');
const { createCourseContent, getAllCourseContents, getCourseContentById, updateCourseContent, deleteCourseContent } = require("../controllers/courseContentController");


router.post("/courses/:courseId/contents", createCourseContent);
router.get("/courses/contents", getAllCourseContents);
router.get("/courses/contents/:id", getCourseContentById);
router.put("/courses/contents/:id", updateCourseContent);
router.delete("/courses/contents/:id", deleteCourseContent);

module.exports = router;