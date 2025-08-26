import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building, Briefcase } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.min) return `$${salary.min.toLocaleString()}+`;
    if (salary.max) return `Up to $${salary.max.toLocaleString()}`;
    return 'Not specified';
  };

  return (
    <div className="card job-card hover:shadow-lg transition-shadow duration-200" style={{marginTop:'20px'}}>
      <div className="flex items-start mb-4">
        <div className="icon-box mr-3">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
                <Link to={`/jobs/${job._id}`} className="hover:text-blue-600">
                  {job.title}
                </Link>
              </h3>
              <div className="flex items-center text-gray-600 mb-1">
                <Building className="w-4 h-4 mr-1" />
                <span>{job.company}</span>
              </div>
            </div>
            <span className="badge badge-info">
              {job.type}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {job.description
              ? `${String(job.description).slice(0, 120)}${String(job.description).length > 120 ? '…' : ''}`
              : 'Join our innovative team to build cutting-edge web applications with React and modern technologies.'}
          </p>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="salary">{formatSalary(job.salary)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {job.applicationCount || 0} applications
            </span>
            <Link
              to={`/jobs/${job._id}`}
              className="btn btn-primary btn-sm"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
