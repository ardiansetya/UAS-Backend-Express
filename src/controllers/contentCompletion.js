const prisma = require("../db");

// Menambahkan completion tracking
const addCompletionTracking = async (req, res) => {
    const { courseId, contentId } = req.body;
    const { id } = req.user; // Pastikan id didapatkan dari autentikasi

    try {
        // Mengecek apakah member tersebut sudah mengikuti kursus ini
        const courseMember = await prisma.courseMember.findFirst({
            where: {
                courseId,
                userId: id,
            },
        });

        if (!courseMember) {
            return res.status(400).json({ message: 'User is not enrolled in this course' });
        }

        // Menambahkan data completion tracking
        const completion = await prisma.completionTracking.create({
            data: {
                memberId: courseMember.id,
                contentId,
            },
        });

        res.status(201).json({ message: 'Completion tracking added', completion });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Menampilkan semua completion tracking untuk kursus yang diikuti
const showCompletionTracking = async (req, res) => {
    const { courseId } = req.params;
    const { id } = req.user; // Pastikan id didapatkan dari autentikasi
    console.log(courseId, id)

    try {
        // Mengecek apakah member tersebut sudah mengikuti kursus ini
        const courseMember = await prisma.courseMember.findFirst({
            where: {
                courseId: parseInt(courseId),
                userId: id,
            },
        });

        if (!courseMember) {
            return res.status(400).json({ message: 'User is not enrolled in this course' });
        }

        // Menampilkan semua completion untuk kursus tersebut
        const completions = await prisma.completionTracking.findMany({
            where: {
                memberId: courseMember.id,
            },
            include: {
                content: true, // Menampilkan detail konten yang telah diselesaikan
            },
        });

        res.status(200).json(completions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Menghapus completion tracking
const deleteCompletionTracking = async (req, res) => {
    const { completionId } = req.params;
    const { id } = req.user; // Pastikan id didapatkan dari autentikasi

    try {
        // Menemukan data completion berdasarkan ID
        const completion = await prisma.completionTracking.findUnique({
            where: {
                id: parseInt(completionId),
            },
            include: {
                member: true,
            },
        });

        const member = await prisma.courseMember.findUnique({
            where: {
                id: completion.memberId,
            },
        })

        if (!completion) {
            return res.status(404).json({ message: 'Completion not found' });
        }


        // Memastikan hanya member yang membuat completion yang dapat menghapusnya
        if (completion.memberId !== member.id) {
            return res.status(403).json({ message: 'You are not allowed to delete this completion' });
        }

        // Menghapus data completion
        await prisma.completionTracking.delete({
            where: {
                id: parseInt(completionId),
            },
        });

        res.status(200).json({ message: 'Completion tracking deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addCompletionTracking,
    showCompletionTracking,
    deleteCompletionTracking,
};
