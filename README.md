# TalentHub - Job Portal Platform

A MERN stack job portal where companies can post jobs and developers can apply.

## Features
- User authentication (Employer/Applicant roles)
- Job posting and management
- Job applications with status tracking
- Real-time notifications
- Responsive design

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Frontend**: React, Context API, React Router

## Setup

1. **Install dependencies**
```bash
npm run install-all
```

2. **Start MongoDB**
Make sure MongoDB is running on `mongodb://localhost:27017/Remote_jobs`

3. **Run the application**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage
- Register as Employer to post jobs
- Register as Applicant to apply for jobs
- Browse jobs and track applications

## API Endpoints
- `/api/auth/*` - Authentication
- `/api/jobs/*` - Job management
- `/api/applications/*` - Application handling
