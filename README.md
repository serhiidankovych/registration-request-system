# Registration Request System (MVP)

A full-stack web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, **ShadCN UI**, and **MongoDB** that implements a moderated registration workflow with role selection, admin approval, password hashing, and email notification.

<img width="1917" height="842" alt="image" src="https://github.com/user-attachments/assets/79ae1b47-a0d3-4d41-a8d0-879dcd1ea50b" />


---

## 🌐 Live Demo

**Web App:**
[https://registration-request-system.vercel.app/](https://registration-request-system.vercel.app/)

**Login Page (Admin & User Panel):**
[https://registration-request-system.vercel.app/auth/login](https://registration-request-system.vercel.app/auth/login)

---

## 🔑 Admin Access (Demo)

You can log in as an administrator using:

* **Login:** `admin@example.com`
* **Password:** `admin123`

You can access both:

* **Admin panel**
* **User panel**

via:
[https://registration-request-system.vercel.app/auth/login](https://registration-request-system.vercel.app/auth/login)

> ⚠️ Demo credentials are for testing purposes only.
> ⚠️ Note: The MongoDB Atlas cluster may automatically pause due to inactivity (free tier behavior). If the application does not load or authentication fails, please contact me so I can restart the cluster for testing.


---


## 🚀 Tech Stack

### Core

* **Next.js 15**
* **TypeScript**
* **MongoDB + Mongoose**
* **Tailwind CSS v4**
* **ShadCN UI**
* **Zod (validation)**

### Authentication & Security

* **NextAuth.js**
* **JWT (jsonwebtoken)**
* **bcryptjs (password hashing)**

### Forms & State

* **React Hook Form**
* **Zod Resolver**
* **Zustand**
* **TanStack React Query**

### Email Service

* **EmailJS** (`@emailjs/browser`) for sending credentials after approval

### Deployment

* **Vercel**
* **MongoDB Atlas**

---

## 📌 Features (MVP Scope)

### 1️⃣ Public Registration Request Flow

#### `/auth/request`

Basic form:

* Full name
* Email
* Phone number
* About section
* Consent checkbox

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/114c249e-8be8-4e56-aab2-2d75c0090929" />


#### `/auth/request/type`

Role selection:

* **User**
* **Researcher**
<img width="1920" height="634" alt="image" src="https://github.com/user-attachments/assets/f21375d6-29c7-4a14-94e9-faa08234e046" />

#### `/auth/request/researcher`

Extended form (Researcher only):

* Passport fields
* Director’s application (URL for MVP)

<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/052096cd-9cd0-4834-8e7e-40aceb434215" />

---

### 2️⃣ Request API

* Create registration request
* Get all requests (admin/staff)
* Get request details
* Approve request (admin/staff)
* Reject request (admin/staff)
<img width="1919" height="793" alt="image" src="https://github.com/user-attachments/assets/514f94f5-7e35-4276-b7f1-34f156f61883" />
---

### 3️⃣ Moderation Workflow

1. User submits registration request
2. Admin reviews the request
3. Admin approves or rejects it
4. If approved:

   * System generates a password
   * Password is hashed using **bcrypt**
   * User is created in database
   * Credentials are sent via **EmailJS**
<img width="400" height="500" alt="image" src="https://github.com/user-attachments/assets/29b9f30e-63bd-4594-a690-66d78b036511" />

---

## 🔐 Security

* Passwords are **never stored in plain text**
* The `password` field always contains a **bcrypt hash**
* Role-based access control (admin / staff / user / researcher)
* Email uniqueness enforced in MongoDB
* Protected admin routes

---


## 🎯 Project Goal

This project demonstrates:

* Moderated user onboarding
* Role-based registration workflow
* Secure password handling with hashing
* Email-based credential delivery
* Clean modular architecture
* Production deployment on Vercel
