import React from "react";
import { Empty, Skeleton, Card } from "antd";
import PropTypes from "prop-types";

/**
 * Reusable DataWrapper component that handles loading, empty states, and data rendering
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Array|Object} props.data - Data to check for emptiness
 * @param {React.ReactNode} props.children - Content to render when data is available
 * @param {React.ReactNode} props.loadingComponent - Custom loading component
 * @param {React.ReactNode} props.emptyComponent - Custom empty state component
 * @param {React.ReactNode} props.errorComponent - Custom error component
 * @param {Object} props.skeletonProps - Props for Ant Design Skeleton
 * @param {Object} props.emptyProps - Props for Ant Design Empty component
 * @param {string} props.containerClassName - CSS class for the container
 * @param {Object} props.containerStyle - Inline styles for the container
 * @param {Function} props.isEmpty - Custom function to determine if data is empty
 * @param {string} props.dataType - Type of data for better empty messages
 */
const DataWrapper = ({
  isLoading = false,
  isError = false,
  data = null,
  children,
  loadingComponent = null,
  emptyComponent = null,
  errorComponent = null,
  skeletonProps = {},
  emptyProps = {},
  containerClassName = "",
  containerStyle = {},
  isEmpty = null,
  dataType = "items",
  ...rest
}) => {
  // Custom isEmpty function or default logic
  const checkIsEmpty = () => {
    if (isEmpty && typeof isEmpty === "function") {
      return isEmpty(data);
    }

    if (Array.isArray(data)) {
      return data.length === 0;
    }

    if (data && typeof data === "object") {
      return Object.keys(data).length === 0;
    }

    return !data;
  };

  // Default skeleton configurations for different data types
  const getDefaultSkeleton = () => {
    const commonProps = {
      active: true,
      ...skeletonProps,
    };

    switch (dataType) {
      case "events":
        return (
          <div className="row">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mb-4"
              >
                <Card>
                  <Skeleton.Image
                    style={{ width: "100%", height: "200px", display: "block" }}
                    {...commonProps}
                  />
                  <div className="mt-3">
                    <Skeleton.Input
                      style={{ width: "80%" }}
                      size="small"
                      {...commonProps}
                    />
                    <Skeleton.Input
                      style={{ width: "60%", marginTop: "8px" }}
                      size="small"
                      {...commonProps}
                    />
                    <Skeleton.Input
                      style={{ width: "70%", marginTop: "8px" }}
                      size="small"
                      {...commonProps}
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        );

      case "users":
        return (
          <div className="row">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <Card>
                  <div className="d-flex align-items-center">
                    <Skeleton.Avatar size="large" {...commonProps} />
                    <div className="ms-3 flex-grow-1">
                      <Skeleton.Input
                        style={{ width: "100%" }}
                        size="small"
                        {...commonProps}
                      />
                      <Skeleton.Input
                        style={{ width: "80%", marginTop: "8px" }}
                        size="small"
                        {...commonProps}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        );

      case "posts":
        return (
          <div>
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <Skeleton.Avatar {...commonProps} />
                  <div className="ms-3">
                    <Skeleton.Input
                      style={{ width: "150px" }}
                      size="small"
                      {...commonProps}
                    />
                  </div>
                </div>
                <Skeleton paragraph={{ rows: 3 }} {...commonProps} />
                <Skeleton.Image
                  style={{ width: "100%", height: "300px" }}
                  {...commonProps}
                />
              </Card>
            ))}
          </div>
        );

      case "list":
        return (
          <div>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="d-flex align-items-center p-3 border-bottom"
              >
                <Skeleton.Avatar {...commonProps} />
                <div className="ms-3 flex-grow-1">
                  <Skeleton.Input style={{ width: "60%" }} {...commonProps} />
                  <Skeleton.Input
                    style={{ width: "40%", marginTop: "8px" }}
                    size="small"
                    {...commonProps}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <Skeleton paragraph={{ rows: 4 }} {...commonProps} />;
    }
  };

  // Default empty state messages
  const getEmptyMessage = () => {
    const messages = {
      events: "No events found",
      users: "No users found",
      posts: "No posts available",
      list: "No items found",
      default: "No data available",
    };

    return messages[dataType] || messages.default;
  };

  const getEmptyDescription = () => {
    const descriptions = {
      events:
        "There are no events to display at the moment. Try adjusting your filters or check back later.",
      users:
        "No users match your current criteria. Try adjusting your search or filters.",
      posts: "No posts have been created yet. Be the first to share something!",
      list: "The list is currently empty. Items will appear here when available.",
      default: "There's nothing to show right now. Please try again later.",
    };

    return descriptions[dataType] || descriptions.default;
  };

  // Render error state
  if (isError && errorComponent) {
    return (
      <div className={containerClassName} style={containerStyle} {...rest}>
        {errorComponent}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={containerClassName} style={containerStyle} {...rest}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Something went wrong while loading data"
          {...emptyProps}
        />
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    if (loadingComponent) {
      return (
        <div className={containerClassName} style={containerStyle} {...rest}>
          {loadingComponent}
        </div>
      );
    }

    return (
      <div className={containerClassName} style={containerStyle} {...rest}>
        {getDefaultSkeleton()}
      </div>
    );
  }

  // Render empty state
  if (checkIsEmpty()) {
    if (emptyComponent) {
      return (
        <div className={containerClassName} style={containerStyle} {...rest}>
          {emptyComponent}
        </div>
      );
    }

    return (
      <div className={containerClassName} style={containerStyle} {...rest}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h4 className="color-white">{getEmptyMessage()}</h4>
              <p className="color-white-500">{getEmptyDescription()}</p>
            </div>
          }
          {...emptyProps}
        />
      </div>
    );
  }

  // Render children when data is available
  return (
    <div className={containerClassName} style={containerStyle} {...rest}>
      {children}
    </div>
  );
};

DataWrapper.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.node,
  loadingComponent: PropTypes.node,
  emptyComponent: PropTypes.node,
  errorComponent: PropTypes.node,
  skeletonProps: PropTypes.object,
  emptyProps: PropTypes.object,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  isEmpty: PropTypes.func,
  dataType: PropTypes.oneOf(["events", "users", "posts", "list", "default"]),
};

export default DataWrapper;
