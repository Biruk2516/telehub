import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJob } from '../../contexts/JobContext';

const Applications = () => {
  const { user } = useAuth();
  const { applications, loading, getUserApplications } = useJob();

  useEffect(() => {
    if (user) {
      // Only call getUserApplications once when user changes
      getUserApplications(user.id);
    }
  }, [user]); // Only depend on user changes

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'20px'}}>
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{app.jobId?.title}</h3>
                  <p className="text-gray-600">{app.jobId?.company}</p>
                  <p className="text-sm text-gray-500">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`badge ${
                  app.status === 'applied' ? 'badge-info' :
                  app.status === 'shortlisted' ? 'badge-success' :
                  app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications yet.</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
