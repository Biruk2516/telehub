import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJob } from '../contexts/JobContext';
import { Briefcase, Plus, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { jobs, myJobs, applications, loading, getJobs, getMyJobs, getUserApplications } = useJob();

  useEffect(() => {
    if (user) {
      // Only call APIs once when user changes
      getJobs();
      if (user.role === 'employer') {
        getMyJobs();
      }
      if (user.role === 'applicant') {
        getUserApplications(user.id);
      }
    }
  }, [user]); // Only depend on user changes

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'20px'}}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'employer' ? 'Manage your job postings and applications' : 'Track your job applications'}
        </p>
      </div>
      

      {user?.role === 'employer' ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Employer quick actions */}
          <div>
            <Link to='/my-jobs' >my jobs</Link>
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Jobs</h2>
              <Link to="/create-job" className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-1" />
                Post Job
              </Link>
            </div>
            <p className="text-gray-600">Open any job and use the Delete Job button to remove it.</p>
          </div>

          {/* Recent Applications */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
            <p className="text-gray-500">View applications for your job postings.</p>
            <div className="mt-4">
              <Link to="/applications" className="btn btn-outline">
                <Eye className="w-4 h-4 mr-1" />
                View Applications
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* My Applications */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">My Applications</h2>
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app._id} className="border-b border-gray-200 pb-3">
                    <h3 className="font-medium">{app.jobId?.title}</h3>
                    <p className="text-sm text-gray-600">{app.jobId?.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`badge ${
                        app.status === 'applied' ? 'badge-info' :
                        app.status === 'shortlisted' ? 'badge-success' :
                        app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No applications yet.</p>
            )}
            <div className="mt-4">
              <Link to="/applications" className="text-blue-600 hover:text-blue-700 text-sm">
                View all applications →
              </Link>
            </div>
          </div>

          {/* Browse Jobs */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Browse Jobs</h2>
            <p className="text-gray-500">Find your next opportunity.</p>
            <div className="mt-4">
              <Link to="/jobs" className="btn btn-primary">
                <Briefcase className="w-4 h-4 mr-1" />
                Find Jobs
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Job Openings</h2>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
            View all jobs →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map(job => (
            <div key={job._id} className="card">
              <h3 className="font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-sm text-gray-500 mb-3">{job.location}</p>
              <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
