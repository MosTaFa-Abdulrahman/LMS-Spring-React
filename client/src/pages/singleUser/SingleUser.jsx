import "./singleUser.scss";
import {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  BookOpen,
  Search,
  Plus,
  Calendar,
  DollarSign,
  GraduationCap,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/global/spinner/Spinner";

// RTKQ & Context
import { AuthContext } from "../../context/AuthContext";
import { useGetUserByIdQuery } from "../../store/users/userSlice";
import { useSearchCoursesQuery } from "../../store/courses/courseSlice";
import {
  useCreateEnrollmentMutation,
  useGetEnrollmentsQuery,
} from "../../store/enrollments/enrollmentSlice";
import toast from "react-hot-toast";

function SingleUser() {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [enrollmentAmount, setEnrollmentAmount] = useState("");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  // Refs for debouncing
  const debounceTimerRef = useRef(null);

  // userId from URL params
  const { userId } = useParams();

  // RTKQ & Context
  const { currentUser: userData } = useContext(AuthContext);
  const currentUser = userData.userInfo;
  const {
    data: userResponse,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByIdQuery(userId);
  const {
    data: enrollmentsResponse,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useGetEnrollmentsQuery({ userId, page, size: pageSize });
  const {
    data: searchResponse,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchCoursesQuery(
    { title: debouncedSearchTerm, page: searchPage, size: 10 },
    { skip: !debouncedSearchTerm }
  );

  // Create enrollment mutation
  const [createEnrollment, { isLoading: creatingEnrollment }] =
    useCreateEnrollmentMutation();

  // Debounce effect for search term
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSearchPage(1); // Reset to first page when search term changes
    }, 500); // 500ms delay

    // Cleanup timer on component unmount or when searchTerm changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Data transformations
  const user = userResponse;
  const enrollments = enrollmentsResponse?.data?.content || [];
  const hasNext = enrollmentsResponse?.data?.hasNext || false;
  const totalItems = enrollmentsResponse?.data?.totalItems || 0;
  const searchCourses = searchResponse?.data?.content || [];

  // Function to get enrolled sections for an enrollment
  const getEnrolledSections = useCallback((enrollment) => {
    if (!enrollment || !enrollment.course || !enrollment.course.sections) {
      return [];
    }

    const { amountPaid } = enrollment;
    const { sections } = enrollment.course;

    // Sort sections by sortOrder to ensure correct calculation
    const sortedSections = [...sections].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    let remainingAmount = amountPaid;
    const enrolledSections = [];

    for (const section of sortedSections) {
      if (remainingAmount >= section.price) {
        enrolledSections.push({
          ...section,
          isEnrolled: true,
          isPaid: true,
        });
        remainingAmount -= section.price;
      } else {
        // If there's some remaining amount but not enough for full section
        // You might want to handle partial payments differently
        break;
      }
    }

    return enrolledSections;
  }, []);

  // Enhanced enrollments with enrolled sections
  const enhancedEnrollments = useMemo(() => {
    return enrollments.map((enrollment) => ({
      ...enrollment,
      enrolledSections: getEnrolledSections(enrollment),
    }));
  }, [enrollments, getEnrolledSections]);

  // Handle search input change
  const handleSearchInputChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle search (kept for backward compatibility but now just updates search term)
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowSearchModal(false);
    setShowEnrollmentModal(true);
  };

  // Handle section selection
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setEnrollmentAmount(section.price.toString());
  };

  // Handle create enrollment
  const handleCreateEnrollment = async () => {
    if (!selectedSection || !enrollmentAmount) return;

    try {
      await createEnrollment({
        amountPaid: parseFloat(enrollmentAmount),
        userId: userId,
        sectionId: selectedSection.id,
      }).unwrap();
      toast.success("Enrolled Success 🤩");

      // Reset modal states
      setShowEnrollmentModal(false);
      setSelectedCourse(null);
      setSelectedSection(null);
      setEnrollmentAmount("");

      // Refetch enrollments
      // refetchEnrollments();
    } catch (error) {
      toast.error("You can not enroll twice pro 🙄");
      console.error("Failed to create enrollment:", error);
    }
  };

  // Reset search when modal closes
  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSearchPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading states
  if (userLoading && enrollmentsLoading) {
    return (
      <div style={{ marginTop: "40%" }}>
        <Spinner size={30} text="Loading User Data..." />
      </div>
    );
  }

  // Error states
  if (userError || enrollmentsError) {
    return (
      <div className="error-container">
        <AlertCircle className="error-icon" />
        <p>Error Loading Data OR ((USER NOT FOUND))</p>
        {/* <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button> */}
      </div>
    );
  }

  return (
    <div className="single-user-container">
      {/* User Info Section */}
      <div className="user-info-section">
        <div className="user-header">
          <div className="user-avatar">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" />
            ) : (
              <User className="avatar-icon" />
            )}
          </div>
          <div className="user-details">
            <h1>
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="user-meta">
              <div className="meta-item">
                <Mail className="meta-icon" />
                <span>{user?.email}</span>
              </div>
              {user?.phoneNumber && (
                <div className="meta-item">
                  <Phone className="meta-icon" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="meta-item">
                <Shield className="meta-icon" />
                <span
                  className={`role-badge role-${user?.role?.toLowerCase()}`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-stats">
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{totalItems}</span>
              <span className="stat-label">Total Enrollments</span>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">
                {enrollments.filter((e) => e.status === "ACTIVE").length}
              </span>
              <span className="stat-label">Active Courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      {(currentUser.role === "ADMIN" || currentUser.role === "INSTRUCTOR") && (
        <div className="actions-section">
          <button
            className="primary-button"
            onClick={() => setShowSearchModal(true)}
          >
            <Plus className="button-icon" />
            Add New Enrollment
          </button>
        </div>
      )}

      {/* Enrollments Section */}
      <div className="enrollments-section">
        <div className="section-header">
          <h2>Enrollments</h2>
          <span className="section-count">{totalItems} total</span>
        </div>

        {enrollmentsLoading ? (
          <div className="loading-container">
            <Spinner size={20} text="Loading enrollments..." />
          </div>
        ) : enhancedEnrollments.length === 0 ? (
          <div className="empty-state">
            <BookOpen className="empty-icon" />
            <p>No enrollments found</p>
          </div>
        ) : (
          <div className="enrollments-grid">
            {enhancedEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="enrollment-card">
                <div className="card-header">
                  <div className="course-image">
                    <img
                      src={enrollment.course.courseImg}
                      alt={enrollment.course.title}
                    />
                  </div>
                  <div className="course-info">
                    <h3>{enrollment.course.title}</h3>
                    <span
                      className={`level-badge level-${enrollment.course.level
                        .toLowerCase()
                        .replace("_", "-")}`}
                    >
                      {enrollment.course.level.replace("_", " ")}
                    </span>
                  </div>
                  <div
                    className={`status-badge status-${enrollment.status.toLowerCase()}`}
                  >
                    {enrollment.status}
                  </div>
                </div>

                <div className="card-content">
                  <div className="enrollment-meta">
                    <div className="meta-row">
                      <Calendar className="meta-icon" />
                      <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                    </div>
                    <div className="meta-row">
                      <DollarSign className="meta-icon" />
                      <span>Amount Paid: ${enrollment.amountPaid}</span>
                    </div>
                  </div>

                  {/* Enrolled Sections Only */}
                  <div className="sections-info">
                    <h4>
                      Enrolled Sections ({enrollment.enrolledSections.length})
                    </h4>
                    {enrollment.enrolledSections.length === 0 ? (
                      <div className="no-sections">
                        <Lock className="lock-icon" />
                        <p>No sections unlocked yet</p>
                      </div>
                    ) : (
                      <div className="sections-grid">
                        {enrollment.enrolledSections
                          .slice(0, 6)
                          .map((section) => (
                            <div
                              key={section.id}
                              className="section-item enrolled"
                            >
                              <div className="section-header">
                                <span className="section-order">
                                  {section.sortOrder}
                                </span>
                                <CheckCircle className="enrolled-icon" />
                              </div>
                              <span className="section-title">
                                {section.title}
                              </span>
                              <span className="section-price">
                                ${section.price}
                              </span>
                            </div>
                          ))}
                        {enrollment.enrolledSections.length > 6 && (
                          <div className="sections-more">
                            +{enrollment.enrolledSections.length - 6} more
                            enrolled sections
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {hasNext && (
          <div className="pagination-section">
            <button
              className="load-more-button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={enrollmentsLoading}
            >
              {enrollmentsLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={handleCloseSearchModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Search Courses</h3>
              <button className="close-button" onClick={handleCloseSearchModal}>
                <X />
              </button>
            </div>

            <div className="search-section">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search courses by title..."
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="search-input"
                />
                {searchTerm && searchTerm !== debouncedSearchTerm && (
                  <div className="search-indicator">
                    <span className="searching-text">Searching...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="search-results">
              {searchLoading ? (
                <div className="loading-container">
                  <Spinner size={20} text="Searching courses..." />
                </div>
              ) : searchCourses.length === 0 ? (
                <div className="empty-search">
                  <p>
                    {debouncedSearchTerm
                      ? "No courses found"
                      : "Start typing to search courses"}
                  </p>
                </div>
              ) : (
                <div className="courses-list">
                  {searchCourses.map((course) => (
                    <div
                      key={course.id}
                      className="course-item"
                      onClick={() => handleCourseSelect(course)}
                    >
                      <div className="course-image">
                        <img src={course.courseImg} alt={course.title} />
                      </div>
                      <div className="course-details">
                        <h4>{course.title}</h4>
                        <span className="course-level">
                          {course.level.replace("_", " ")}
                        </span>
                        <span className="sections-count">
                          {course.sections.length} sections
                        </span>
                      </div>
                      <ChevronRight className="arrow-icon" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && selectedCourse && (
        <div
          className="modal-overlay"
          onClick={() => setShowEnrollmentModal(false)}
        >
          <div
            className="modal-content enrollment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create Enrollment</h3>
              <button
                className="close-button"
                onClick={() => setShowEnrollmentModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="enrollment-form">
              <div className="selected-course">
                <h4>{selectedCourse.title}</h4>
                <span className="course-level">
                  {selectedCourse.level.replace("_", " ")}
                </span>
              </div>

              <div className="sections-selection">
                <h5>Select Section:</h5>
                <div className="sections-list">
                  {selectedCourse.sections.map((section) => (
                    <div
                      key={section.id}
                      className={`section-option ${
                        selectedSection?.id === section.id ? "selected" : ""
                      }`}
                      onClick={() => handleSectionSelect(section)}
                    >
                      <div className="section-info">
                        <span className="section-order">
                          {section.sortOrder}
                        </span>
                        <span className="section-title">{section.title}</span>
                      </div>
                      <span className="section-price">${section.price}</span>
                      {selectedSection?.id === section.id && (
                        <Check className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedSection && (
                <div className="amount-section">
                  <label htmlFor="amount">Amount to Pay:</label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={enrollmentAmount}
                    onChange={(e) => setEnrollmentAmount(e.target.value)}
                    className="amount-input"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() => setShowEnrollmentModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleCreateEnrollment}
                  disabled={
                    !selectedSection || !enrollmentAmount || creatingEnrollment
                  }
                >
                  {creatingEnrollment ? "Creating..." : "Create Enrollment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleUser;
