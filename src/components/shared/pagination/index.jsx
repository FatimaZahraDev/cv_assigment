import React, { memo } from "react";
import { Pagination, Select, Space, Typography } from "antd";
import PropTypes from "prop-types";
import "./pagination.css";

const { Text } = Typography;
const { Option } = Select;

/**
 * Reusable Pagination component with Facebook-like performance and UX
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.pageSize - Current page size
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} props.onPageSizeChange - Callback when page size changes
 * @param {Array} props.pageSizeOptions - Available page size options
 * @param {boolean} props.showSizeChanger - Whether to show page size selector
 * @param {boolean} props.showQuickJumper - Whether to show quick page jumper
 * @param {boolean} props.showTotal - Whether to show total items info
 * @param {string} props.size - Size of pagination component
 * @param {boolean} props.disabled - Whether pagination is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.responsive - Whether to use responsive design
 */
const CustomPagination = memo(
  ({
    currentPage = 1,
    pageSize = 10,
    totalItems = 0,
    totalPages = 0,
    onPageChange = () => {},
    onPageSizeChange = () => {},
    pageSizeOptions = [10, 20, 50, 100],
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = true,
    size = "default",
    disabled = false,
    className = "",
    style = {},
    responsive = true,
    ...rest
  }) => {
    // Calculate display range
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Custom total display function
    const showTotalItems = (total, range) => {
      if (!showTotal) return null;

      return (
        <Text className="color-white-500">
          Showing {range[0]}-{range[1]} of {total} items
        </Text>
      );
    };

    // Handle page size change
    const handlePageSizeChange = (newPageSize) => {
      onPageSizeChange(newPageSize);
    };

    // Custom page size selector
    const pageSizeSelector = showSizeChanger && (
      <Space align="center" className="ms-3">
        <Text className="color-white-500">Show:</Text>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size={size}
          disabled={disabled}
          className="pagination-page-size-select"
          style={{ minWidth: 80 }}
          dropdownClassName="pagination-dropdown"
        >
          {pageSizeOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <Text className="color-white-500">per page</Text>
      </Space>
    );

    // Don't render if no data
    if (totalItems === 0) {
      return null;
    }

    return (
      <div
        className={`d-flex ${
          responsive ? "flex-column flex-md-row" : ""
        } justify-content-between align-items-center mt-4 ${className}`}
        style={style}
      >
        {/* Total items info */}
        {showTotal && (
          <div className={`${responsive ? "mb-3 mb-md-0" : ""}`}>
            {showTotalItems(totalItems, [startItem, endItem])}
          </div>
        )}

        {/* Main pagination */}
        <div
          className={`d-flex justify-content-end align-items-center pagination-component ${className}`}
          style={style}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper={false}
            size={size}
            disabled={disabled}
            showTotal={false}
            itemRender={(page, type, originalElement) => {
              if (type === "prev") {
                return <span>{"❮"} Previous</span>;
              }
              if (type === "next") {
                return <span>Next {"❯"}</span>;
              }
              return originalElement;
            }}
          />
          <span className="page-label">
            PAGE {currentPage} OF {totalPages}
          </span>
        </div>
      </div>
    );
  }
);

CustomPagination.displayName = "CustomPagination";

CustomPagination.propTypes = {
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showSizeChanger: PropTypes.bool,
  showQuickJumper: PropTypes.bool,
  showTotal: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  responsive: PropTypes.bool,
};

export default CustomPagination;
