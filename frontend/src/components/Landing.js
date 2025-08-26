import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useJob } from "../contexts/JobContext";
import { Briefcase, Search, Users, TrendingUp, ArrowRight } from "lucide-react";
import JobCard from "./jobs/JobCard";
import LoadingSpinner from "./LoadingSpinner";
import Footer from "./Footer";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const { jobs, loading, getJobs } = useJob();

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getJobs]);

  const recentJobs = jobs.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <section className="hero" style={{marginTop:'-50px'}}>
        <div className="container">
          <h1 className="hero-title">
            Find Your Dream Job or
            <span className="hero-accent">Hire the Best Talent</span>
          </h1>
          <p className="hero-sub">
            TalentHub connects talented developers with innovative companies.
            Whether you're looking for your next opportunity or building your
            team, we've got you covered.
          </p>
          <div className="hero-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-primary hero-cta">
                  Sign in to your account
                </Link>
                <Link to="/register" className="btn btn-outline hero-cta">
                  New here? Create an account
                </Link>
              </>
            ) : (
              <>
                {user?.role === "employer" ? (
                  <Link to="/create-job" className="btn btn-primary hero-cta">
                    Post a Job
                  </Link>
                ) : (
                  <Link to="/jobs" className="btn btn-primary hero-cta">
                    Find Jobs
                  </Link>
                )}
                <Link to="/dashboard" className="btn btn-outline hero-cta">
                  Go to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Built for developers and teams</h2>
          <p className="section-sub">
            TalentHub brings clarity to hiring. Candidates get a clean view of roles, compensation,
            and required skills. Employers get high-signal applications from engineers who match
            the stack and the mission.
          </p>
          <div className="columns-3">
            <div>
              <h3 className="section-mini">Smart Job Matching</h3>
              <p className="muted">Personalized matches based on your skills, interests, and location.</p>
            </div>
            <div>
              <h3 className="section-mini">Quality Candidates</h3>
              <p className="muted">Verified developer profiles with portfolios, repos, and assessments.</p>
            </div>
            <div>
              <h3 className="section-mini">Career Growth</h3>
              <p className="muted">Opportunities that value learning, mentorship, and progression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recent Job Openings</h2>
            <Link to="/jobs" className="nav-link">
              View All Jobs
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="jobs-grid">
              {recentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No jobs available</h3>
              <p className="text-gray-500">Check back later for new opportunities!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-10 text-blue-100">
            Join thousands of developers and companies already using TalentHub
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 text-lg font-bold rounded-full shadow-lg transition-all"
            >
              Create Your Account
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 text-lg font-bold rounded-full shadow-lg transition-all"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
