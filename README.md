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

## Bonus Features
- File Upload: Allow resume uploads with cloud or local storage.
- Admin Panel: Dashboard to view all jobs and applications.
- Search/Filter: Enable job search by keyword or skills.
- Analytics: Count the number of applications per job.

## API Documentation
- Base URL
- text
- http://localhost:5000/api (or your deployed backend URL)



## Authentication Endpoints
- Register a New User
- URL: /auth/register
- Method: POST
- Auth Required: No
- Request Body:
json
```bash
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "applicant" // or "employer"
}
```
Success Response: 201 Created
json
```bash
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

## Login User
- URL: /auth/login
- Method: POST
- Auth Required: No
- Request Body:
json
```bash
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Success Response: 200 OK
json
```bash
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "applicant"
  }
}
```


## Jobs Endpoints
- Get All Jobs
- URL: /jobs
- Method: GET
- Auth Required: No
- Success Response: 200 OK
json
```bash
[
  {
    "_id": "job_id",
    "title": "Frontend Developer",
    "description": "Job description here...",
    "requirements": ["React", "JavaScript"],
    "createdBy": "employer_user_id",
    "createdAt": "2023-11-15T10:30:00.000Z",
    "updatedAt": "2023-11-15T10:30:00.000Z"
  }
]
```


## Create a Job (Employer Only)
- URL: /jobs
- Method: POST
- Auth Required: Yes (Employer role)
- Request Headers: Authorization: Bearer <jwt_token>
- Request Body:
json
```bash
{
  "title": "Frontend Developer",
  "description": "Job description here...",
  "requirements": ["React", "JavaScript"]
}
```
- Success Response: 201 Created
json
```bash
{
  "message": "Job created successfully",
  "job": {
    "_id": "job_id",
    "title": "Frontend Developer",
    "description": "Job description here...",
    "requirements": ["React", "JavaScript"],
    "createdBy": "employer_user_id",
    "createdAt": "2023-11-15T10:30:00.000Z",
    "updatedAt": "2023-11-15T10:30:00.000Z"
  }
}
```



## Applications Endpoints
- Apply for a Job
- URL: /applications
- Method: POST
- Auth Required: Yes (Applicant role)
- Request Headers: Authorization: Bearer <jwt_token>
- Request Body:
json
```bash
{
  "jobId": "job_id",
  "coverLetter": "Why I'm a good fit for this position..."
}
```


## Form Data: Optionally include resume file upload
- Success Response: 201 Created
json
```bash
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "application_id",
    "jobId": "job_id",
    "userId": "applicant_user_id",
    "status": "applied",
    "coverLetter": "Why I'm a good fit for this position...",
    "resume": "resume_file_path.pdf",
    "appliedAt": "2023-11-15T10:30:00.000Z"
  }
}
```

## Get User Applications
- URL: /applications/user/:userId
- Method: GET
- Auth Required: Yes
- Request Headers: Authorization: Bearer <jwt_token>
- Success Response: 200 OK
json
```bash
[
  {
    "_id": "application_id",
    "jobId": {
      "_id": "job_id",
      "title": "Frontend Developer",
      "description": "Job description here..."
    },
    "userId": "user_id",
    "status": "applied",
    "coverLetter": "Why I'm a good fit for this position...",
    "resume": "resume_file_path.pdf",
    "appliedAt": "2023-11-15T10:30:00.000Z"
  }
]
```


## Admin Endpoints
- Get All Applications (Admin Only)
- URL: /admin/applications
- Method: GET
- Auth Required: Yes (Admin role)
- Request Headers: Authorization: Bearer <jwt_token>
- Query Parameters:
- status (optional): Filter by status (applied/shortlisted/rejected)
- jobId (optional): Filter by job ID
- Success Response: 200 OK
json
```bash
[
  {
    "_id": "application_id",
    "jobId": {
      "_id": "job_id",
      "title": "Frontend Developer"
    },
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "applied",
    "coverLetter": "Why I'm a good fit for this position...",
    "resume": "resume_file_path.pdf",
    "appliedAt": "2023-11-15T10:30:00.000Z"
  }
]
```


## Error Responses
- 400 Bad Request
json
```bash
{
  "error": "Validation failed",
  "details": ["Email is required", "Password must be at least 6 characters"]
}
```
- 401 Unauthorized
json
```bash
{
  "error": "Authentication failed",
  "message": "Invalid email or password"
}
```
- 403 Forbidden
json
```bash
{
  "error": "Access denied",
  "message": "Employer access required"
}
```
- 404 Not Found
json
```bash
{
  "error": "Not found",
  "message": "Job not found"
}
```
- 409 Conflict
json
```bash
{
  "error": "Duplicate application",
  "message": "You have already applied for this job"
}
```
- 500 Internal Server Error
json
```bash
{
  "error": "Server error",
  "message": "Something went wrong"
}
```

## WebSocket Events (Real-time Notifications)
- Event: connection
- Description: Establishes WebSocket connection
- New Application Notification
- Event: new-application
Data:
json
```bash
{
  "message": "New application received",
  "application": {
    "jobTitle": "Frontend Developer",
    "applicantName": "John Doe",
    "appliedAt": "2023-11-15T10:30:00.000Z"
  }
}
```

## Environment Variables
- Required environment variables for the backend:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
