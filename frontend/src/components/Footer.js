import React from "react";
import { FaFacebook, FaPhoneAlt, FaGithub, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <Link to="/" className="brand" style={{height:'5px',marginBottom:'1px'}}>
             <div className="brand-logo" >
               <Briefcase className="w-7 h-1 text-white" />
             </div>
             <span className="brand-title">TalentHub</span>
           </Link>
      <div className="container" >
        {/* Top section with social icons */}

        {/* Policy Links */}
        <div className="footer-links" style={{marginTop:'-50px'}} >
          <a href="/terms">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact US</a>
        </div>
        <div className="footer-socials" style={{marginBottom:'1px'}} >
          <a
            href="https://facebook.com/sample"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            <FaFacebook />
          </a>
          <a
            href="tel:+251900000000"
            className="footer-social"
          >
            <FaPhoneAlt />
          </a>
          <a
            href="https://github.com/sample"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            <FaGithub />
          </a>
          <a
            href="mailto:sample@email.com"
            className="footer-social"
          >
            <FaEnvelope />
          </a>
        </div>
        <p className="footer-sub" >
          TalentHub helps developers and teams find the perfect match. Explore roles with transparent
          compensation, required skills, and growth opportunities.
        </p>
        <p className="footer-sub">Personalized matches based on your skills, interests, and location.</p>

        {/* Bottom copyright */}
        <p className="footer-copy"  style={{marginBottom:'-50px'}}>
          © 2024 TalentHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;