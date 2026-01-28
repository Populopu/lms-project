This project is a role-based Learning Management System (LMS) built with the MERN stack.
It supports Teachers, Students, and Admins, using JWT authentication, secure APIs, and clean dashboard flows.

🚀 Tech Stack

Frontend: React, React Router, Toastify

Backend: Node.js, Express.js

Database: MongoDB + Mongoose

Authentication: JWT

Security: bcrypt password hashing

Email: NodeMailer (student credentials)

👥 User Roles
Role	Capabilities
Teacher	Add, edit, view students
Student	View own profile & teacher
Admin	Manage all students
🔐 Authentication & Authorization

JWT token is generated on login

Token is stored in localStorage

Token is sent in Authorization header for protected routes

Role-based middleware controls access:

auth

teacherOnly

adminOnly

👩‍🏫 Teacher Flow
1️⃣ Teacher Signup

Teachers register using the signup form.

Required fields:

Name

Email

Password

Backend actions:

Validates input

Hashes password using bcrypt

Saves user with role teacher

📍 API:

POST /api/auth/signup

2️⃣ Teacher Login

Teachers log in using email and password.

On success:

JWT token is generated

User data + token stored in localStorage

Redirected to Teacher Dashboard

📍 API:

POST /api/auth/login

3️⃣ Teacher Dashboard

The teacher dashboard allows teachers to:

View only their own students

Search students by name or email

Paginate student list

Add new students

Edit existing students

📍 API:

GET /api/students

➕ Add Student

When clicking Add Student:

Student list hides

A form opens

Fields:

Name

Email

Department (dropdown – single select)

Courses (dropdown – multi select)

Backend actions:

Generates a random password

Hashes password

Creates a user with role student

Creates a student document linked to the teacher

Sends credentials to student via email

📍 API:

POST /api/students

📧 Student Email Notification

When a student is added:

Student receives an email containing:

Login email

Auto-generated password

⚠️ Even if email fails, student is still created successfully.

✏️ Edit Student

Teachers can edit students they created.

Editable fields:

Name

Email

Department

Courses

✔ Same form UI is used for Add and Edit

📍 API:

PUT /api/students/:id

👨‍🎓 Student Flow
1️⃣ Student Receives Credentials

Student receives login credentials via email when added by a teacher.

2️⃣ Student Login

Students log in using email & password received in email.

📍 API:

POST /api/auth/login

3️⃣ Student Dashboard

Students can:

View their profile

See assigned teacher details

Upload/update avatar

📍 API:

GET /api/students/me

🧑‍💼 Admin Flow

Admins can:

View all students

Soft delete students

Schedule deletion using cron jobs

Permanently delete students

(Admin creation is protected via secret key)

📍 API:

POST /api/auth/admin

🗑️ Soft Delete & Scheduled Delete

Students are soft deleted using:

isDeleted

deletedAt

Soft-deleted students:

Are hidden from dashboards

Still exist in the database

Scheduled deletion uses cron jobs

Toast notifications show delete status

🛡️ Security Features

Password hashing with bcrypt

JWT authentication

Role-based route protection

Teachers can only manage their own students

Students cannot access teacher/admin routes

🗂️ Backend Folder Structure
backend/
├── controllers/
│   ├── authControllers.js
│   ├── studentControllers.js
│   └── adminControllers.js
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   └── adminRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── uploadAvatar.js
├── models/
│   ├── users.js
│   └── student.js
└── utils/
    └── sendEmail.js

✅ Summary

✔ Teachers can sign up and manage students
✔ Students receive credentials via email
✔ Students can log in and view their dashboard
✔ Admins can control students globally
✔ Secure, scalable, role-based LMS