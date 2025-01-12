const jwt = require('jsonwebtoken');
const prisma = require('../db'); // Sesuaikan dengan path Prisma Client Anda
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ;

// Middleware untuk memeriksa autentikasi (validasi token)
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Cari user berdasarkan ID dari token
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ message: 'Akses ditolak. Pengguna tidak ditemukan.' });
        }

       
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token tidak valid' });
    }
};

const isTeacher = (req, res, next) => {
    // Memastikan bahwa user sudah terautentikasi
    authenticate(req, res, () => {
        // Memeriksa apakah role pengguna adalah 'teacher'
        if (req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Access denied. Only teachers are allowed to perform this action.' });
        }
        // Lanjutkan ke middleware berikutnya jika role user adalah teacher
        next();
    });
};


module.exports = { authenticate, isTeacher };
