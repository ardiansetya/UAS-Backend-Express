const express = require('express');
const { authenticate } = require('../middleware/middleware');
const { addFeedback, showFeedback, editFeedback, deleteFeedback } = require('../controllers/CourseFeedbackController');

const router = express.Router();

// Add Feedback
router.post('/course/:courseId/feedback', authenticate, addFeedback);

// Show Feedback
router.get('/course/feedback', authenticate, showFeedback);

// Edit Feedback
router.put('/course/feedback/:feedbackId', authenticate, editFeedback);

// Delete Feedback
router.delete('/course/feedback/:feedbackId', authenticate, deleteFeedback);

module.exports = router;
