import "./adminCourses.scss";
import { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Search,
  Upload,
  Plus,
  Pen,
  Trash2,
} from "lucide-react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Models
import DeleteModal from "../../../components/global/deleteModal/DeleteModal";
import Spinner from "../../../components/global/spinner/Spinner";

// Dummy-Data
import { arSD, courseLevels } from "../../../dummyData";

// RTKQ & Context
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "../../../store/courses/courseSlice";
import { useTheme } from "../../../context/ThemeContext";
import toast from "react-hot-toast";

function AdminCourses() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  // RTKQ
  const {
    data: coursesResponse,
    isLoading,
    error,
    refetch,
  } = useGetCoursesQuery({ page, size: pageSize });
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Transformations
  const courses = coursesResponse?.data?.content || [];
  const totalItems = coursesResponse?.data?.totalItems || 0;

  // Get course level label
  const getCourseLevelLabel = (value) => {
    const level = courseLevels.find((l) => l.value === value);
    return level ? level.label : value;
  };

  // Action Buttons Component
  const ActionButtons = ({ params }) => {
    const menuRef = useRef(null);
    const { id, title } = params.row;
    const [localActiveMenu, setLocalActiveMenu] = useState(false);

    // Handle outside clicks
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setLocalActiveMenu(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle menu
    const toggleMenu = (e) => {
      e.stopPropagation();
      setLocalActiveMenu(!localActiveMenu);
    };

    // Handle delete click
    const handleDeleteClick = () => {
      setDeleteModal({
        isOpen: true,
        courseId: id,
        courseTitle: title,
      });
      setLocalActiveMenu(false);
    };

    return (
      <div className={`action-buttons ${isRTL ? "rtl" : ""} ${theme}`}>
        {/* Edit Button */}
        <NavLink
          to={`/admin/edit/${params.id}/course`}
          className="icon-button link"
        >
          <Pen className="icon" size={20} />
        </NavLink>

        {/* Dropdown Menu */}
        <div className="menu-container" ref={menuRef}>
          <button type="button" className="icon-button" onClick={toggleMenu}>
            <MoreHorizontal className="icon" size={20} />
          </button>

          {localActiveMenu && (
            <div className={`submenu ${isRTL ? "rtl" : ""}`}>
              {/* Delete Course */}
              <button
                className="submenu-item delete-item"
                onClick={handleDeleteClick}
              >
                {!isRTL && <Trash2 size={14} />}
                <span>{t("Delete Course")}</span>
                {isRTL && <Trash2 size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Columns
  const columns = [
    {
      field: "courseInfo",
      headerName: isRTL ? " الكورس" : "Course",
      width: 300,
      align: isRTL ? "right" : "left",
      renderCell: (params) => {
        const { courseImg, title, id } = params.row;
        return (
          <NavLink to={`/courses/${id}`} className="user-info-cell link">
            <img
              src={
                courseImg ||
                "https://cdn-icons-png.flaticon.com/128/3572/3572916.png"
              }
              alt={title}
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/128/3572/3572916.png";
              }}
            />
            <span>{title}</span>
          </NavLink>
        );
      },
    },
    {
      field: "userInfo",
      headerName: isRTL ? "المدرب" : "Instructor",
      width: 250,
      align: isRTL ? "right" : "left",
      pinned: isRTL ? "right" : "left",
      renderCell: (params) => {
        const { profileImageUrl, userFirstName } = params.row;
        return (
          <div className="user-info-cell">
            <img
              src={
                profileImageUrl ||
                "https://cdn-icons-png.flaticon.com/128/9187/9187604.png"
              }
              alt={userFirstName}
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/128/9187/9187604.png";
              }}
            />
            <span>{userFirstName}</span>
          </div>
        );
      },
    },
    {
      field: "shortDescription",
      headerName: isRTL ? "الوصف المختصر" : "Short Description",
      width: 250,
      align: isRTL ? "right" : "left",
    },
    {
      field: "estimatedDurationHours",
      headerName: isRTL ? "المدة (ساعات)" : "Duration (hrs)",
      width: 200,
      align: isRTL ? "right" : "left",
      renderCell: (params) => {
        return `${params.value || 0} hrs`;
      },
    },
    {
      field: "level",
      headerName: isRTL ? "المستوى" : "Level",
      width: 200,
      align: isRTL ? "right" : "left",
      renderCell: (params) => {
        const level = params.value;
        return (
          <span className="level-badge">{getCourseLevelLabel(level)}</span>
        );
      },
    },
    {
      field: "status",
      headerName: isRTL ? "الحالة" : "Status",
      width: 120,
      align: isRTL ? "right" : "left",
      renderCell: (params) => {
        const status = params.value;
        const isPublished = status === "PUBLISHED";
        return (
          <span
            className={`status-badge ${isPublished ? "published" : "draft"}`}
          >
            {isPublished ? t("Published") : t("Draft")}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: isRTL ? "الإجراءات" : "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => <ActionButtons params={params} />,
      align: isRTL ? "right" : "left",
      pinned: isRTL ? "left" : "right",
    },
  ];

  // Handle Export
  const handleExport = () => {
    const csvContent = [
      // Header
      columns
        .filter((col) => col.field !== "actions" && col.field !== "userInfo")
        .map((col) => col.headerName)
        .join(","),
      // Data rows
      ...filteredRows.map((row) =>
        columns
          .filter((col) => col.field !== "actions" && col.field !== "userInfo")
          .map((col) => {
            let value = row[col.field];
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "courses.csv";
    link.click();
  };

  // Handle Search
  const filteredRows = courses.filter((row) => {
    const searchStr = searchText.toLowerCase();
    return (
      row.title?.toLowerCase().includes(searchStr) ||
      row.shortDescription?.toLowerCase().includes(searchStr) ||
      row.username?.toLowerCase().includes(searchStr)
    );
  });

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteCourse(deleteModal.courseId).unwrap();
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: "" });
      toast.success("Deleted Success 🤩");
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Error Delete !!");
    }
  };

  // Handle Delete Cancel
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, courseId: null, courseTitle: "" });
  };

  // Handle pagination change
  const handlePaginationModelChange = (model) => {
    setPage(model.page + 1); // DataGrid uses 0-based indexing
    setPageSize(model.pageSize);
  };

  // Loading && Error
  if (isLoading)
    return (
      <div style={{ marginTop: "25%" }}>
        <Spinner size={30} text="Loding Courses.." />
      </div>
    );
  if (error) {
    return (
      <div className="error-container">
        <p>{t("Failed to load courses. Please try again.")}</p>
        <button onClick={() => refetch()}>{t("Retry")}</button>
      </div>
    );
  }

  return (
    <div className={`adminCourses ${isRTL ? "rtl" : ""}`}>
      {/* Header */}
      <div className="header-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder={t(
              "Search by Course Title, Description, or Instructor"
            )}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="action-section">
          <button className="export-btn" onClick={handleExport}>
            <Upload size={18} />
            {t("Export All")}
          </button>
          <NavLink to="/admin/create/course" className="new-course-btn link">
            <Plus size={20} />
            {t("New Course")}
          </NavLink>
        </div>
      </div>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          margin: "20px 0",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}
        className="data-grid-paper"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
          getRowHeight={() => "auto"}
          paginationMode="server"
          rowCount={totalItems}
          paginationModel={{ page: page - 1, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          showColumnVerticalBorder
          showCellVerticalBorder
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-pinnedColumns": {
              boxShadow: 2,
              backgroundColor: "#fff",
            },
            "& .MuiDataGrid-pinnedColumnHeaders": {
              boxShadow: 2,
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-row--lastVisible": {
              "& .MuiDataGrid-cell--pinned": {
                boxShadow: 2,
              },
            },
          }}
          localeText={
            isRTL
              ? arSD.components.MuiDataGrid.defaultProps.localeText
              : undefined
          }
          pinnedColumns={{
            left: isRTL ? [] : ["userInfo"],
            right: isRTL ? ["userInfo"] : ["actions"],
          }}
        />
      </Paper>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title={t("Delete Course")}
        message={
          t("Are you sure you want to delete the course") +
          ` "${deleteModal.courseTitle}"?`
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminCourses;
