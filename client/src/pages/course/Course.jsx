import "./course.scss";
import { useParams } from "react-router-dom";
import Spinner from "../../components/global/spinner/Spinner";

// Components
import Section from "../../components/course/get/section/Section";

// RTKQ
import { useGetCourseByIdQuery } from "../../store/courses/courseSlice";

function Course() {
  const { id } = useParams();

  // RTKQ
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(id);

  if (courseLoading)
    return (
      <div style={{ marginTop: "20%" }}>
        <Spinner size={40} text="Loading Course..." />
      </div>
    );
  if (courseError)
    return <div className="error-message">Error loading course</div>;
  if (!course) return <div className="error-message">Course not found</div>;

  return (
    <div className="course-container">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-hero">
          <div className="course-info">
            <h1 className="course-title">{course.title}</h1>
            <p className="course-short-desc">{course.shortDescription}</p>

            <div className="course-meta">
              <div className="rating">
                <span className="rating-number">4.6</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < 4 ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-count">(2,847 ratings)</span>
              </div>

              <div className="students-count">12,543 students</div>
            </div>

            <div className="instructor-info">
              <span className="created-by">Created by</span>
              <div className="instructor">
                <img
                  src={course.profileImageUrl}
                  alt={`${course.userFirstName} ${course.userLastName}`}
                  className="instructor-avatar"
                />
                <span className="instructor-name">
                  {course.userFirstName} {course.userLastName}
                </span>
              </div>
            </div>
          </div>

          {/* Course Purchase Card */}
          <div className="course-purchase-card">
            <div className="course-preview">
              <img
                src={course?.courseImg}
                alt={course.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
                }}
              />
              <div className="play-overlay">
                <button className="play-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="purchase-content">
              {/* <button className="buy-now-btn">Buy Now</button> */}

              <div className="course-includes">
                <h4>This course includes:</h4>
                <ul>
                  <li>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                    {course.estimatedDurationHours} hours on-demand video
                  </li>
                  <li>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    Downloadable resources
                  </li>
                  <li>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                    </svg>
                    Full lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content">
        <div className="content-wrapper">
          <div className="main-content">
            {/* Course Curriculum - This is where Section component goes */}
            <div className="course-curriculum">
              <Section
                courseId={id}
                courseHours={course.estimatedDurationHours}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;
