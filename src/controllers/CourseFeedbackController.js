const prisma = require('../db'); // Sesuaikan dengan path Prisma Client Anda

// Add Feedback
const addFeedback = async (req, res) => {
    const { courseId } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;

    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        const feedbackEntry = await prisma.courseFeedback.create({
            data: {
                courseId: parseInt(courseId),
                userId,
                feedback,
            },
        });

        res.status(201).json(feedbackEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Show Feedback
const showFeedback = async (req, res) => {

    try {
        const feedbacks = await prisma.courseFeedback.findMany();

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Edit Feedback
const editFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;

    try {
        const existingFeedback = await prisma.courseFeedback.findUnique({
            where: { id: parseInt(feedbackId) },
        });

        if (!existingFeedback || existingFeedback.userId !== userId) {
            return res.status(403).json({ message: 'Tidak diizinkan untuk mengedit feedback ini' });
        }

        const updatedFeedback = await prisma.courseFeedback.update({
            where: { id: parseInt(feedbackId) },
            data: { feedback },
        });

        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const userId = req.user.id;

    try {
        const existingFeedback = await prisma.courseFeedback.findUnique({
            where: { id: parseInt(feedbackId) },
        });

        if (!existingFeedback || existingFeedback.userId !== userId) {
            return res.status(403).json({ message: 'Tidak diizinkan untuk menghapus feedback ini' });
        }

        await prisma.courseFeedback.delete({
            where: { id: parseInt(feedbackId) },
        });

        res.status(200).json({ message: 'Feedback berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    addFeedback,
    showFeedback,
    editFeedback,
    deleteFeedback,
};
