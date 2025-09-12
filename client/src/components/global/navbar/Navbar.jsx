import "./navbar.scss";
import { useRef, useEffect, useContext, useState, useCallback } from "react";
import {
  Home,
  BookOpen,
  User,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Context
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import toast from "react-hot-toast";

function Navbar() {
  const { currentUser: userData, logout } = useContext(AuthContext);
  const currentUser = userData?.userInfo;
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);

  // Refs for click outside detection
  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const themeMenuRef = useRef();

  const themes = [
    { value: "theme-light", label: "Light", icon: Sun },
    { value: "theme-dark", label: "Dark", icon: Moon },
    { value: "theme-cyber", label: "Cyber", icon: Zap },
  ];

  // Memoized click outside handler
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
      setMobileMenuOpen(false);
      setActiveSubmenu(null);
    }
    if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
      setThemeMenuOpen(false);
    }
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
      setActiveSubmenu(null);
    }
  }, [window.location.pathname]);

  // Handle protected routes
  const handleProtectedRoute = useCallback(
    (e, path) => {
      if (!currentUser) {
        e.preventDefault();
        navigate("/auth");
        return false;
      }
      return true;
    },
    [currentUser, navigate]
  );

  // User Menu
  const baseMenuItems = [
    {
      icon: <Home />,
      label: "Home",
      path: "/",
    },
    {
      icon: <User />,
      label: "User",
      requiresAuth: true,
      onClick: handleProtectedRoute,
      submenu: [
        { label: "Courses", path: "/courses" },
        { label: "Quizzes", path: "/quizzes" },
        { label: "Posts", path: "/posts" },
      ],
    },
  ];

  // Admin menu
  const adminMenuItem = {
    icon: <ShieldCheck />,
    label: "Admin",
    requiresAuth: true,
    requiresRole: "ADMIN" || "INSTRUCTOR",
    submenu: [
      { label: "All Courses", path: "/admin/courses" },
      { label: "All Users", path: "/admin/users" },
      { label: "All Quizzes", path: "/quizzes" },
    ],
  };

  // Build menu items based on user permissions
  const buildMenuItems = useCallback(() => {
    let menuItems = [...baseMenuItems];

    if (
      (currentUser && currentUser?.role === "ADMIN") ||
      currentUser?.role === "INSTRUCTOR"
    ) {
      menuItems.push(adminMenuItem);
    }

    return menuItems;
  }, [currentUser]);

  const menuItems = buildMenuItems();

  // Event handlers
  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    setActiveSubmenu(null);
  };
  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };
  const toggleThemeMenu = () => setThemeMenuOpen(!isThemeMenuOpen);

  // Get current theme info
  const currentThemeInfo = themes.find((t) => t.value === theme) || themes[0];
  const CurrentThemeIcon = currentThemeInfo.icon;

  // Enhanced logout handler with better error handling
  const handleLogout = async () => {
    try {
      setUserMenuOpen(false);
      logout();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleThemeSelect = (themeValue) => {
    toggleTheme(themeValue);
    setThemeMenuOpen(false);
  };

  // Enhanced menu item click handler
  const handleMenuItemClick = (e, item, isMobile = false) => {
    // Handle authentication requirements
    if (item.requiresAuth && !currentUser) {
      e.preventDefault();
      navigate("/auth");
      return;
    }

    // Handle role requirements
    if (item.requiresRole && currentUser?.role !== item.requiresRole) {
      e.preventDefault();
      toast.error("Access denied");
      return;
    }

    // Handle custom onClick
    if (item.onClick && !item.onClick(e, item.path)) {
      return;
    }

    // Handle submenu toggle
    if (item.submenu) {
      e.preventDefault();
      if (isMobile) {
        toggleSubmenu(menuItems.indexOf(item));
      }
      return;
    }

    // Close mobile menu on navigation
    if (isMobile) {
      setMobileMenuOpen(false);
      setActiveSubmenu(null);
    }
  };

  return (
    <header className={`header ${theme}`}>
      {/* Logo Section */}
      <div className="logo-section">
        <NavLink to="/" className="logo-link">
          <BookOpen className="logo-icon" size={32} />
          <span className="logo-text">LMS Pro</span>
        </NavLink>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-wrapper">
            <NavLink
              to={item.path || "#"}
              className={({ isActive }) =>
                `nav-item ${item.submenu ? "has-submenu" : ""} ${
                  isActive && !item.submenu ? "active" : ""
                }`
              }
              onClick={(e) => handleMenuItemClick(e, item)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.submenu && (
                <ChevronDown
                  className={`submenu-arrow ${
                    activeSubmenu === index ? "rotated" : ""
                  }`}
                />
              )}
            </NavLink>

            {item.submenu && (
              <div
                className={`submenu ${activeSubmenu === index ? "active" : ""}`}
              >
                {item.submenu.map((subitem, subindex) => (
                  <NavLink
                    key={subindex}
                    to={subitem.path}
                    className={({ isActive }) =>
                      `submenu-item ${isActive ? "active" : ""}`
                    }
                    onClick={(e) => {
                      if (
                        subitem.onClick &&
                        !subitem.onClick(e, subitem.path)
                      ) {
                        return;
                      }
                      setActiveSubmenu(null);
                    }}
                  >
                    {subitem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Right Section */}
      <div className="right-section">
        {/* Theme Selector */}
        <div className="theme-selector" ref={themeMenuRef}>
          <button
            className="theme-button icon-button"
            onClick={toggleThemeMenu}
            aria-label="Toggle theme menu"
          >
            <CurrentThemeIcon />
          </button>

          {isThemeMenuOpen && (
            <div className="theme-menu-dropdown">
              {themes.map((themeOption) => {
                const ThemeIcon = themeOption.icon;
                return (
                  <button
                    key={themeOption.value}
                    className={`theme-option ${
                      theme === themeOption.value ? "active" : ""
                    }`}
                    onClick={() => handleThemeSelect(themeOption.value)}
                    aria-label={`Switch to ${themeOption.label} theme`}
                  >
                    <ThemeIcon />
                    <span>{themeOption.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu" ref={menuRef}>
          <button
            className="user-button"
            onClick={toggleUserMenu}
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
          >
            <span className="username">
              {currentUser?.firstName || "Guest"}
            </span>
            <ChevronDown
              className={`dropdown-arrow ${isUserMenuOpen ? "rotated" : ""}`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="user-menu-dropdown" role="menu">
              {currentUser ? (
                <>
                  <NavLink
                    to={`/users/${currentUser.id}`}
                    className="menu-item profile-link"
                    role="menuitem"
                  >
                    <img
                      src={
                        currentUser?.profileImageUrl ||
                        "https://img.freepik.com/premium-vector/3d-vector-icon-simple-blue-user-profile-icon-with-white-features_6011-1575.jpg"
                      }
                      alt="Profile"
                      className="menu-avatar"
                    />
                    <div className="user-info">
                      <span className="user-name">
                        {currentUser.firstName} {currentUser.lastName}
                      </span>
                      <span className="user-role">{currentUser.role}</span>
                    </div>
                  </NavLink>
                  <hr className="menu-divider" />
                  <button
                    className="menu-item logout-item"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="menu-item login-item"
                  role="menuitem"
                >
                  Login
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
          <div
            className="mobile-menu"
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <BookOpen className="logo-icon" size={32} />
                <span className="logo-text">LMS Pro</span>
              </div>
              <button
                className="close-btn"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <X />
              </button>
            </div>

            <nav className="mobile-nav">
              {menuItems.map((item, index) => (
                <div key={index} className="mobile-nav-item-wrapper">
                  <NavLink
                    to={item.path || "#"}
                    className={({ isActive }) =>
                      `mobile-nav-item ${item.submenu ? "has-submenu" : ""} ${
                        isActive && !item.submenu ? "active" : ""
                      }`
                    }
                    onClick={(e) => handleMenuItemClick(e, item, true)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.submenu && (
                      <ChevronDown
                        className={`submenu-arrow ${
                          activeSubmenu === index ? "rotated" : ""
                        }`}
                      />
                    )}
                  </NavLink>

                  {item.submenu && activeSubmenu === index && (
                    <div className="mobile-submenu">
                      {item.submenu.map((subitem, subindex) => (
                        <NavLink
                          key={subindex}
                          to={subitem.path}
                          className={({ isActive }) =>
                            `mobile-submenu-item ${isActive ? "active" : ""}`
                          }
                          onClick={(e) => {
                            if (
                              subitem.onClick &&
                              !subitem.onClick(e, subitem.path)
                            ) {
                              return;
                            }
                            setMobileMenuOpen(false);
                            setActiveSubmenu(null);
                          }}
                        >
                          {subitem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Theme Selector */}
            <div className="mobile-theme-section">
              <div className="mobile-theme-header">
                <span>Theme</span>
              </div>
              <div className="mobile-theme-options">
                {themes.map((themeOption) => {
                  const ThemeIcon = themeOption.icon;
                  return (
                    <button
                      key={themeOption.value}
                      className={`mobile-theme-option ${
                        theme === themeOption.value ? "active" : ""
                      }`}
                      onClick={() => handleThemeSelect(themeOption.value)}
                      aria-label={`Switch to ${themeOption.label} theme`}
                    >
                      <ThemeIcon />
                      <span>{themeOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="mobile-user-section">
              {currentUser ? (
                <>
                  <NavLink
                    to={`/users/${currentUser.id}`}
                    className="mobile-profile-link"
                  >
                    <img
                      src={
                        currentUser?.profileImageUrl ||
                        "https://img.freepik.com/premium-vector/3d-vector-icon-simple-blue-user-profile-icon-with-white-features_6011-1575.jpg"
                      }
                      alt="Profile"
                      className="mobile-avatar"
                    />
                    <div className="mobile-user-info">
                      <span className="mobile-user-name">
                        {currentUser.firstName} {currentUser.lastName}
                      </span>
                      <span className="mobile-user-role">
                        {currentUser.role}
                      </span>
                    </div>
                  </NavLink>
                  <button
                    className="mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/auth" className="mobile-login-btn">
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
