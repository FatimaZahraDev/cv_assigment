import React from "react";
import PaginatedDataWrapper from "./PaginatedDataWrapper";
import { Empty, Button } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

/**
 * Specialized PaginatedDataWrapper for Events with event-specific styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {Array} props.events - Array of events
 * @param {boolean} props.isLoading - Loading state for initial load
 * @param {boolean} props.isLoadingNewPage - Loading state for page changes
 * @param {boolean} props.isError - Error state
 * @param {Function} props.onCreateEvent - Callback for create event action
 * @param {React.ReactNode} props.children - Event cards/content to render
 * @param {Object} props.paginationProps - Pagination configuration
 * @param {Object} props.emptyProps - Additional props for empty state
 * @param {Object} props.skeletonProps - Additional props for skeleton
 */
const PaginatedEventDataWrapper = ({
  events = [],
  isLoading = false,
  isLoadingNewPage = false,
  isError = false,
  onCreateEvent = null,
  children,
  paginationProps = {},
  emptyProps = {},
  skeletonProps = {},
  ...rest
}) => {
  // Custom empty component for events
  const customEmptyComponent = (
    <div className="text-center py-5">
      <Empty
        image={
          <CalendarOutlined 
            style={{ 
              fontSize: "64px", 
              color: "#666",
              marginBottom: "16px" 
            }} 
          />
        }
        description={
          <div>
            <h3 className="color-white mb-2">No Events Found</h3>
            <p className="color-white-500 mb-4">
              There are no events matching your criteria. Try adjusting your filters or create a new event.
            </p>
            {onCreateEvent && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreateEvent}
                className="btn-bg-red"
                size="large"
              >
                Create Your First Event
              </Button>
            )}
          </div>
        }
        {...emptyProps}
      />
    </div>
  );

  // Custom error component for events
  const customErrorComponent = (
    <div className="text-center py-5">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <h3 className="color-white mb-2">Failed to Load Events</h3>
            <p className="color-white-500 mb-4">
              We couldn't load the events. Please check your connection and try again.
            </p>
            <Button type="primary" className="btn-bg-red">
              Try Again
            </Button>
          </div>
        }
      />
    </div>
  );

  return (
    <PaginatedDataWrapper
      isLoading={isLoading}
      isError={isError}
      data={events}
      dataType="events"
      paginationProps={{
        ...paginationProps,
        isLoadingNewPage,
      }}
      wrapperProps={{
        emptyComponent: customEmptyComponent,
        errorComponent: customErrorComponent,
        skeletonProps: {
          active: true,
          ...skeletonProps,
        },
        containerClassName: "row mt-4",
      }}
      {...rest}
    >
      {children}
    </PaginatedDataWrapper>
  );
};

PaginatedEventDataWrapper.propTypes = {
  events: PropTypes.array,
  isLoading: PropTypes.bool,
  isLoadingNewPage: PropTypes.bool,
  isError: PropTypes.bool,
  onCreateEvent: PropTypes.func,
  children: PropTypes.node,
  paginationProps: PropTypes.object,
  emptyProps: PropTypes.object,
  skeletonProps: PropTypes.object,
};

export default PaginatedEventDataWrapper;