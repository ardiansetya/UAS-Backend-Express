const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/middleware');
const categoryController = require('../controllers/categoryController');

// Route untuk menambahkan kategori
router.post('/categories', authenticate, isTeacher, categoryController.addCategory);

// Route untuk menampilkan semua kategori
router.get('/categories', authenticate, categoryController.showCategories);

// Route untuk mengupdate kategori
router.put('/categories/:categoryId', authenticate, isTeacher, categoryController.updateCourse);

// Route untuk menghapus kategori
router.delete('/categories/:categoryId', authenticate, isTeacher, categoryController.deleteCategory);

module.exports = router;