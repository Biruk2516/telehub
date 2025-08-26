import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJob } from '../../contexts/JobContext';
import { Plus } from 'lucide-react';

const MyJobs = () => {
  const { myJobs, loading, getMyJobs, deleteJob } = useJob();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // Only call getMyJobs once when component mounts
    getMyJobs();
  }, [getMyJobs]); // Empty dependency array

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Link to="/create-job" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-1" />
          Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : myJobs.length > 0 ? (
        <div className="space-y-4">
          {myJobs.map(job => (
            <div key={job._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-info">{job.type}</span>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.applicationCount || 0} applications
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
                  View Details
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={async () => {
                    if (!window.confirm('Delete this job? This cannot be undone.')) return;
                    setDeletingId(job._id);
                    await deleteJob(job._id);
                    setDeletingId(null);
                  }}
                  disabled={deletingId === job._id}
                >
                  {deletingId === job._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No job postings yet.</p>
          <Link to="/create-job" className="btn btn-primary">
            Post Your First Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
