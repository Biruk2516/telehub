import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJob = useCallback(async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowApplyForm(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      toast.error('Please enter a cover letter.');
      return;
    }
    try {
      setSubmitting(true);
      const form = new FormData();
      form.append('jobId', id);
      form.append('coverLetter', coverLetter);
      if (resumeFile) form.append('resume', resumeFile);
      await axios.post('/api/applications', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      setCoverLetter('');
      setResumeFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJob = async () => {
    if (!isAuthenticated || user?.role !== 'employer') {
      navigate('/login');
      return;
    }
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/jobs/${id}`);
      toast.success('Job deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{job.company}</p>
          <p className="text-gray-500 mb-4">{job.location} • {job.type}</p>
          {user?.role === 'employer' && (
            <div className="flex gap-2 mb-4">
              <button
                className="btn btn-outline"
                onClick={() => navigate(`/jobs/${id}/applicants`)}
              >
                View Applicants
              </button>
              <button
                className="btn btn-ghost"
                onClick={deleteJob}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          )}
          <button
            onClick={handleApply}
            className="btn btn-primary"
            disabled={user?.role === 'employer'}
          >
            {user?.role === 'employer' ? 'Employers cannot apply' : 'Apply for this job'}
          </button>
          {showApplyForm && user?.role !== 'employer' && (
            <form className="mt-6 space-y-4" onSubmit={submitApplication}>
              <div>
                <label className="form-label">Cover Letter</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Tell us why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Resume (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.rtf,.txt"
                  className="form-input"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-gray-500 mt-1">Optional: attach your latest resume.</p>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowApplyForm(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
