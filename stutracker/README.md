### StuTracker

Overview
StuTracker is a web application designed to help students and teachers manage academic progress, courses, and goals. It provides a user-friendly interface for students to track their progress, set goals, and view enrolled courses, while teachers can manage courses, add students, and monitor class performance. The app uses a mock authentication system with localStorage for data persistence, making it a great starting point for a full-stack educational platform.

This project was built using React, Vite, and Tailwind CSS, with a focus on responsive design and modular code structure. It includes role-based dashboards for students and teachers, ensuring each user type has access to relevant features.

### Features

## General Features

User Authentication: Mock signup and login system for students and teachers using localStorage.
Role-Based Dashboards: Separate dashboards for students and teachers with tailored functionality.
Responsive Design: Fully responsive UI using Tailwind CSS, compatible with mobile, tablet, and desktop devices.

## Student Dashboard

Progress Tracking: View subject-wise progress with visual progress bars.
Course Enrollment: View a list of enrolled courses with details (course name, teacher, school) on click.

## Goal Setting: Add and view personal academic goals.

Streak Motivator: Track daily streaks to encourage consistent engagement.
Quiz Challenge: Take a daily quiz (mock implementation with a modal).
Profile Editing: Update personal details like name, grade level, and school.

## Teacher Dashboard

Course Management: Add, delete, and manage courses.
Student Management: Add or remove students from courses and view their progress.
Class Progress: View class-wide progress with visual progress bars.
Student Account Creation: Link to create new student accounts via the signup page.

## Real-Time Updates

Courses added by teachers are immediately available in the student’s dashboard (within the same tab, or after a refresh in a different tab due to localStorage limitations).

### Usage

Access the App: Open your browser and navigate to http://localhost:5173.
Sign Up or Log In:
Use the default credentials to log in:

Student: student@example.com / password123
Teacher: teacher@example.com / password123

Alternatively, sign up as a new student or teacher from the /signup page.

## Student Dashboard:

Log in as a student to view your progress, enrolled courses, goals, streak, and take a quiz.
Click on a course in the "Your Courses" section to view details (teacher’s name, role, school).
Add goals and edit your profile as needed.

## Teacher Dashboard:

Log in as a teacher to manage courses and students.
Add a new course, then select it to add students (e.g., student@example.com).
View class progress and individual student progress.

## Testing Real-Time Updates:

Add a course and assign a student to it in the TeacherDashboard.
Log in as the student in the same tab (or refresh the page in a different tab) to see the course in the "Your Courses" section.

## Technologies Used

React: JavaScript library for building user interfaces.
Vite: Fast frontend build tool for development and production.
Tailwind CSS: Utility-first CSS framework for styling.
React Router: For client-side routing.
React Context API: For state management (mock authentication and data sharing).
LocalStorage: For mock data persistence.

### Future Improvements

# Backend Integration:

Replace the mock data with a real backend API (e.g., Node.js, Express, MongoDB).
Implement proper user authentication with JWT and password hashing.

# Real-Time Updates:

Add WebSockets or polling to sync data across tabs without requiring a refresh.

# Input Validation:

Add validation for forms (e.g., ensure student email exists before adding to a course).

# Enhanced Features:

Add assignment creation and submission functionality.
Implement a grading system for quizzes and assignments.
Add notifications for students and teachers (e.g., new course enrollment, goal reminders).

# Deployment:

Deploy the app to a hosting platform like Netlify or Vercel.

# Testing:

Add unit and integration tests using Jest and React Testing Library.

# Contributing

Contributions are welcome! To contribute to StuTracker:

## Fork the repository.

Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit them (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the file for details.

## Contact

For questions or feedback, feel free to reach out:

GitHub: codingaday
Email: abebeduguma27@gmail.com
