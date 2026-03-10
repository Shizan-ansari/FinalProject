**1. INTRODUCTION**

WanderStay is a full-stack web application designed to simplify the process of discovering and booking accommodations online. The platform enables travelers to browse property listings, view detailed information, and securely book stays through an integrated payment system.

The primary objective of this project is to simulate a real-world accommodation booking platform where both users and property owners (admins) can interact with the system. Users can explore available properties and make bookings, while administrators can manage property listings and monitor booking activities.

This project was developed as part of a full-stack web development learning journey and focuses on integrating backend logic, database management, and frontend user experience into a single functional application.

---

**1.1 PROJECT MOTIVATION**

Modern travel platforms provide users with the ability to search for accommodations, explore property details, select booking dates, and complete payments online. These systems integrate multiple technologies to provide a seamless user experience.

The motivation behind WanderStay was to replicate a simplified version of such a platform while demonstrating how different web technologies can be combined to build a practical real-world application.

Rather than developing a basic CRUD (Create, Read, Update, Delete) project, the goal was to implement a system where multiple roles interact with the platform, bookings are processed dynamically, and payments are handled securely.

---

**1.2 KEY FEATURES**

The WanderStay platform provides different functionalities for users and administrators to ensure a complete booking system experience.

---

**1.2.1 User Features**

Users visiting the platform can perform the following activities:

• Browse available property listings
• View detailed information about each property
• Search listings based on title, description, location, or country
• Select check-in and check-out dates for their stay
• Fill out a booking form with guest details
• Complete secure payments using Razorpay
• Leave reviews and ratings for properties

The user interface is designed to be simple and intuitive so that users can easily find suitable accommodations without unnecessary complexity.

---

**1.2.2 Admin Features**

Property owners (admins) have access to additional functionality that allows them to manage their listings on the platform. Admins can:

• Create new property listings
• Upload images and add property descriptions
• Update listing details such as price, location, and amenities
• Edit or delete existing listings
• View bookings made for their properties

This functionality ensures that property owners maintain full control over their property information and can update it whenever necessary.

---

**1.2.3 Global Admin Role**

In addition to regular administrators, the platform also includes a **Global Admin** role.

The Global Admin acts as a system supervisor with full access to the platform. This role can:

• Monitor all listings available on the platform
• View all booking records
• Ensure the smooth functioning of the system
• Maintain overall data integrity and platform management

This role demonstrates how **role-based access control** can be implemented in a web application.

---

**1.3 BOOKING AND PAYMENT WORKFLOW**

The WanderStay booking system follows a structured workflow to ensure smooth and secure transactions.

1. A user browses available property listings on the platform.

2. The user selects a property and opens the booking form.

3. The user enters booking details such as:

   * Name
   * Contact Number
   * Number of Guests
   * Check-in Date
   * Check-out Date

4. The system automatically calculates the total cost based on the number of nights selected.

5. A confirmation popup is displayed showing the final booking amount.

6. The user proceeds to payment through the Razorpay payment gateway.

7. Once the payment is successful, the booking information is stored in the database and the booking is confirmed.

This workflow ensures that bookings are recorded only after successful payment verification.

---

**1.4 TECHNOLOGY STACK**

The WanderStay platform was developed using a combination of frontend, backend, and database technologies.

---

**1.4.1 Frontend Technologies**

The frontend of the application was developed using:

• HTML – for structuring the web pages
• CSS – for styling and layout design
• Bootstrap – for responsive UI components
• JavaScript – for dynamic client-side interactions
• EJS (Embedded JavaScript Templates) – for rendering dynamic content from the server

EJS allows the backend server to send data to the frontend and dynamically generate web pages.

---

**1.4.2 Backend Technologies**

The backend system was implemented using:

• Node.js
• Express.js

Node.js provides the runtime environment for executing JavaScript on the server, while Express.js handles routing, middleware, and server logic.

---

**1.4.3 Database**

The database layer of the application uses:

• MongoDB – NoSQL database for storing application data
• Mongoose ODM – Object Data Modeling library for MongoDB
• MongoDB Atlas – Cloud-based database hosting

The database stores information such as:

• User accounts
• Property listings
• Reviews and ratings
• Booking records
• Payment information

---

**1.5 EXTERNAL SERVICES AND APIs**

To enhance functionality and user experience, the project integrates several external services.

**Razorpay**

Razorpay is used to process secure online payments. It allows users to complete transactions through multiple payment methods while ensuring payment data security.

**Mapbox**

Mapbox provides interactive map functionality to display property locations. This helps users visualize where each listing is located geographically.

**SweetAlert**

SweetAlert is used to display interactive popup notifications such as booking confirmations, alerts, and error messages. It improves the user interface compared to standard browser alert boxes.

---

**1.6 PROJECT STRUCTURE**

The project follows a modular architecture to keep the code organized and maintainable.

WanderStay
│
├── models
│   ├── listing.js
│   ├── review.js
│   └── order.js
│
├── controllers
│   ├── listingController.js
│   ├── reviewController.js
│   └── paymentController.js
│
├── routes
│   ├── listingRoutes.js
│   ├── reviewRoutes.js
│   └── paymentRoutes.js
│
├── middleware
│   └── authentication.js
│
├── views
│   ├── listings
│   ├── reviews
│   └── layouts
│
├── public
│   ├── css
│   ├── js
│   └── images
│
└── app.js

This structure separates responsibilities such as routing, controllers, database models, and frontend views.

---

**1.7 SECURITY AND VALIDATION**

To ensure the reliability and correctness of the system, several validation mechanisms have been implemented:

• Contact number validation
• Date validation (check-in must be before check-out)
• Mandatory form fields for booking
• Booking confirmation only after successful payment
• Role-based access control for administrative actions

These validations help maintain system integrity and prevent invalid data from entering the database.

---

**1.8 FUTURE IMPROVEMENTS**

Although the current system demonstrates a working booking platform, several improvements can be implemented in future versions:

• Email notifications for booking confirmations
• Advanced filtering and search options
• Personalized accommodation recommendations
• Analytics dashboard for administrators
• Improved mobile responsiveness
• Dedicated mobile application support

These enhancements would make the platform more scalable and closer to a production-level system.

---

**1.9 LEARNING OUTCOMES**

During the development of this project, several important concepts in full-stack development were explored, including:

• Full-stack application architecture
• RESTful API routing
• Payment gateway integration
• Database schema design
• Role-based access control
• Dynamic user interfaces using EJS
• Handling asynchronous operations in JavaScript

Working on the WanderStay platform helped strengthen both frontend and backend development skills.

---

**1.10 AUTHOR**

This project was developed as part of a major academic project while learning full-stack web development.

The objective was to build a practical system that demonstrates real-world concepts such as accommodation booking systems, role-based access management, and secure online payment integration.
