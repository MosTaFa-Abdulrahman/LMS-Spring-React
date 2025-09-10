import "./footer.scss";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Award,
  Heart,
  ChevronUp,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="lms-footer">
      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop}>
        <ChevronUp size={20} />
      </button>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="logo-section">
              <BookOpen className="logo-icon" size={32} />
              <h3 className="company-name">LMS Pro</h3>
            </div>
            <p className="company-description">
              Empowering minds through innovative online learning. Join
              thousands of students who have transformed their careers with our
              comprehensive courses.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#courses">Browse Courses</a>
              </li>
              <li>
                <a href="#instructors">Our Instructors</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#pricing">Pricing Plans</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4 className="section-title">Categories</h4>
            <ul className="footer-links">
              <li>
                <a href="#web-dev">Web Development</a>
              </li>
              <li>
                <a href="#data-science">Data Science</a>
              </li>
              <li>
                <a href="#design">UI/UX Design</a>
              </li>
              <li>
                <a href="#marketing">Digital Marketing</a>
              </li>
              <li>
                <a href="#business">Business</a>
              </li>
              <li>
                <a href="#photography">Photography</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="section-title">Support</h4>
            <ul className="footer-links">
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#contact">Contact Support</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#refund">Refund Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-info">
            <h4 className="section-title">Get in Touch</h4>
            <div className="contact-items">
              <div className="contact-item">
                <Mail className="contact-icon" size={16} />
                <span>support@edumaster.com</span>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" size={16} />
                <span>123 Learning Street, Education City, EC 12345</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="newsletter">
              <h5>Subscribe to Newsletter</h5>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <Users className="stat-icon" size={24} />
            <div className="stat-content">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
          <div className="stat-item">
            <BookOpen className="stat-icon" size={24} />
            <div className="stat-content">
              <span className="stat-number">1,200+</span>
              <span className="stat-label">Courses</span>
            </div>
          </div>
          <div className="stat-item">
            <Award className="stat-icon" size={24} />
            <div className="stat-content">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
          <div className="stat-item">
            <Heart className="stat-icon" size={24} />
            <div className="stat-content">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="bottom-left">
            <p>&copy; 2026 LMS Pro. All rights reserved.</p>
          </div>
          <div className="bottom-right">
            <div className="certification-badges">
              <span className="badge">SSL Secured</span>
              <span className="badge">GDPR Compliant</span>
              <span className="badge">ISO Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="footer-decoration">
        <div className="decoration-circle decoration-1"></div>
        <div className="decoration-circle decoration-2"></div>
        <div className="decoration-circle decoration-3"></div>
      </div>
    </footer>
  );
}
