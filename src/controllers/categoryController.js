const prisma = require('../db');  // Pastikan Prisma sudah diinisialisasi dengan benar


const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Mengecek apakah kategori sudah ada
        const existingCategory = await prisma.courseCategory.findUnique({
            where: { name },
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Kategori sudah ada' });
        }

        const category = await prisma.courseCategory.create({
            data: {
                name,
            },
        });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk menampilkan semua kategori
const showCategories = async (req, res) => {
    try {
        const categories = await prisma.courseCategory.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await prisma.courseCategory.findUnique({
            where: { id: parseInt(categoryId) },
        });

        if (!category) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }

        // Hapus kategori dari database
        await prisma.courseCategory.delete({
            where: { id: parseInt(categoryId) },
        });

        // Menangani kursus yang memiliki kategori yang dihapus
        await prisma.course.updateMany({
            where: { categoryId: parseInt(categoryId) },
            data: { categoryId: null },
        });

        res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const createCourse = async (req, res) => {
    const { name, description, price, image, categoryId } = req.body;

    try {
        const userId = req.user.userId; // Ambil userId dari JWT payload
        const course = await prisma.course.create({
            data: {
                name,
                description,
                price,
                teacherId: userId,
                image,
                categoryId: categoryId || null, // Menyimpan categoryId yang bisa null
            },
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { name, description, price, image, categoryId } = req.body;

    try {
        const userId = req.user.userId; // Ambil userId dari JWT payload

        // Cek apakah user adalah teacher dari course ini
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (course.teacherId !== userId) {
            return res.status(401).json({ message: 'Anda tidak diijinkan untuk mengupdate kursus ini' });
        }

        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(courseId) },
            data: {
                name,
                description,
                price,
                image: image || course.image, // Update image jika ada
                categoryId: categoryId || course.categoryId, // Menyimpan categoryId yang bisa null
            },
        });
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};
