# ATS Tracking System

A comprehensive Applicant Tracking System (ATS) built with React, Vite, and Tailwind CSS. This application serves two primary user roles: Candidates and Recruiters, featuring streamlined workflows for job applications and resume management.

## Features

### For Candidates
*   **Intuitive Dashboard**: At-a-glance view of application status and recent activity.
*   **Job Search & Discovery**: Browse, search, and filter job listings effectively.
*   **Application Tracking**: Monitor the progress of submitted applications in real-time.
*   **Profile Management**: Update professional information and resume details.
*   **Saved Jobs**: Bookmark interesting positions for later application.

### For Recruiters
*   **Hiring Dashboard**: Analytics-driven overview of the entire hiring pipeline.
*   **Job Management**: Post, edit, manage, and close job listings seamlessly.
*   **Applicant Review**: Detailed candidate profiles with integrated resume parsing.
*   **Resume Analysis**: Advanced insights on candidate qualifications and fit.
*   **Analytics**: Visual reports on hiring metrics and source performance.

## Tech Stack
*   **Frontend**: React.js (v18+)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Routing**: React Router DOM (v6)
*   **State Management**: Context API
*   **Charts**: Recharts

## Getting Started

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the `backend/` directory based on `.env.example`:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ats_tracking_system
    JWT_SECRET=your_super_secret_key
    
    # Email Configuration
    EMAIL_SERVICE=gmail
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    EMAIL_FROM=no-reply@ats.com
    
    # Frontend URL (for CORS)
    CLIENT_URL=http://localhost:5173
    ```

4.  Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the root directory (in a new terminal):
    ```bash
    # If you are in backend/, go back
    cd ..
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

### Production Build

1.  Build the frontend:
    ```bash
    npm run build
    ```

2.  Start the backend in production mode:
    ```bash
    cd backend
    npm start
    ```

    ```

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, global styles)
├── components/     # Reusable UI components and charts
├── context/        # Global state providers (Auth, Theme)
├── data/           # Mock data for prototyping
├── hooks/          # Custom React hooks (useAuth, useTheme)
├── layouts/        # Application layouts (Auth, Dashboard)
├── pages/          # Application pages (Auth, Candidate, Recruiter)
└── utils/          # Helper functions and utilities
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

MIT License
