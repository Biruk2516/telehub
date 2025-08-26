import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const JobApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        if (!isAuthenticated || user?.role !== 'employer') {
          navigate('/login');
          return;
        }
        const jobRes = await axios.get(`/api/jobs/${id}`);
        setJobTitle(jobRes.data?.title || '');
        const res = await axios.get(`/api/applications/job/${id}`);
        setApplicants(res.data || []);
      } catch (err) {
        navigate('/my-jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id, isAuthenticated, user, navigate]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'20px'}}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applicants for {jobTitle}</h1>
        <Link to={`/jobs/${id}`} className="nav-link">Back to Job</Link>
      </div>

      {applicants.length === 0 ? (
        <div className="text-gray-600">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applicants.map(app => (
            <div className="card" key={app._id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{app.userId?.name}</h3>
                  <p className="text-sm text-gray-500">{app.userId?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className="badge badge-info">{app.status}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Cover Letter</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{app.coverLetter}</p>
              </div>
              {app.resume && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-1">Resume</h4>
                  <a href={`http://localhost:5000${app.resume}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Open Resume</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;


