const express = require("express");
const { authenticate } = require("../middleware/middleware");
const { addCompletionTracking, showCompletionTracking, deleteCompletionTracking } = require("../controllers/contentCompletion");
const router = express.Router();

// Menambahkan completion tracking
router.post('/completion', authenticate, addCompletionTracking);

// Menampilkan completion tracking untuk kursus
router.get('/completion/:courseId', authenticate, showCompletionTracking);

// Menghapus completion tracking
router.delete('/completion/:completionId', authenticate, deleteCompletionTracking);


module.exports = router;
