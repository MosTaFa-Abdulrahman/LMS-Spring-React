import "./adminUsers.scss";
import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Search, Trash2 } from "lucide-react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Models
import DeleteModal from "../../../components/global/deleteModal/DeleteModal";
import Spinner from "../../../components/global/spinner/Spinner";

// Dummy-Data
import { arSD } from "../../../dummyData";

// RTKQ & Context
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../../store/users/userSlice";
import { useTheme } from "../../../context/ThemeContext";
import toast from "react-hot-toast";

function AdminUsers() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
  });

  // RTKQ
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({ page, size: pageSize });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Transformations
  const users = usersResponse?.data?.content || [];
  const totalItems = usersResponse?.data?.totalItems || 0;

  // Action Buttons Component
  const ActionButtons = ({ params }) => {
    const menuRef = useRef(null);
    const { id } = params.row;
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
        userId: id,
      });
      setLocalActiveMenu(false);
    };

    return (
      <div className={`action-buttons ${isRTL ? "rtl" : ""} ${theme}`}>
        {/* Dropdown Menu */}
        <div className="menu-container" ref={menuRef}>
          <button type="button" className="icon-button" onClick={toggleMenu}>
            <MoreHorizontal className="icon" size={20} />
          </button>

          {localActiveMenu && (
            <div className={`submenu ${isRTL ? "rtl" : ""}`}>
              {/* Delete User */}
              <button
                className="submenu-item delete-item"
                onClick={handleDeleteClick}
              >
                {!isRTL && <Trash2 size={14} />}
                <span>{t("Delete User")}</span>
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
      field: "userInfo",
      headerName: isRTL ? "المستخدم" : "User",
      width: 400,
      align: isRTL ? "right" : "left",
      pinned: isRTL ? "right" : "left",
      renderCell: (params) => {
        const { id, profileImageUrl, firstName, lastName } = params.row;
        return (
          <NavLink to={`/users/${id}`} className="user-info-cell link">
            <img
              src={
                profileImageUrl ||
                "https://cdn-icons-png.flaticon.com/128/9187/9187604.png"
              }
              alt={firstName}
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/128/9187/9187604.png";
              }}
            />
            <span>
              {firstName} {lastName}
            </span>
          </NavLink>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: isRTL ? " رقم الهاتف" : "Phone Number",
      width: 250,
      align: isRTL ? "right" : "left",
    },
    {
      field: "fatherPhoneNumber",
      headerName: isRTL ? "هاتف ولي الامر" : "Father Phone Number",
      width: 250,
      align: isRTL ? "right" : "left",
    },
    {
      field: "level",
      headerName: isRTL ? "المستوي" : "Level",
      width: 220,
      align: isRTL ? "right" : "left",
    },
    {
      field: "role",
      headerName: isRTL ? "الدور" : "Role",
      width: 200,
      align: isRTL ? "right" : "left",
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

  // Handle Search
  const filteredRows = users.filter((row) => {
    const searchStr = searchText.toLowerCase();
    return (
      row.firstName?.toLowerCase().includes(searchStr) ||
      row.phoneNumber?.toLowerCase().includes(searchStr) ||
      row.fatherPhoneNumber?.toLowerCase().includes(searchStr)
    );
  });

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteModal.userId).unwrap();
      setDeleteModal({ isOpen: false, userId: null });
      toast.success("Deleted Success 🤩");
    } catch (error) {
      console.error("Failed to delete User:", error);
      toast.error("Error Delete !!");
    }
  };

  // Handle Delete Cancel
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null });
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
        <Spinner size={30} text="Loding Users.." />
      </div>
    );
  if (error) {
    return (
      <div className="error-container">
        <p>{t("Failed to load users. Please try again.")}</p>
        <button onClick={() => refetch()}>{t("Retry")}</button>
      </div>
    );
  }

  return (
    <div className={`adminUsers ${isRTL ? "rtl" : ""}`}>
      {/* Header */}
      <div className="header-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder={t(
              "Search by firstName, phoneNumber, or fatherPhoneNumber"
            )}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
        title={t("Delete User")}
        message={t("Are you sure you want to delete the user")}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminUsers;
