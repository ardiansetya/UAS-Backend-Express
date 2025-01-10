const fs = require("fs");
const csvParser = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importCSV() {
    const data = [];
    fs.createReadStream("course-data.csv")
        .pipe(csvParser())
        .on("data", (row) => {
            data.push(row);
        })
        .on("end", async () => {
            console.log("CSV file successfully processed.");

            // Lakukan import data ke database
            try {
                for (const record of data) {
                    await prisma.course.create({
                        data: {
                            name: record.name,
                            url: record.url,
                            description: record.description,
                            site: record.site,
                            price: parseInt(record.price),
                            teacherId: parseInt(record.teacher),
                        },
                    });
                }
                console.log("Data berhasil diimpor ke database.");
            } catch (error) {
                console.error("Error importing data:", error);
            } finally {
                await prisma.$disconnect();
            }
        });
}

importCSV();
