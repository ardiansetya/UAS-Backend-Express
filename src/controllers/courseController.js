const prisma = require('../db');  // Pastikan Prisma sudah diinisialisasi dengan benar

// Fungsi untuk menampilkan daftar kursus
const listCourses = async (req, res) => {
    try {
        
        const { page = 1, limit = 10 } = req.query; // Ambil nilai page dan limit dari query string (default page = 1, limit = 10)
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ message: 'Parameter page dan limit harus berupa angka positif' });
        }

        const skip = (pageNumber - 1) * limitNumber; // Hitung jumlah data yang dilewati

        // Ambil data courses dengan pagination
        const courses = await prisma.course.findMany({
            skip,
            take: limitNumber,
            include: {
                teacher: true, // Mengambil data teacher terkait
            },
        });

        // Hitung total courses
        const totalCourses = await prisma.course.count();

        res.status(200).json({
            data: courses,
            totalCourses,
            totalPages: Math.ceil(totalCourses / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};


// Fungsi untuk mengambil kursus milik user
const myCourses = async (req, res) => {
    try {
        const id = req.user.id; // Ambil id dari JWT payload
        console.log(req.user)
        const courses = await prisma.courseMember.findMany({
            where: { userId:id },
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
    const { name, description, price, site, categoryId, url } = req.body;

    try {
        const {id, role} = req.user; // Ambil id dari JWT payload
        console.log(req.user.roles)

        // Validasi role
        if (role !== 'teacher') {
            return res.status(403).json({ message: 'Anda tidak memiliki izin untuk membuat course' });
        }


        const course = await prisma.course.create({
            data: {
                name,
                description,
                price,
                url,
                teacherId: id,
                site,
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
    const { name, description, price, site, categoryId } = req.body;

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
                site: site || course.site, // Update site jika ada
                categoryId: categoryId || course.categoryId, // Menyimpan categoryId yang bisa null
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

        const existingEnrollment = await prisma.courseMember.findFirst({
            where: {
                courseId: parseInt(courseId),
                userId: id,
            },
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Anda sudah terdaftar di kursus ini' });
        }

        // Mendaftarkan user ke kursus
        const courseMember = await prisma.courseMember.create({
            data: {
                courseId: parseInt(courseId),
                userId: id,
                roles: 'STUDENT',  // Menetapkan role sebagai student
            },
        });
        res.status(201).json(courseMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// get content comments
const getContentComment = async (req, res) => {
    const { contentId } = req.params;

    try {
        // const id = req.user.id; // Ambil id dari JWT payload
        const content = await prisma.courseContent.findMany({
            where: { id: parseInt(contentId) },
        });

        if (!content) {
            return res.status(404).json({ message: 'Konten tidak ditemukan' });
        }

        res.status(201).json(newComment);
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

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const userId = req.user.id; // Ambil ID user dari JWT payload

        // Cari komentar berdasarkan ID
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Komentar tidak ditemukan' });
        }

        // Pastikan hanya pemilik komentar yang bisa menghapusnya
        if (comment.memberId !== userId) {
            return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus komentar ini' });
        }

        // Hapus komentar
        await prisma.comment.delete({
            where: { id: parseInt(commentId) },
        });

        res.status(200).json({ message: 'Komentar berhasil dihapus' });
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
    getContentComment,
    deleteComment
};
