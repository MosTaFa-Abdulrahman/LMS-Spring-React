# 🎓 Learning Management System (LMS)  

> A **full-featured Udemy-like LMS** built with **Spring Boot + React.js** 🚀  

![LMS Banner]()  
*(Built with ❤️ by Mustafa Abdelrahman)*  

🔗 **Demo Video:** [Watch on LinkedIn](https://www.linkedin.com/posts/mustafa-abdelrahman-86ba06366_learning-management-system-spring-boot-activity-7375289113496866817-HPYT/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFrrBVMB6rqpWi20p28YzbRTV680oenITWE)  

---

## ✨ Features Overview  

### 🔐 Authentication & User Management  
- 👤 User registration & login (**JWT + Spring Security**)  
- 🔒 Secure password encryption  
- ✏️ Update profile (name, email, phone, picture, etc.)  
- ❌ Delete account  
- 🛡️ Role-based access control (Student / Instructor / Admin)  
- 📑 Fetch single/all users with **pagination**  

---

### 📚 Courses & Content  
- ➕ Create / Update / Delete courses  
- 🔎 Search & Paginate courses  
- 📄 Short & Long course descriptions  
- 🖼️ Upload & update course images  
- ⏳ Auto-calculate **total duration** (based on videos)  
- 👨‍🏫 Instructor-owned courses  
- 📌 Manage course status (**Draft / Published**)  

---

### 🗂️ Sections & Videos  
- 📂 Create / Update / Delete sections  
- 🎥 Add & manage course videos  
- ☁️ Upload videos (Cloud/File service)  
- ⏱️ Auto-calculate **video duration**  
- 🔑 Secure access (only for enrolled users)  

---

### 📝 Quizzes & Exams  
- 🧩 Create / Update / Delete quizzes  
- ❓ Add multiple questions per quiz  
- ⏳ Timed quizzes (set duration)  
- 🚫 Prevent retakes after completion  
- 🏆 Auto-scoring system  
- 📊 Store quiz results per user  
- 🔒 Leaving/Navigating = **Score = 0**  

---

### 👥 Enrollment & Progress  
- 🎟️ Enroll users in courses  
- 📈 Track course progress (sections/videos)  
- 📝 Store completed quizzes  
- 📚 Purchased courses management  
- 🚫 Restrict locked content for non-enrolled users  

---

### 💳 Payments & Transactions  
- 💰 Store purchase transactions  
- 👨‍💼 Payments restricted to Admins  
- 🎓 Add purchased courses to user profile  

---

### 📰 Posts, Comments & Replies  
- 📝 Create / Update / Delete posts (Text + Images)  
- 📄 Fetch posts (single / multiple with pagination)  
- 👍 Like/Unlike posts  
- 💬 Add/Delete comments  
- ❤️ Like/Unlike comments  
- ↩️ Add/Delete replies  
- 🔄 Like/Unlike replies  
- 📑 View all comments & replies  

---

### 🔔 Notifications  
- Triggered by:  
  - 👍 Post Likes  
  - 💬 Comment Likes  
  - ↩️ Reply Likes  
  - ✍️ New Comments  
  - 💭 New Replies  
  - 👥 New Followers  
  - 🎓 Course Enrollments (optional)  
- 📩 Fetch all (paginated)  
- 🔢 Count unread notifications  
- ✅ Mark as read (single/all)  
- ❌ Delete notification  

---

### 📂 Files & Uploads  
- ⬆️ Upload **images, videos, docs**  
- 🔗 Serve uploaded files securely  
- ☁️ Cloudinary / External storage supported  

---

### 📊 Progress & Analytics  
- 📈 Course completion %  
- 🎥 Track watched videos per user  
- 📝 Track completed quizzes  
- 👨‍🏫 Instructor dashboard (courses, students, progress)  
- 👑 Admin dashboard (users, payments, stats)  

---

### 🎨 Frontend (React + SCSS)  
- ⚡ **Redux Toolkit Query (RTKQ)** → caching, auto-refetch, pagination  
- 🌐 Axios → API calls  
- 🔔 React Hot Toast → alerts & notifications  
- 🎨 Lucide React → modern icons  
- 🕒 Moment.js → time formatting (`2h ago`)  
- 🎭 SCSS (Sass) → responsive & themable design  

---

## 🛠️ Tech Stack  

**Backend (Spring Boot)**  
- Spring Security + JWT  
- Spring Data JPA  
- PostgreSQL   
- Cloudinary (media uploads)  

**Frontend (React.js)**  
- React + SCSS  
- Redux Toolkit Query (RTKQ)  
- Axios  
- React Hot Toast  
- Lucide Icons  

---

## 🚀 Getting Started  

### Backend (Spring Boot)  
```bash
# Clone repo
git clone https://github.com/your-username/lms-backend.git
cd lms-backend

# Run backend
./mvnw spring-boot:run
