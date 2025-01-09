const prisma = require('../db');  // Pastikan Prisma sudah diinisialisasi dengan benar


const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Mengecek apakah kategori sudah ada
        const existingCategory = await prisma.courseCategory.findFirst({
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



module.exports = {
    addCategory,
    showCategories,
    deleteCategory,
}