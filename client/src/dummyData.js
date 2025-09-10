// Language Transfer
export const arSD = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          columnMenuLabel: "القائمة",
          columnMenuShowColumns: "إظهار الأعمدة",
          columnMenuFilter: "تصفية",
          columnMenuHideColumn: "إخفاء العمود",
          columnMenuUnsort: "إلغاء الترتيب",
          columnMenuSortAsc: "ترتيب تصاعدي",
          columnMenuSortDesc: "ترتيب تنازلي",
          columnsPanelTextFieldLabel: "البحث عن العمود",
          columnsPanelTextFieldPlaceholder: "عنوان العمود",
          columnsPanelDragIconLabel: "إعادة ترتيب العمود",
          columnsPanelShowAllButton: "إظهار الكل",
          columnsPanelHideAllButton: "إخفاء الكل",
          filterPanelAddFilter: "إضافة تصفية",
          filterPanelRemoveAll: "حذف الكل",
          filterPanelDeleteIconLabel: "حذف",
          filterPanelLogicOperator: "عامل منطقي",
          filterPanelOperator: "عامل",
          filterPanelOperatorAnd: "و",
          filterPanelOperatorOr: "أو",
          filterPanelColumns: "الأعمدة",
          filterPanelInputLabel: "القيمة",
          filterPanelInputPlaceholder: "قيمة التصفية",
          filterOperatorContains: "يحتوي",
          filterOperatorEquals: "يساوي",
          filterOperatorStartsWith: "يبدأ بـ",
          filterOperatorEndsWith: "ينتهي بـ",
          filterOperatorIs: "يكون",
          filterOperatorNot: "ليس",
          filterOperatorAfter: "بعد",
          filterOperatorOnOrAfter: "في أو بعد",
          filterOperatorBefore: "قبل",
          filterOperatorOnOrBefore: "في أو قبل",
          filterOperatorIsEmpty: "فارغ",
          filterOperatorIsNotEmpty: "ليس فارغاً",
          filterOperatorIsAnyOf: "أي من",
          columnMenuManageColumns: "إدارة الأعمدة",
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} صفوف محددة`
              : `صف واحد محدد`,
          footerTotalRows: "إجمالي الصفوف:",
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,
          checkboxSelectionHeaderName: "تحديد",
          columnHeaderSortIconLabel: "ترتيب",
          MuiTablePagination: {
            labelRowsPerPage: "عدد الصفوف في الصفحة:",
            labelDisplayedRows: ({ from, to, count }) =>
              `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
          },
        },
      },
    },
  },
};

// User Levels
export const userLevels = [
  { value: "PRIMARY_GRADE_1", label: "Primary Grade 1" },
  { value: "PRIMARY_GRADE_2", label: "Primary Grade 2" },
  { value: "PRIMARY_GRADE_3", label: "Primary Grade 3" },
  { value: "PRIMARY_GRADE_4", label: "Primary Grade 4" },
  { value: "PRIMARY_GRADE_5", label: "Primary Grade 5" },
  { value: "PRIMARY_GRADE_6", label: "Primary Grade 6" },
  { value: "PREPARATORY_GRADE_1", label: "Preparatory Grade 1" },
  { value: "PREPARATORY_GRADE_2", label: "Preparatory Grade 2" },
  { value: "PREPARATORY_GRADE_3", label: "Preparatory Grade 3" },
  { value: "SECONDARY_GRADE_1", label: "Secondary Grade 1" },
  { value: "SECONDARY_GRADE_2", label: "Secondary Grade 2" },
  { value: "SECONDARY_GRADE_3", label: "Secondary Grade 3" },
];

// Course Levels
export const courseLevels = [
  { value: "PRIMARY_GRADE_1", label: "Primary Grade 1" },
  { value: "PRIMARY_GRADE_2", label: "Primary Grade 2" },
  { value: "PRIMARY_GRADE_3", label: "Primary Grade 3" },
  { value: "PRIMARY_GRADE_4", label: "Primary Grade 4" },
  { value: "PRIMARY_GRADE_5", label: "Primary Grade 5" },
  { value: "PRIMARY_GRADE_6", label: "Primary Grade 6" },
  { value: "PREPARATORY_GRADE_1", label: "Preparatory Grade 1" },
  { value: "PREPARATORY_GRADE_2", label: "Preparatory Grade 2" },
  { value: "PREPARATORY_GRADE_3", label: "Preparatory Grade 3" },
  { value: "SECONDARY_GRADE_1", label: "Secondary Grade 1" },
  { value: "SECONDARY_GRADE_2", label: "Secondary Grade 2" },
  { value: "SECONDARY_GRADE_3", label: "Secondary Grade 3" },
];

// Course Status
export const courseStatus = [
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "SUSPENDED", label: "Suspended" },
];
