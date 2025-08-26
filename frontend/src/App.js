import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useJob } from './contexts/JobContext';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobList from './components/jobs/JobList';
import JobDetail from './components/jobs/JobDetail';
import CreateJob from './components/jobs/CreateJob';
import MyJobs from './components/jobs/MyJobs';
import JobApplicants from './components/jobs/JobApplicants';
import Applications from './components/applications/Applications';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import AboutUs from './components/pages/AboutUs';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import Contactus from './components/pages/Contactus';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const { getJobs } = useJob();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Only call getJobs once when user becomes authenticated
      getJobs();
    }
  }, [isAuthenticated, loading, getJobs]); // Removed getJobs from dependencies

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route 
            path="/jobs/:id/applicants" 
            element={isAuthenticated && user?.role === 'employer' ? <JobApplicants /> : <Navigate to="/login" />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-job" 
            element={
              isAuthenticated && user?.role === 'employer' 
                ? <CreateJob /> 
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/my-jobs" 
            element={
              isAuthenticated && user?.role === 'employer' 
                ? <MyJobs /> 
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/applications" 
            element={isAuthenticated ? <Applications /> : <Navigate to="/login" />} 
          />
          <Route 
              path='/about'
              element={<AboutUs />} />
          <Route 
              path='/terms'
              element={<PrivacyPolicy />} />
               <Route 
              path='/contact'
              element={<Contactus />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
