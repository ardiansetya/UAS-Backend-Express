const prisma = require("../db");

// Create a new course content
const createCourseContent = async (req, res) => {
    const { name, description, videoUrl } = req.body;
    const { courseId } = req.params;

    try {
        // Validasi jika kursus ada
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const courseContent = await prisma.courseContent.create({
            data: {
                name,
                description,
                videoUrl,
                courseId: parseInt(courseId),
            },
        });

        res.status(201).json({
            message: "Course content created successfully",
            courseContent,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to create course content",
            details: error.message,
        });
    }
};

// Get all course contents
const getAllCourseContents = async (req, res) => {
    try {
        const courseContents = await prisma.courseContent.findMany({
            include: {
                course: true,
                comments: true,
                completions: true,
            },
        });

        res.status(200).json({
            message: "Fetched all course contents",
            data: courseContents,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch course contents",
            details: error.message,
        });
    }
};

// Get a single course content by ID
const getCourseContentById = async (req, res) => {
    const { id } = req.params;

    try {
        const courseContent = await prisma.courseContent.findUnique({
            where: { id: parseInt(id) },
            include: {
                course: true,
                comments: true,
                completions: true,
            },
        });

        if (!courseContent) {
            return res.status(404).json({ error: "Course content not found" });
        }

        res.status(200).json({
            message: "Fetched course content",
            data: courseContent,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch course content",
            details: error.message,
        });
    }
};

// Update a course content by ID
const updateCourseContent = async (req, res) => {
    const { id } = req.params;
    const { name, description, videoUrl } = req.body;

    try {
        // Validasi jika konten ada
        const courseContent = await prisma.courseContent.findUnique({
            where: { id: parseInt(id) },
        });

        if (!courseContent) {
            return res.status(404).json({ error: "Course content not found" });
        }

        const updatedContent = await prisma.courseContent.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                videoUrl,
            },
        });

        res.status(200).json({
            message: "Course content updated successfully",
            data: updatedContent,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update course content",
            details: error.message,
        });
    }
};

// Delete a course content by ID
const deleteCourseContent = async (req, res) => {
    const { id } = req.params;

    try {
        // Validasi jika konten ada
        const courseContent = await prisma.courseContent.findUnique({
            where: { id: parseInt(id) },
        });

        if (!courseContent) {
            return res.status(404).json({ error: "Course content not found" });
        }

        await prisma.courseContent.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Course content deleted successfully" });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete course content",
            details: error.message,
        });
    }
};

module.exports = {
    createCourseContent,
    getAllCourseContents,
    getCourseContentById,
    updateCourseContent,
    deleteCourseContent,
};
