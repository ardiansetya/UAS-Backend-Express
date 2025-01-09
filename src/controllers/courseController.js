const prisma = require('../db');  // Pastikan Prisma sudah diinisialisasi dengan benar

// Fungsi untuk menampilkan daftar kursus
const listCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teacher: true,  // Mengambil data teacher terkait
            },
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk mengambil kursus milik user
const myCourses = async (req, res) => {
    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const courses = await prisma.courseMember.findMany({
            where: { id },
            include: {
                course: true,  // Mengambil data course terkait
            },
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk membuat kursus
const createCourse = async (req, res) => {
    const { name, description, price, image } = req.body; // Mengambil data kursus dari body request

    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const course = await prisma.course.create({
            data: {
                name,
                description,
                price,
                image,
                teacherId: id,  // Menyimpan ID teacher (id)
            },
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk memperbarui kursus
const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { name, description, price, image } = req.body; // Mengambil data dari body request

    try {
        const id = req.user.id; // Ambil id dari JWT payload

        // Cek apakah user adalah teacher dari course ini
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (course.teacherId !== id) {
            return res.status(401).json({ message: 'Anda tidak diijinkan untuk mengupdate kursus ini' });
        }

        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(courseId) },
            data: {
                name,
                description,
                price,
                image: image || course.image, // Update image jika ada, jika tidak gunakan image lama
            },
        });
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk detail kursus
const detailCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            include: {
                teacher: true,  // Mengambil data teacher terkait
            },
        });
        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk mendaftar ke kursus
const enrollCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        // Mendaftarkan user ke kursus
        const courseMember = await prisma.courseMember.create({
            data: {
                id,
                courseId: course.id,
                roles: 'STUDENT',  // Menetapkan role sebagai student
            },
        });
        res.status(201).json(courseMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk membuat komentar di konten kursus
const createContentComment = async (req, res) => {
    const { contentId } = req.params;
    const { comment } = req.body;

    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const content = await prisma.courseContent.findUnique({
            where: { id: parseInt(contentId) },
        });

        if (!content) {
            return res.status(404).json({ message: 'Konten tidak ditemukan' });
        }

        // Membuat komentar
        const newComment = await prisma.comment.create({
            data: {
                contentId: content.id,
                id,
                comment,
            },
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    listCourses,
    myCourses,
    createCourse,
    updateCourse,
    detailCourse,
    enrollCourse,
    createContentComment,
};
