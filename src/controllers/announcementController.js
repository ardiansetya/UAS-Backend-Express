const prisma = require("../db");

// Fungsi untuk menambahkan pengumuman
const createAnnouncement = async (req, res) => {
    const { courseId } = req.params;
    const { title, message } = req.body;

    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (!course) {
            return res.status(404).json({ message: 'Kursus tidak ditemukan' });
        }

        // Pastikan hanya teacher yang bisa membuat pengumuman
        if (course.teacherId !== id) {
            return res.status(401).json({ message: 'Anda tidak diijinkan untuk membuat pengumuman' });
        }

        const newAnnouncement = await prisma.courseAnnouncement.create({
            data: {
                title,
                message,
                teacherId: id,
                courseId: course.id,
            },
        });

        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk menampilkan pengumuman
const showAnnouncements = async (req, res) => {
    const { courseId } = req.params;

    try {
        const announcements = await prisma.courseAnnouncement.findMany({
            where: { courseId: parseInt(courseId) },
            include: {
                teacher: true, // Mengambil data teacher yang membuat pengumuman
            },
        });

        if (announcements.length === 0) {
            return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
        }

        res.status(200).json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk mengedit pengumuman
const editAnnouncement = async (req, res) => {
    const { announcementId } = req.params;
    const { title, message } = req.body;

    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const announcement = await prisma.courseAnnouncement.findUnique({
            where: { id: parseInt(announcementId) },
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
        }

        // Pastikan hanya teacher yang bisa mengedit pengumuman
        if (announcement.teacherId !== id) {
            return res.status(401).json({ message: 'Anda tidak diijinkan untuk mengedit pengumuman ini' });
        }

        const updatedAnnouncement = await prisma.courseAnnouncement.update({
            where: { id: parseInt(announcementId) },
            data: {
                title,
                message,
                
            },
        });

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk menghapus pengumuman
const deleteAnnouncement = async (req, res) => {
    const { announcementId } = req.params;

    try {
        const id = req.user.id; // Ambil id dari JWT payload
        const announcement = await prisma.courseAnnouncement.findUnique({
            where: { id: parseInt(announcementId) },
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
        }

        // Pastikan hanya teacher yang bisa menghapus pengumuman
        if (announcement.teacherId !== id) {
            return res.status(401).json({ message: 'Anda tidak diijinkan untuk menghapus pengumuman ini' });
        }

        await prisma.courseAnnouncement.delete({
            where: { id: parseInt(announcementId) },
        });

        res.status(200).json({ message: 'Pengumuman berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports ={
    createAnnouncement,
    showAnnouncements,
    editAnnouncement,
    deleteAnnouncement
}