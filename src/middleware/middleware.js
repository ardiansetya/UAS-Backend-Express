const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Sesuaikan dengan path Prisma Client Anda

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

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

        // Simpan user di request untuk digunakan di route selanjutnya
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token tidak valid' });
    }
};

module.exports = { authenticate };
