import React, { createContext, useContext, useReducer, useCallback, useRef ,useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobContext = createContext();

const initialState = {
  jobs: [],
  myJobs: [],
  applications: [],
  loading: false,
  error: null
};

const jobReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'GET_JOBS_SUCCESS':
      return { ...state, jobs: action.payload, loading: false, error: null };
    case 'GET_MY_JOBS_SUCCESS':
      return { ...state, myJobs: action.payload, loading: false, error: null };
    case 'GET_APPLICATIONS_SUCCESS':
      return { ...state, applications: action.payload, loading: false, error: null };
    case 'CREATE_JOB_SUCCESS':
      return { ...state, myJobs: [action.payload, ...state.myJobs], loading: false };
    case 'APPLY_JOB_SUCCESS':
      return { ...state, applications: [action.payload, ...state.applications], loading: false };
    default:
      return state;
  }
};

export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const loadingRef = useRef(false);
  const requestQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const callTimeoutRef = useRef(null);

  const getJobs = useCallback(async () => {
    const now = Date.now();
    
    // Prevent rapid successive calls (minimum 2 seconds between calls)
    if (now - lastCallTimeRef.current < 2000) {
      return;
    }
    
    // Prevent multiple simultaneous calls
    if (loadingRef.current || state.loading || isProcessingRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      lastCallTimeRef.current = now;
      loadingRef.current = true;
      isProcessingRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await axios.get('/api/jobs', {
        signal: abortControllerRef.current.signal
      });
      dispatch({ type: 'GET_JOBS_SUCCESS', payload: res.data.jobs });
    } catch (error) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled
      }
      const message = error.response?.data?.message || 'Failed to fetch jobs';
      dispatch({ type: 'SET_ERROR', payload: message });
      // Only show toast for actual errors, not network interruptions
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_INSUFFICIENT_RESOURCES') {
        toast.error(message);
      }
    } finally {
      loadingRef.current = false;
      isProcessingRef.current = false;
    }
  }, [state.loading]);

  const getMyJobs = useCallback(async () => {
    if (loadingRef.current || state.loading) return;
    
    try {
      loadingRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('/api/jobs/employer/my-jobs');
      dispatch({ type: 'GET_MY_JOBS_SUCCESS', payload: res.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your jobs';
      dispatch({ type: 'SET_ERROR', payload: message });
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_INSUFFICIENT_RESOURCES') {
        toast.error(message);
      }
    } finally {
      loadingRef.current = false;
    }
  }, [state.loading]);

  const createJob = useCallback(async (jobData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/jobs', jobData);
      dispatch({ type: 'CREATE_JOB_SUCCESS', payload: res.data });
      toast.success('Job created successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return false;
    }
  }, []);

  const applyForJob = useCallback(async (applicationData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/applications', applicationData);
      dispatch({ type: 'APPLY_JOB_SUCCESS', payload: res.data });
      toast.success('Application submitted successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return false;
    }
  }, []);

  const getUserApplications = useCallback(async (userId) => {
    if (loadingRef.current || state.loading) return;
    
    try {
      loadingRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get(`/api/applications/user/${userId}`);
      dispatch({ type: 'GET_APPLICATIONS_SUCCESS', payload: res.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch applications';
      dispatch({ type: 'SET_ERROR', payload: message });
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_INSUFFICIENT_RESOURCES') {
        toast.error(message);
      }
    } finally {
      loadingRef.current = false;
    }
  }, [state.loading]);

  const deleteJob = useCallback(async (jobId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      await getMyJobs();
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete job';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return false;
    }
  }, [getMyJobs]);

  // Cleanup effect to cancel pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    ...state,
    getJobs,
    getMyJobs,
    createJob,
    applyForJob,
    getUserApplications,
    deleteJob
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
