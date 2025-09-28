import React from "react";
import DataWrapper from "./index";
import { Empty, Button } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

/**
 * Specialized DataWrapper for Users with user-specific styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {Array} props.users - Array of users
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Function} props.onInviteUser - Callback for invite user action
 * @param {React.ReactNode} props.children - User cards/content to render
 * @param {Object} props.emptyProps - Additional props for empty state
 * @param {Object} props.skeletonProps - Additional props for skeleton
 */
const UserDataWrapper = ({
  users = [],
  isLoading = false,
  isError = false,
  onInviteUser = null,
  children,
  emptyProps = {},
  skeletonProps = {},
  ...rest
}) => {
  // Custom empty component for users
  const customEmptyComponent = (
    <div className="text-center py-5">
      <Empty
        image={
          <UserOutlined 
            style={{ 
              fontSize: "64px", 
              color: "#666",
              marginBottom: "16px" 
            }} 
          />
        }
        description={
          <div>
            <h3 className="color-white mb-2">No Users Found</h3>
            <p className="color-white-500 mb-4">
              No users match your search criteria. Try adjusting your filters or invite new users.
            </p>
            {onInviteUser && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={onInviteUser}
                className="btn-bg-red"
                size="large"
              >
                Invite Users
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
      data={users}
      dataType="users"
      emptyComponent={customEmptyComponent}
      skeletonProps={{
        active: true,
        ...skeletonProps,
      }}
      containerClassName="row"
      {...rest}
    >
      {children}
    </DataWrapper>
  );
};

UserDataWrapper.propTypes = {
  users: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  onInviteUser: PropTypes.func,
  children: PropTypes.node,
  emptyProps: PropTypes.object,
  skeletonProps: PropTypes.object,
};

export default UserDataWrapper;