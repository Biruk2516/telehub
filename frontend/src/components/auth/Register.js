import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
  <div style={{marginLeft:'500px',marginTop:'20px'}}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600"> Already have an account?
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                style={{width:'400px'}}
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                style={{width:'400px'}}
              />
            </div>
            
            <div>
              <label className="form-label">Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                style={{width:'400px'}}
              />
                     <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{marginLeft:'-40px',borderRadius:'20px',borderColor:'lightgray',backgroundColor:'none',height:'0px'}}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
            </div>

            <div>
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                style={{width:'400px'}}
              >
                <option value="applicant">Developer</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            {formData.role === 'employer' && (
              <div>
                <label className="form-label">Company Name</label>
                <input
                  name="company"
                  type="text"
                  required
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                  style={{width:'400px'}}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full p-5"
            style={{marginTop:'10px'}}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Register;
