const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Baca data dari fail JSON  
    const data = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

    // Masukkan data ke dalam pangkalan data  
    for (const item of data) {
        await prisma.comment.create({
            data: {
            contentId: item.content_id,
            userId: item.user_id,
            comment: item.comment
            },
        });
    }

    console.log('Data telah dimasukkan ke dalam pangkalan data.');
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });