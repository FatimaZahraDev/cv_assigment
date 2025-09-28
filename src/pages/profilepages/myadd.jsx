import React, { useState } from "react";
import ProfileLayout from "@/components/shared/layout/profilelayout";
import CustomTabs from "@/components/shared/tabs";
import AdCard from "@/components/shared/card/adcard";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Menu, Pagination } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import useSweetAlert from "@/hooks/useSweetAlert";
import { useNavigate } from "react-router";

const MyAdd = () => {
  const { showAlert } = useSweetAlert();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();
  
  const { loading, data, pagination, setQueryParams, refetch } = useQuery(
    "getMineVehicle",
    {
      enablePagination: true,
      defaultQueryParams: {
        page: 1,
        per_page: 5,
      },
    }
  );

  const navigate = useNavigate();
  
  // Mutation for updating vehicle status
  const { mutate: updateVehicleStatus, isPending: isUpdatingStatus } =
    useMutation("updateVehicleStatus", {
      useFormData: false,
      onSuccess: () => {
        // Clear all vehicle-related cache
        queryClient.removeQueries({ queryKey: ["getMineVehicle"] });
        queryClient.removeQueries({ queryKey: ["getAllVehicle"] });
        queryClient.removeQueries({ queryKey: ["getVehicleById"] });
        
        // Force refetch and reload
        refetch();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    });
    
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation(
    "deleteVehicleStatus",
    {
      showSuccessNotification: true,
      onSuccess: async () => {
        // Aggressively clear all vehicle-related cache
        queryClient.clear();
        
        // Force page reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    }
  );

  // Handler for status change
  const handleStatusChange = (vehicleId, isActive) => {
    updateVehicleStatus({
      slug: `${vehicleId}/change-status`,
      data: { is_active: isActive },
    });
  };

  const handleMenuClick = (key, ad) => {
    if (key === "edit") {
      setSelectedVehicle(ad.id);
      // Navigate to edit page with vehicle ID and pass vehicle data via state
      navigate(`/post-add`, {
        state: { vehicleData: ad, isEdit: true },
      });
    } else if (key === "delete") {
      handleDeleteProperty(ad.id);
    }
  };
  
  const handleDeleteProperty = async (id) => {
    console.log("showAlert Id", id);
    const result = await showAlert({
      title: "Are you sure?",
      text: `Do you want to delete this Ad`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteVehicle({ slug: id, data: "" });
    }
  };

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setQueryParams({
      page,
      per_page: pageSize,
    });
  };

  // Helper function to get the first image (non-video) from attachments
  const getFirstImageFromAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) {
      return "/assets/img/ford-mustang.png";
    }

    // Find the first attachment that is not a video (.mp4)
    const firstImage = attachments.find((attachment) => {
      const filePath = attachment.file_url || attachment;
      return !filePath.toLowerCase().endsWith(".mp4");
    });

    return firstImage
      ? firstImage.file_url || firstImage
      : "/assets/img/ford-mustang.png";
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="col-12 mb-3">
          <div
            className="ad-card-skeleton"
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #333",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Image skeleton */}
            <div
              style={{
                width: "120px",
                height: "80px",
                backgroundColor: "#333",
                borderRadius: "8px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            ></div>

            {/* Content skeleton */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  width: "60%",
                  height: "20px",
                  backgroundColor: "#333",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
              <div
                style={{
                  width: "40%",
                  height: "16px",
                  backgroundColor: "#333",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
              <div
                style={{
                  width: "30%",
                  height: "16px",
                  backgroundColor: "#333",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const items = [
    {
      key: "1",
      label: "View all",
      children: (
        <div>
          <style jsx>{`
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}</style>
          
          {loading ? (
            renderLoadingSkeleton()
          ) : data && data.length > 0 ? (
            <>
              {data.map((ad) => (
                <div className="col-12" key={ad.id}>
                  <AdCard
                    image={getFirstImageFromAttachments(ad.attachments)}
                    title={`${ad?.make?.name || "Unknown"} ${
                      ad?.model?.name || "Model"
                    } - ${ad?.transmission_type?.name || "Unknown Transmission"}`}
                    location={ad.location || "Location not specified"}
                    date={
                      ad.created_at
                        ? new Date(ad.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            day: "numeric",
                            month: "long",
                          })
                        : "Date not available"
                    }
                    defaultActive={ad.status === "active" ? true : false}
                    vehicleId={ad.id}
                    onStatusChange={handleStatusChange}
                    isUpdating={isUpdatingStatus}
                    overlay={
                      <Menu onClick={({ key }) => handleMenuClick(key, ad)}>
                        <Menu.Item key="edit">Edit</Menu.Item>
                        <Menu.Item key="delete">Delete</Menu.Item>
                      </Menu>
                    }
                  />
                </div>
              ))}
              
              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="d-flex justify-content-end mt-4">
                  <Pagination
                    current={pagination?.currentPage || 1}
                    total={pagination?.count || 0}
                    pageSize={pagination?.perPage || 9}
                    pageSizeOptions={["9", "10", "20", "50", "100"]}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} ads`
                    }
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="color-white">No vehicle ads found</h3>
              <p className="color-white-500">
                You haven't created any vehicle ads yet
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Active Ads",
      children: (
        <div>
          {loading ? (
            renderLoadingSkeleton()
          ) : data && data.length > 0 ? (
            <>
              {data
                .filter((ad) => ad.status === "active")
                .map((ad) => (
                  <div className="col-12" key={ad.id}>
                    <AdCard
                      image={getFirstImageFromAttachments(ad.attachments)}
                      title={`${ad?.make?.name || "Unknown"} ${
                        ad?.model?.name || "Model"
                      } - ${
                        ad?.transmission_type?.name || "Unknown Transmission"
                      }`}
                      location={ad.location || "Location not specified"}
                      date={
                        ad.created_at
                          ? new Date(ad.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Date not available"
                      }
                      defaultActive={true}
                      vehicleId={ad.id}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdatingStatus}
                      overlay={
                        <Menu onClick={({ key }) => handleMenuClick(key, ad)}>
                          <Menu.Item key="edit">Edit</Menu.Item>
                          <Menu.Item key="delete">Delete</Menu.Item>
                        </Menu>
                      }
                    />
                  </div>
                ))}
                
              {/* Pagination for active ads */}
              {pagination && pagination.total > 0 && (
                <div className="d-flex justify-content-end mt-4">
                  <Pagination
                    current={pagination?.currentPage || 1}
                    total={data.filter((ad) => ad.status === "active").length}
                    pageSize={pagination?.perPage || 9}
                    pageSizeOptions={["9", "10", "20", "50", "100"]}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} active ads`
                    }
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="color-white">No active ads found</h3>
              <p className="color-white-500">
                You don't have any active vehicle ads
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Inactive Ads",
      children: (
        <div>
          {loading ? (
            renderLoadingSkeleton()
          ) : data && data.length > 0 ? (
            <>
              {data
                .filter((ad) => ad.status === "inactive")
                .map((ad) => (
                  <div className="col-12" key={ad.id}>
                    <AdCard
                      image={getFirstImageFromAttachments(ad.attachments)}
                      title={`${ad?.make?.name || "Unknown"} ${
                        ad?.model?.name || "Model"
                      } - ${
                        ad?.transmission_type?.name || "Unknown Transmission"
                      }`}
                      location={ad.location || "Location not specified"}
                      date={
                        ad.created_at
                          ? new Date(ad.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Date not available"
                      }
                      defaultActive={false}
                      vehicleId={ad.id}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdatingStatus}
                      overlay={
                        <Menu onClick={({ key }) => handleMenuClick(key, ad)}>
                          <Menu.Item key="edit">Edit</Menu.Item>
                          <Menu.Item key="delete">Delete</Menu.Item>
                        </Menu>
                      }
                    />
                  </div>
                ))}
                
              {/* Pagination for inactive ads */}
              {pagination && pagination.total > 0 && (
                <div className="d-flex justify-content-end mt-4">
                  <Pagination
                    current={pagination?.currentPage || 1}
                    total={data.filter((ad) => ad.status === "inactive").length}
                    pageSize={pagination?.perPage || 9}
                    pageSizeOptions={["9", "10", "20", "50", "100"]}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} inactive ads`
                    }
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="color-white">No inactive ads found</h3>
              <p className="color-white-500">
                You don't have any inactive vehicle ads
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <ProfileLayout page_title="My Vehicles Ads">
      <CustomTabs items={items} className="my-add-tabs" />
    </ProfileLayout>
  );
};

export default MyAdd;