const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const dotenv = require('dotenv');

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET

const register = async (req, res) => {
    const { username, email, password, role = "STUDENT" } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, dan password wajib diisi' });
    }

    try {
        // Memeriksa apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan user baru ke database dengan role yang ditentukan
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role, // Menyimpan role yang diberikan (default 'student')
            },
        });

        res.status(201).json({
            message: 'Registrasi berhasil',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    try {
        // Mencari user berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Memeriksa apakah password sesuai
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Membuat JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role }, // Payload yang berisi id user dan role
            JWT_SECRET, // Gunakan secret key dari environment
            { expiresIn: '1h' } // Token valid selama 1 jam
        );

        res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = { register, login };
