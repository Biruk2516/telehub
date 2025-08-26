import React, { useEffect, useState } from 'react';
import { useJob } from '../../contexts/JobContext';
import JobCard from './JobCard';
import LoadingSpinner from '../LoadingSpinner';
import { Search } from 'lucide-react';

const JobList = () => {
  const { jobs, loading, getJobs } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    // Only call getJobs once when component mounts
    getJobs();
  }, [getJobs]); // Empty dependency array

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills && job.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'20px'}}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md flex " style={{paddingLeft:'50px'}}>
          
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{margin:'20px',width:'1000px'}}
          />
          
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No jobs found' : 'No jobs available'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new opportunities!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
