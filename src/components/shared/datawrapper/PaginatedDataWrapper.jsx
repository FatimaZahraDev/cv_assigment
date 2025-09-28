import React from "react";
import DataWrapper from "./index";
import CustomPagination from "../pagination";
import PropTypes from "prop-types";

/**
 * Enhanced DataWrapper with built-in pagination support
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Array|Object} props.data - Data to display
 * @param {React.ReactNode} props.children - Content to render when data is available
 * @param {Object} props.paginationProps - Pagination configuration
 * @param {boolean} props.showPagination - Whether to show pagination (default: true)
 * @param {string} props.dataType - Type of data for skeleton/empty states
 * @param {string} props.paginationPosition - Position of pagination: 'top', 'bottom', 'both' (default: 'bottom')
 * @param {Object} props.wrapperProps - Props to pass to base DataWrapper
 */
const PaginatedDataWrapper = ({
  isLoading = false,
  isError = false,
  data = [],
  children,
  paginationProps = {},
  showPagination = true,
  dataType = "default",
  paginationPosition = "bottom",
  wrapperProps = {},
  ...rest
}) => {
  const {
    currentPage = 1,
    pageSize = 10,
    totalItems = 0,
    totalPages = 0,
    onPageChange = () => {},
    onPageSizeChange = () => {},
    isLoadingNewPage = false,
    ...otherPaginationProps
  } = paginationProps;

  // Pagination component
  const paginationComponent = showPagination && totalItems > 0 && (
    <CustomPagination
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      disabled={isLoadingNewPage}
      {...otherPaginationProps}
    />
  );

  // Wrapper for content with loading overlay for new pages
  const contentWrapper = (
    <div className="position-relative">
      {/* Loading overlay for new page loads */}
      {isLoadingNewPage && (
        <div 
          className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.1)", 
            zIndex: 10,
            minHeight: "200px"
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Actual content */}
      <div className={isLoadingNewPage ? "opacity-50" : ""}>
        <DataWrapper
          isLoading={isLoading}
          isError={isError}
          data={data}
          dataType={dataType}
          {...wrapperProps}
          {...rest}
        >
          {children}
        </DataWrapper>
      </div>
    </div>
  );

  return (
    <div>
      {/* Top pagination */}
      {(paginationPosition === "top" || paginationPosition === "both") && paginationComponent}
      
      {/* Main content */}
      {contentWrapper}
      
      {/* Bottom pagination */}
      {(paginationPosition === "bottom" || paginationPosition === "both") && paginationComponent}
    </div>
  );
};

PaginatedDataWrapper.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.node,
  paginationProps: PropTypes.object,
  showPagination: PropTypes.bool,
  dataType: PropTypes.string,
  paginationPosition: PropTypes.oneOf(["top", "bottom", "both"]),
  wrapperProps: PropTypes.object,
};

export default PaginatedDataWrapper;