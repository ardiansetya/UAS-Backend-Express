## Daftar Isi

- [Pendahuluan](#pendahuluan)
- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instruksi Pengaturan](#instruksi-pengaturan)
- [Endpoint](#endpoint)
  - [Autentikasi](#autentikasi)
  - [Manajemen Kursus](#manajemen-kursus)
  - [Pengumuman](#course-announcements)
  - [Pelacakan Penyelesaian Konten](#content-completion-tracking)
  - [Umpan Balik Kursus](#course-feedback)
  - [Manajemen Kategori Kursus](#course-categories-management)
  - [Manajemen Komentar](#manajemen-komentar)

---

## Pendahuluan

Sistem manajemen kursus yang dibangun dengan Express.js, PostgreSQL, dan Prisma, menyediakan fungsionalitas bagi guru dan siswa untuk mengelola kursus, pengumuman, umpan balik, dan pelacakan konten. Sistem ini memanfaatkan Docker Compose untuk pengaturan dan penyebaran yang lebih mudah.

---

## Fitur

- Autentikasi pengguna (registrasi dan login).
- Pembuatan, pengeditan, dan pendaftaran kursus.
- [Fitur +4] Course Announcements.
- [Fitur +3] Content Completion Tracking.
- [Fitur +4] Course Feedback.
- [Fitur +4] Course Categories Management.
- Komentar pada konten kursus.

---

## Teknologi yang Digunakan

- **Backend**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker Compose

---

## Instruksi Pengaturan

1. Clone repositori:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Jalankan aplikasi menggunakan Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Akses aplikasi di `http://localhost:<port>`.
4. Gunakan Prisma CLI untuk mengelola skema database:
   ```bash
   npx prisma migrate dev
   ```

---

## Endpoint

### Autentikasi

#### Registrasi

- **Endpoint**: `POST /register`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "STUDENT" // Opsional, defaultnya adalah STUDENT
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Registrasi berhasil",
    "user": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

#### Login

- **Endpoint**: `POST /login`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Login berhasil",
    "token": "string",
    "user": {
      "id": "integer",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

---

### Manajemen Kursus

#### Daftar Kursus

- **Endpoint**: `GET /courses`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "integer",
      "site": "string | null",
      "teacher": {
        "id": "integer",
        "username": "string"
      },
      "category": {
        "id": "integer | null",
        "name": "string | null"
      }
    }
  ]
  ```

#### Detail Kursus

- **Endpoint**: `GET /courses/:courseId`
- **Response Body**:
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "site": "string | null",
    "teacher": {
      "id": "integer",
      "username": "string"
    },
    "category": {
      "id": "integer | null",
      "name": "string | null"
    }
  }
  ```

#### Kursus Saya

- **Endpoint**: `GET /mycourses`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "integer",
      "site": "string | null"
    }
  ]
  ```

#### Buat Kursus

- **Endpoint**: `POST /courses`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "integer",
    "site": "string | null",
    "categoryId": "integer | null"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Kursus berhasil dibuat",
    "course": {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "integer",
      "site": "string | null",
      "teacherId": "integer",
      "categoryId": "integer | null"
    }
  }
  ```

#### Perbarui Kursus

- **Endpoint**: `PUT /courses/:courseId`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "integer",
    "site": "string | null",
    "categoryId": "integer | null"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Kursus berhasil diperbarui",
    "course": {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "integer",
      "site": "string | null",
      "teacherId": "integer",
      "categoryId": "integer | null"
    }
  }
  ```

#### Daftar di Kursus

- **Endpoint**: `POST /courses/:courseId/enroll`
- **Response Body**:
  ```json
  {
    "message": "Anda berhasil mendaftar di kursus ini",
    "courseMember": {
      "id": "integer",
      "courseId": "integer",
      "userId": "integer",
      "roles": "string"
    }
  }
  ```

---

### Course Announcements

#### Buat Pengumuman

- **Endpoint**: `POST /course/:courseId/announcement`
- **Request Body**:
  ```json
  {
    "title": "string",
    "message": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Pengumuman berhasil dibuat",
    "announcement": {
      "id": "integer",
      "title": "string",
      "message": "string",
      "teacherId": "integer",
      "courseId": "integer"
    }
  }
  ```

#### Tampilkan Pengumuman

- **Endpoint**: `GET /course/:courseId/announcements`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "title": "string",
      "message": "string",
      "teacher": {
        "id": "integer",
        "username": "string"
      },
      "createdAt": "string (format ISO 8601)",
      "updatedAt": "string (format ISO 8601)"
    }
  ]
  ```

#### Edit Pengumuman

- **Endpoint**: `PUT /course/:courseId/announcement/:announcementId`
- **Request Body**:
  ```json
  {
    "title": "string",
    "message": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Pengumuman berhasil diperbarui",
    "announcement": {
      "id": "integer",
      "title": "string",
      "message": "string",
      "teacherId": "integer",
      "courseId": "integer"
    }
  }
  ```

#### Hapus Pengumuman

- **Endpoint**: `DELETE /course/:courseId/announcement/:announcementId`
- **Response Body**:
  ```json
  {
    "message": "Pengumuman berhasil dihapus"
  }
  ```

---

### [Fitur +3] Content Completion Tracking

#### Tambah Pelacakan Penyelesaian

- **Endpoint**: `POST /completion`
- **Request Body**:
  ```json
  {
    "courseId": "integer",
    "contentId": "integer"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Tracking penyelesaian konten berhasil ditambahkan",
    "completion": {
      "id": "integer",
      "memberId": "integer",
      "contentId": "integer"
    }
  }
  ```

#### Tampilkan Pelacakan Penyelesaian

- **Endpoint**: `GET /completion/:courseId`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "memberId": "integer",
      "contentId": "integer",
      "createdAt": "string (format ISO 8601)"
    }
  ]
  ```

#### Hapus Pelacakan Penyelesaian

- **Endpoint**: `DELETE /completion/:completionId`
- **Response Body**:
  ```json
  {
    "message": "Tracking penyelesaian konten berhasil dihapus"
  }
  ```

---

### Course Feedback

#### Tambah Umpan Balik

- **Endpoint**: `POST /course/:courseId/feedback`
- **Request Body**:
  ```json
  {
    "feedback": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Umpan balik berhasil ditambahkan",
    "feedback": {
      "id": "integer",
      "courseId": "integer",
      "userId": "integer",
      "feedback": "string"
    }
  }
  ```

#### Tampilkan Umpan Balik

- **Endpoint**: `GET /course/:courseId/feedback`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "courseId": "integer",
      "userId": "integer",
      "feedback": "string",
      "createdAt": "string (format ISO 8601)"
    }
  ]
  ```

#### Edit Umpan Balik

- **Endpoint**: `PUT /course/:courseId/feedback/:feedbackId`
- **Request Body**:
  ```json
  {
    "feedback": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Umpan balik berhasil diperbarui",
    "feedback": {
      "id": "integer",
      "courseId": "integer",
      "userId": "integer",
      "feedback": "string"
    }
  }
  ```

#### Hapus Umpan Balik

- **Endpoint**: `DELETE /course/:courseId/feedback/:feedbackId`
- **Response Body**:
  ```json
  {
    "message": "Umpan balik berhasil dihapus"
  }
  ```

---

### Course Categories Management

#### Tambah Kategori

- **Endpoint**: `POST /categories`
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Kategori berhasil dibuat",
    "category": {
      "id": "integer",
      "name": "string"
    }
  }
  ```

#### Tampilkan Kategori

- **Endpoint**: `GET /categories`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "name": "string"
    }
  ]
  ```

#### Hapus Kategori

- **Endpoint**: `DELETE /categories/:categoryId`
- **Response Body**:
  ```json
  {
    "message": "Kategori berhasil dihapus"
  }
  ```

---

### Manajemen Komentar

#### Tampilkan Komentar Konten

- **Endpoint**: `GET /contents/:contentId/comments`
- **Response Body**:
  ```json
  [
    {
      "id": "integer",
      "contentId": "integer",
      "userId": "integer",
      "comment": "string",
      "createdAt": "string (format ISO 8601)"
    }
  ]
  ```

#### Buat Komentar Konten

- **Endpoint**: `POST /contents/:contentId/comments`
- **Request Body**:
  ```json
  {
    "comment": "string"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Komentar berhasil ditambahkan",
    "comment": {
      "id": "integer",
      "contentId": "integer",
      "userId": "integer",
      "comment": "string"
    }
  }
  ```

#### Hapus Komentar

- **Endpoint**: `DELETE /contents/comments/:commentId`
- **Response Body**:
  ```json
  {
    "message": "Komentar berhasil dihapus"
  }
  ```

---
