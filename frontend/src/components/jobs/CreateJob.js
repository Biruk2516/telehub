import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../../contexts/JobContext';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: { min: '', max: '' }
  });
  const [loading, setLoading] = useState(false);
  
  const { createJob } = useJob();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salaryMin' || name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [name === 'salaryMin' ? 'min' : 'max']: value ? parseInt(value) : ''
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await createJob(formData);
    if (success) {
      navigate('/my-jobs');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'20px'}}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Job Title</label>
            <input
              name="title"
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Company Name</label>
            <input
              name="company"
              type="text"
              required
              className="form-input"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Location</label>
            <input
              name="location"
              type="text"
              required
              className="form-input"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Job Type</label>
            <select
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Min Salary</label>
              <input
                name="salaryMin"
                type="number"
                className="form-input"
                value={formData.salary.min}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">Max Salary</label>
              <input
                name="salaryMax"
                type="number"
                className="form-input"
                value={formData.salary.max}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea
              name="description"
              required
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              rows={8}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/my-jobs')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
