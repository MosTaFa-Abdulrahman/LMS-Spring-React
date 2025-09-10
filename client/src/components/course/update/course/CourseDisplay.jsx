export const CourseDisplay = ({ course }) => (
  <div className="course-display">
    <div className="course-display__image">
      {course.courseImg && <img src={course.courseImg} alt={course.title} />}
    </div>
    <div className="course-display__info">
      <h2>{course.title}</h2>
      <p className="description">{course.description}</p>
      <p className="short-description">{course.shortDescription}</p>
      <div className="meta">
        <span className="level">{course.level}</span>
        <span className="duration">{course.estimatedDurationHours}h</span>
        <span
          className={`published ${
            course.isPublished ? "published--yes" : "published--no"
          }`}
        >
          {course.isPublished ? "Published" : "Draft"}
        </span>
      </div>
    </div>
  </div>
);
