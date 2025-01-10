# Gunakan image Node.js
FROM node:18

# Set direktori kerja di container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Salin file prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Ekspos port yang digunakan oleh aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
