import "./landing.scss";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Award,
  PlayCircle,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Globe,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "This LMS transformed my learning experience. The interactive courses and real-time feedback helped me land my dream job!",
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "The AI-powered learning paths and personalized recommendations made complex topics easy to understand.",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "Amazing platform! The collaborative features and mentor support system are game-changers.",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description:
        "Engaging multimedia content with hands-on projects and real-world applications.",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description:
        "Learn from industry professionals with personalized guidance and feedback.",
    },
    {
      icon: Award,
      title: "Certified Learning",
      description:
        "Earn recognized certificates that boost your career prospects.",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description:
        "Smart recommendations and adaptive learning paths tailored to your pace.",
    },
    {
      icon: Target,
      title: "Skill-Based",
      description:
        "Focus on practical skills that matter in today's competitive market.",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Connect with learners and professionals from around the world.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "500+", label: "Expert Instructors" },
    { number: "95%", label: "Success Rate" },
    { number: "100+", label: "Countries" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1
                className={`hero-title ${isVisible.hero ? "animate-in" : ""}`}
              >
                Transform Your Future with
                <span className="gradient-text"> Smart Learning</span>
              </h1>
              <p
                className={`hero-description ${
                  isVisible.hero ? "animate-in delay-1" : ""
                }`}
              >
                Join thousands of learners who are advancing their careers with
                our AI-powered learning management system. Master new skills,
                earn certificates, and unlock opportunities in the digital age.
              </p>
              <div
                className={`hero-buttons ${
                  isVisible.hero ? "animate-in delay-2" : ""
                }`}
              >
                <button className="btn-primary">
                  Start Learning Free
                  <ArrowRight size={20} />
                </button>
                <NavLink to={"/courses"} className="btn-secondary link">
                  <PlayCircle size={20} />
                  Watch Courses
                </NavLink>
              </div>
              <div
                className={`hero-stats ${
                  isVisible.hero ? "animate-in delay-3" : ""
                }`}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image">
              <div
                className={`image-container ${
                  isVisible.hero ? "animate-in delay-1" : ""
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                  alt="Students learning"
                  className="main-image"
                />
                <div className="floating-card card-1">
                  <CheckCircle className="card-icon" />
                  <span>Course Completed!</span>
                </div>
                <div className="floating-card card-2">
                  <TrendingUp className="card-icon" />
                  <span>Progress: 85%</span>
                </div>
                <div className="floating-card card-3">
                  <MessageSquare className="card-icon" />
                  <span>New Message</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div
            className={`section-header ${
              isVisible.features ? "animate-in" : ""
            }`}
          >
            <h2>Why Choose Our Platform?</h2>
            <p>
              Discover the features that make learning effective and enjoyable
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  isVisible.features ? "animate-in" : ""
                }`}
                style={{ "--delay": `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Showcase */}
      <section className="students-section" id="students">
        <div className="container">
          <div
            className={`section-header ${
              isVisible.students ? "animate-in" : ""
            }`}
          >
            <h2>Our Success Stories</h2>
            <p>Meet the students who transformed their careers</p>
          </div>

          <div className="students-showcase">
            <div className="students-grid">
              <div
                className={`student-card large ${
                  isVisible.students ? "animate-in" : ""
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop"
                  alt="Student success story"
                />
                <div className="student-overlay">
                  <h3>From Zero to Full-Stack Developer</h3>
                  <p>
                    Alex completed our web development program and landed a $90k
                    job at a tech startup.
                  </p>
                </div>
              </div>

              <div
                className={`student-card ${
                  isVisible.students ? "animate-in delay-1" : ""
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop"
                  alt="Student learning"
                />
                <div className="student-overlay">
                  <h4>Career Switch Success</h4>
                  <p>
                    Maria transitioned from marketing to UX design in just 8
                    months.
                  </p>
                </div>
              </div>

              <div
                className={`student-card ${
                  isVisible.students ? "animate-in delay-2" : ""
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop"
                  alt="Team collaboration"
                />
                <div className="student-overlay">
                  <h4>Global Recognition</h4>
                  <p>
                    Our data science graduates work at Fortune 500 companies
                    worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div
            className={`section-header ${
              isVisible.testimonials ? "animate-in" : ""
            }`}
          >
            <h2>What Our Students Say</h2>
            <p>Real feedback from real learners</p>
          </div>

          <div className="testimonials-carousel">
            <div className="testimonial-container">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`testimonial-card ${
                    index === currentTestimonial ? "active" : ""
                  }`}
                >
                  <div className="testimonial-content">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p>"{testimonial.text}"</p>
                    <div className="testimonial-author">
                      <img src={testimonial.image} alt={testimonial.name} />
                      <div>
                        <h4>{testimonial.name}</h4>
                        <span>{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === currentTestimonial ? "active" : ""
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className={`cta-content ${isVisible.cta ? "animate-in" : ""}`}>
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>
              Join over 50,000 students who are already advancing their careers
            </p>
            <div className="cta-buttons">
              <NavLink
                to={"/courses"}
                className="btn-primary large link"
                style={{ marginBottom: "20px" }}
              >
                Get Started Today
                <ArrowRight size={24} />
              </NavLink>
              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>14-day free trial</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
