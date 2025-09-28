import React from "react";
import DataWrapper from "./index";
import { Empty, Button } from "antd";
import { FileTextOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

/**
 * Specialized DataWrapper for Posts with post-specific styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {Array} props.posts - Array of posts
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Function} props.onCreatePost - Callback for create post action
 * @param {React.ReactNode} props.children - Post cards/content to render
 * @param {Object} props.emptyProps - Additional props for empty state
 * @param {Object} props.skeletonProps - Additional props for skeleton
 */
const PostDataWrapper = ({
  posts = [],
  isLoading = false,
  isError = false,
  onCreatePost = null,
  children,
  emptyProps = {},
  skeletonProps = {},
  ...rest
}) => {
  // Custom empty component for posts
  const customEmptyComponent = (
    <div className="text-center py-5">
      <Empty
        image={
          <FileTextOutlined 
            style={{ 
              fontSize: "64px", 
              color: "#666",
              marginBottom: "16px" 
            }} 
          />
        }
        description={
          <div>
            <h3 className="color-white mb-2">No Posts Yet</h3>
            <p className="color-white-500 mb-4">
              Be the first to share something! Create a post to get the conversation started.
            </p>
            {onCreatePost && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={onCreatePost}
                className="btn-bg-red"
                size="large"
              >
                Create Your First Post
              </Button>
            )}
          </div>
        }
        {...emptyProps}
      />
    </div>
  );

  return (
    <DataWrapper
      isLoading={isLoading}
      isError={isError}
      data={posts}
      dataType="posts"
      emptyComponent={customEmptyComponent}
      skeletonProps={{
        active: true,
        ...skeletonProps,
      }}
      {...rest}
    >
      {children}
    </DataWrapper>
  );
};

PostDataWrapper.propTypes = {
  posts: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  onCreatePost: PropTypes.func,
  children: PropTypes.node,
  emptyProps: PropTypes.object,
  skeletonProps: PropTypes.object,
};

export default PostDataWrapper;