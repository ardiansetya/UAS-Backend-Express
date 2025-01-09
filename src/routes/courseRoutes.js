const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/middleware');
const courseController = require('../controllers/courseController');

// Route untuk daftar kursus
router.get('/courses', courseController.listCourses);

// Route untuk detail kursus
router.get('/courses/:courseId', courseController.detailCourse);

// Route untuk kursus milik user
router.get('/mycourses', authenticate, courseController.myCourses);

// Route untuk membuat kursus
router.post('/courses', authenticate, courseController.createCourse);

// Route untuk memperbarui kursus
router.put('/courses/:courseId', authenticate, courseController.updateCourse);

// Route untuk mendaftar kursus
router.post('/courses/:courseId/enroll', authenticate, courseController.enrollCourse);

// Route untuk membuat komentar pada konten kursus
router.post('/contents/:contentId/comments', authenticate, courseController.createContentComment);

module.exports = router;
