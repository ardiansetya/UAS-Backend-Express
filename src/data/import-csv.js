const fs = require("fs");
const csvParser = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importCSV() {
    const data = [];
    fs.createReadStream("member-data.csv")
        .pipe(csvParser())
        .on("data", (row) => {
            data.push(row);
        })
        .on("end", async () => {
            console.log("CSV file successfully processed.");

            // Lakukan import data ke database
            try {
                for (const record of data) {
                    await prisma.courseMember.create({
                        data: {
                            courseId: parseInt(record.course_id),
                           userId: parseInt(record.user_id),
                           roles: record.roles
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
