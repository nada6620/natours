# Natours — Tour Booking Web Application

Natours is a **tour booking web application** built with a strong focus on **Backend Development**.

The project was developed to apply real-world backend concepts such as RESTful APIs, authentication and authorization, database management, payment integration, image processing, security, error handling, and deployment.

##  Features

###  Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure authentication using HTTP-only cookies
* Password reset functionality
* Role-based authorization
* Protected routes

### User Management

* Update user information
* Update password
* User profile photo upload
* Image resizing and processing

### Tours

* Browse available tours
* Get tour details
* Search and filter tours
* Sort and paginate results
* Tour locations displayed using interactive maps
* Manage tours through protected API routes

### Reviews & Ratings

* Users can add reviews to tours they have booked
* Rating system
* Prevent duplicate reviews for the same tour
* Users can manage their own reviews

### Payments & Bookings

* Stripe Checkout integration
* Secure payment processing
* Stripe webhook handling
* Booking creation after successful payment

### Security & Error Handling

* Centralized error handling
* Request validation
* Authentication middleware
* Authorization middleware
* HTTP security headers
* Protection against common API vulnerabilities
* Secure password hashing

###  Deployment

* Deployed to **Vercel**
* Configured production environment variables
* Connected production application to MongoDB Atlas
* Handled production-specific backend configuration

---

## Project Architecture

The backend follows a structured architecture that separates the main responsibilities of the application:

Natours/
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── tourController.js
│   ├── reviewController.js
│   └── bookingController.js
│   └── viewController.js
│
├── models/
│   ├── userModel.js
│   ├── tourModel.js
│   ├── reviewModel.js
│   └── bookingModel.js
│
├── routes/
│   ├── viewRoutes.js
│   ├── userRoutes.js
│   ├── tourRoutes.js
│   ├── reviewRoutes.js
│   └── bookingRoutes.js
│
├── utils/
│   ├── appError.js
│   ├── catchAsync.js
│   └── apiFeatures.js
│   └── sendEmail.js
│
│
├── public/
│
├── views/
│
├── app.js
├── server.js
└── package.json
 
---

## API Highlights

The application provides RESTful API endpoints for:

* Authentication
* Users
* Tours
* Reviews
* Bookings

Example:

```http
GET    /api/v1/tours
GET    /api/v1/tours/:id
POST   /api/v1/tours
PATCH  /api/v1/tours/:id
DELETE /api/v1/tours/:id
```

## What I Learned

This project was an important step in my backend development journey. Through Natours, I practiced:

* Building RESTful APIs with Express.js
* Designing MongoDB databases with Mongoose
* Implementing JWT authentication
* Building role-based authorization
* Handling file uploads and image processing
* Integrating Stripe payments and webhooks
* Writing reusable middleware
* Implementing centralized error handling
* Securing backend applications
* Working with environment variables
* Deploying a Node.js application to Vercel
* Debugging production issues

---

##  Project Goal

The main goal of this project was to move beyond basic CRUD applications and build a more **complete, production-oriented backend application** while gaining practical experience with real-world backend development.

---

## Author

**Nada Ayman Mohamed**

Computer Science Student | Backend Developer

**Focus:** Node.js • Express.js • MongoDB • REST APIs
