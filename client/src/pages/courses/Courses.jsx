import "./courses.scss";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Clock,
  Star,
  ArrowRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/global/spinner/Spinner";

// RTKQ
import { useGetCoursesQuery } from "../../store/courses/courseSlice";
import toast from "react-hot-toast";

function Courses() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const pageSize = 12;

  const {
    data: coursesData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetCoursesQuery({
    page: currentPage,
    size: pageSize,
  });

  // Handle infinite scroll observer
  const lastCourseElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore || isFetching || !useInfiniteScroll)
        return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && coursesData?.data?.hasNext) {
            setIsLoadingMore(true);
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [
      isLoading,
      isLoadingMore,
      isFetching,
      coursesData?.data?.hasNext,
      useInfiniteScroll,
    ]
  );

  // Handle Load More button click
  const handleLoadMore = () => {
    if (coursesData?.data?.hasNext && !isLoadingMore && !isFetching) {
      setIsLoadingMore(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Update courses when new data arrives - with duplicate prevention
  useEffect(() => {
    if (coursesData?.data?.content) {
      if (currentPage === 1) {
        setAllCourses(coursesData.data.content);
      } else {
        setAllCourses((prev) => {
          // Create a Map to track existing course IDs for better performance
          const existingCourseMap = new Map(
            prev.map((course) => [course.id, course])
          );

          // Filter out duplicates from new courses and add only unique ones
          const newUniqueCourses = coursesData.data.content.filter(
            (course) => !existingCourseMap.has(course.id)
          );

          return [...prev, ...newUniqueCourses];
        });
      }
      setIsLoadingMore(false);
    }
  }, [coursesData, currentPage]);

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load courses");
      setIsLoadingMore(false);
    }
  }, [isError, error]);

  // Reset pagination when search or filter changes
  useEffect(() => {
    // Only reset if we have courses loaded and filters actually changed
    if (allCourses.length > 0) {
      // Don't reset pagination for client-side filtering
      // setCurrentPage(1);
      // setAllCourses([]);
    }
  }, [searchTerm, selectedLevel]);

  // Filter courses based on search and level (client-side filtering)
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.userFirstName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const formatLevel = (level) => {
    return level
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${Math.round(hours * 10) / 10}h`;
  };

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (isLoading && currentPage === 1) {
    return (
      <div className="courses-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Hero Section */}
      <div className="courses-hero">
        <div
          className="hero-content"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h1 className="hero-title">
            Discover Amazing
            <span className="gradient-text"> Courses</span>
          </h1>
          <p className="hero-subtitle">
            Unlock your potential with our curated collection of premium courses
          </p>

          {/* Search and Filters */}
          <div className="search-filters">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-box">
              <Filter className="filter-icon" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Levels</option>
                <option value="PRIMARY_GRADE_1">Primary Grade 1</option>
                <option value="PRIMARY_GRADE_2">Primary Grade 2</option>
                <option value="PRIMARY_GRADE_3">Primary Grade 3</option>
                <option value="PRIMARY_GRADE_4">Primary Grade 4</option>
                <option value="PRIMARY_GRADE_5">Primary Grade 5</option>
                <option value="PRIMARY_GRADE_6">Primary Grade 6</option>
                <option value="PREPARATORY_GRADE_1">Preparatory Grade 1</option>
                <option value="PREPARATORY_GRADE_2">Preparatory Grade 2</option>
                <option value="PREPARATORY_GRADE_3">Preparatory Grade 3</option>
                <option value="SECONDARY_GRADE_1">Secondary Grade 1</option>
                <option value="SECONDARY_GRADE_2">Secondary Grade 2</option>
                <option value="SECONDARY_GRADE_3">Secondary Grade 3</option>
              </select>
            </div>
          </div>

          {/* Toggle between infinite scroll and load more button */}
          <div className="scroll-toggle">
            {/* <label className="toggle-label">
              <input
                type="checkbox"
                checked={useInfiniteScroll}
                onChange={(e) => setUseInfiniteScroll(e.target.checked)}
              />
              <span>Use Infinite Scroll</span>
            </label> */}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hero-decorations">
          <div className="floating-card card-1"></div>
          <div className="floating-card card-2"></div>
          <div className="floating-card card-3"></div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-content">
        <div className="courses-stats">
          <p className="stats-text">
            {coursesData?.data?.totalItems || 0} courses available
            {filteredCourses.length !== allCourses.length &&
              ` (${filteredCourses.length} shown)`}
          </p>
        </div>

        <div className="courses-grid">
          {filteredCourses?.map((course, index) => {
            const isLast = filteredCourses.length === index + 1;
            return (
              <div
                key={course.id}
                ref={isLast && useInfiniteScroll ? lastCourseElementRef : null}
                className="course-card"
              >
                <div className="card-image-container">
                  <img
                    src={course.courseImg}
                    alt={course.title}
                    className="card-image"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
                    }}
                  />
                  <div className="card-overlay">
                    <div className="card-level">
                      {formatLevel(course.level)}
                    </div>
                  </div>
                  <div className="hover-overlay">
                    <NavLink
                      to={`/courses/${course.id}`}
                      className="view-course-btn"
                    >
                      <span>View Course</span>
                      <ArrowRight className="btn-icon" />
                    </NavLink>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-description">{course.shortDescription}</p>

                  <div className="card-meta">
                    <div className="instructor-info">
                      <img
                        src={course.profileImageUrl}
                        alt={course.userFirstName}
                        className="instructor-avatar"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
                        }}
                      />
                      <span className="instructor-name">
                        {course.userFirstName} {course.userLastName}
                      </span>
                    </div>

                    <div className="course-stats">
                      <div className="stat-item">
                        <Clock className="stat-icon" />
                        <span>
                          {formatDuration(course.estimatedDurationHours)}
                        </span>
                      </div>
                      <div className="stat-item">
                        <Star className="stat-icon" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glow"></div>
              </div>
            );
          })}
        </div>

        {/* Load More Button - shown when infinite scroll is disabled or as fallback */}
        {!useInfiniteScroll && coursesData?.data?.hasNext && (
          <div className="load-more-container">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore || isFetching}
              className="load-more-btn"
            >
              {isLoadingMore || isFetching ? (
                <>
                  <Spinner />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More Courses</span>
                  <ChevronDown className="btn-icon" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading More Indicator for Infinite Scroll */}
        {useInfiniteScroll &&
          (isLoadingMore || isFetching) &&
          coursesData?.data?.hasNext && (
            <div className="loading-more">
              <Spinner />
              <p>Loading more courses...</p>
            </div>
          )}

        {/* No More Courses */}
        {!coursesData?.data?.hasNext && allCourses.length > 0 && (
          <div className="no-more-courses">
            <p>🎉 You've seen all available courses!</p>
          </div>
        )}

        {/* No Results */}
        {filteredCourses.length === 0 &&
          !isLoading &&
          allCourses.length > 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

        {/* No Courses at All */}
        {allCourses.length === 0 && !isLoading && (
          <div className="no-results">
            <div className="no-results-icon">📚</div>
            <h3>No courses available</h3>
            <p>Check back later for new courses</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
