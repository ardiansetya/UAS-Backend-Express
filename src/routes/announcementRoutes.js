const express = require('express');
const { isTeacher } = require('../middleware/middleware');
const { createAnnouncement, showAnnouncements, editAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const router = express.Router();

// Endpoint untuk membuat pengumuman (hanya teacher)
router.post('/course/:courseId/announcement', isTeacher, createAnnouncement);

// Endpoint untuk menampilkan pengumuman (semua user bisa)
router.get('/course/:courseId/announcements', showAnnouncements);

// Endpoint untuk mengedit pengumuman (hanya teacher)
router.put('/announcement/:announcementId', isTeacher, editAnnouncement);

// Endpoint untuk menghapus pengumuman (hanya teacher)
router.delete('/announcement/:announcementId', isTeacher, deleteAnnouncement);

module.exports = router;