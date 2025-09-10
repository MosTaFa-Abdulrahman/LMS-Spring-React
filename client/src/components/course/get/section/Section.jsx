import "./section.scss";
import { useState, useEffect, useContext } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

// Components
import Video from "../../get/video/Video";
import File from "../../get/file/File";
import Spinner from "../../../global/spinner/Spinner";

// RTKQ & Context
import { useGetSectionsQuery } from "../../../../store/sections/sectionSlice";
import { AuthContext } from "../../../../context/AuthContext";
import Modal from "../../../global/modal/Modal";

function Section({ courseId, courseHours }) {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allSections, setAllSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [loadingMore, setLoadingMore] = useState(false);

  // RTKQ & Context
  const { currentUser: userData } = useContext(AuthContext);
  const userEnrollments = userData?.enrollments || [];

  const {
    data: sectionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetSectionsQuery({ courseId, page, size: pageSize });

  // Function to check if user has permission for a specific section
  const checkSectionPermission = (sectionId) => {
    if (!userEnrollments || !Array.isArray(userEnrollments)) {
      return false;
    }

    // Find enrollment for the current course
    const courseEnrollment = userEnrollments.find(
      (enrollment) =>
        enrollment.course.id === courseId &&
        enrollment.status === "ACTIVE" &&
        enrollment.isEnrolled === true
    );

    if (!courseEnrollment) {
      return false;
    }

    // Check if the section exists in the enrolled course
    const hasSection = courseEnrollment.course.sections.some(
      (section) => section.id === sectionId
    );

    return hasSection;
  };

  // Alternative approach: Check if user paid for this specific section
  const checkSectionPayment = (sectionId, sectionPrice) => {
    if (!userEnrollments || !Array.isArray(userEnrollments)) {
      return false;
    }

    // Find enrollment for the current course
    const courseEnrollment = userEnrollments.find(
      (enrollment) =>
        enrollment.course.id === courseId &&
        enrollment.status === "ACTIVE" &&
        enrollment.isEnrolled === true
    );

    if (!courseEnrollment) {
      return false;
    }

    // Check if user paid enough for this section
    // This is a simple check - you might need more complex logic
    const paidAmount = courseEnrollment.amountPaid;

    // Find the section in the course to get its sort order
    const section = courseEnrollment.course.sections.find(
      (s) => s.id === sectionId
    );
    if (!section) return false;

    // Calculate expected payment (all sections up to this one)
    const sectionsUpToThis = courseEnrollment.course.sections
      .filter((s) => s.sortOrder <= section.sortOrder)
      .reduce((total, s) => total + s.price, 0);

    return paidAmount >= sectionsUpToThis;
  };

  // Update sections when new data comes
  useEffect(() => {
    if (sectionsResponse?.data?.content) {
      const sectionsWithPermissions = sectionsResponse.data.content.map(
        (section) => ({
          ...section,
          hasPermission: checkSectionPayment(section.id, section.price),
          // Alternative: use checkSectionPermission(section.id) for simple course enrollment check
        })
      );

      if (page === 1) {
        setAllSections(sectionsWithPermissions);
      } else {
        setAllSections((prev) => [...prev, ...sectionsWithPermissions]);
      }
      setLoadingMore(false);
    }
  }, [sectionsResponse, page, userEnrollments, courseId]);

  // Transformations
  const hasNext = sectionsResponse?.data?.hasNext || false;
  const totalItems = sectionsResponse?.data?.totalItems || 0;
  const totalSections = allSections.length;

  // Load more sections
  const loadMore = () => {
    if (hasNext && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading && page === 1) {
    return <Spinner size={30} text="Loading Sections..." />;
  }
  if (error) {
    return (
      <div className="error-container">
        <p>Error loading sections</p>
        <button onClick={refetch} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="section-container">
      {/* Course Content Header */}
      <div className="sections-header" style={{ marginBottom: "15px" }}>
        <div className="sections-info">
          <h2>Course content</h2>
          <div className="sections-stats">
            <span>
              {totalSections} section{totalSections !== 1 ? "s" : ""}
            </span>
            <span className="separator" style={{ margin: "0px 5px" }}>
              •
            </span>
            <span className="total-duration">{courseHours} hours</span>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="sections-list">
        {allSections.map((section, index) => {
          const isExpanded = expandedSections.has(section.id);

          return (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              isExpanded={isExpanded}
              onToggle={() => toggleSection(section.id)}
              hasPermission={section.hasPermission}
            />
          );
        })}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="load-more-container">
          <button
            onClick={loadMore}
            className="load-more-button"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <div className="loading-content">
                <Spinner size={16} />
                Loading more sections...
              </div>
            ) : (
              `Show more sections (${totalSections} of ${totalItems})`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Section Item Component
function SectionItem({ section, index, isExpanded, onToggle, hasPermission }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="section-itemm">
      <div className="section-headerr" onClick={onToggle}>
        <div className="section-toggle">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        <div className="section-info">
          <h3 className="section-title">
            Section {section.sortOrder}: {section.title}
            {!hasPermission && (
              <div className="purchase-section">
                <p className="price-info">Price: ${section.price}</p>
                <button
                  className="purchase-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent section toggle when clicking purchase
                    setOpen(true);
                  }}
                >
                  Purchase Section
                </button>
                <span className="lock-indicator">🔒</span>
              </div>
            )}
          </h3>

          {/* Modal For Payment */}
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Pay For Section"
          >
            <p>
              You must pay on this number: <strong>01098893166</strong>
            </p>
          </Modal>

          <div className="section-meta">
            {/* Must be how many videos belongs to this Section 😎 */}
            {/* <span className="section-lectures">8 lectures</span> */}
            {/* <span className="separator">•</span> */}
            <span className="section-duration">
              <Clock size={14} />
              {section.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Section Content*/}
      {isExpanded && (
        <div className="section-content">
          <div className="section-description">
            <p>{section.description}</p>
          </div>

          {/* Videos and Files */}
          <div className="section-materials">
            <Video sectionId={section.id} />
            <File sectionId={section.id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Section;
