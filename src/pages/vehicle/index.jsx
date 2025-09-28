import React, { useState, useMemo, useEffect } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import VehicleCard from "@/components/shared/card/vehiclecard";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Menu, Dropdown, Form, Pagination } from "antd";
import useSweetAlert from "@/hooks/useSweetAlert";

const Vehicle = () => {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();
   const [filters, setFilters] = useState({});
     const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editForm] = Form.useForm();

  // State for category and subcategory selection
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useQuery("getCategories");

  // Fetch vehicles using the API
  const { loading, data, pagination, setQueryParams } = useQuery(
    "getAllVehicle",
    {
      enablePagination: true,
      defaultQueryParams: {
        page: 1,
        per_page: 6,
      },
    }
  );

  // Format category options with "All" option
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.data) return [{ label: "All", value: "all" }];

    const categories = categoriesData.data.map((category) => ({
      label: category.name,
      value: category.id,
    }));

    // Add "All" option at the beginning
    return [{ label: "All", value: "all" }, ...categories];
  }, [categoriesData]);

  // Format subcategory options based on selected category
  const subcategoryOptions = useMemo(() => {
  

    // If "All" is selected or no category selected, return empty array
    if (
      !selectedCategory ||
      selectedCategory === "all" ||
      !categoriesData?.data
    ) {
      console.log(
        "No category selected or 'All' selected, returning empty array"
      );
      return [];
    }

    // Handle different possible data structures
    const categories = Array.isArray(categoriesData.data)
      ? categoriesData.data
      : categoriesData.data.categories || [];

    console.log("Available categories:", categories);

    // Find the selected category (try both string and number comparison)
    const selectedCategoryData = categories.find(
      (category) =>
        category.id === selectedCategory ||
        category.id === String(selectedCategory) ||
        String(category.id) === String(selectedCategory)
    );

    console.log("Found selected category data:", selectedCategoryData);

    // Extract subcategories from the selected category
    const subcategories =
      selectedCategoryData?.sub_categories ||
      selectedCategoryData?.subcategories ||
      [];
    console.log("Subcategories found:", subcategories);

    const options = subcategories.map((subcategory) => ({
      label: subcategory.name || subcategory.title,
      value: subcategory.id,
    }));

    console.log("Final subcategory options:", options);
    console.log("========================================");

    return options;
  }, [selectedCategory, categoriesData]);

  // Reset subcategory when category changes
  useEffect(() => {
    console.log(
      "Category changed, resetting subcategory. New category:",
      selectedCategory
    );
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (value) => {
    console.log("=== CATEGORY CHANGE ===");
    console.log("Previous category:", selectedCategory);
    console.log("New category:", value);
    console.log("Previous subcategory:", selectedSubcategory);

    // First reset subcategory, then set new category
    setSelectedSubcategory(null);
    setSelectedCategory(value);

    console.log("Category and subcategory updated");
    console.log("=======================");
  };

  // Handle subcategory change
  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
  };

  // Filter vehicles based on selected category and subcategory
  const filteredVehicles = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // If "All" is selected, show all vehicles
    if (!selectedCategory || selectedCategory === "all") {
      return data;
    }

    // Filter by category first
    let filtered = data.filter((vehicle) => {
      // Try different possible field names for category
      return (
        vehicle.category_id === selectedCategory ||
        vehicle.categoryId === selectedCategory ||
        String(vehicle.category_id) === String(selectedCategory) ||
        String(vehicle.categoryId) === String(selectedCategory)
      );
    });

    // If subcategory is also selected, filter further by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((vehicle) => {
        // Try different possible field names for subcategory
        return (
          vehicle.sub_category_id === selectedSubcategory ||
          vehicle.subCategoryId === selectedSubcategory ||
          vehicle.subcategory_id === selectedSubcategory ||
          String(vehicle.sub_category_id) === String(selectedSubcategory) ||
          String(vehicle.subCategoryId) === String(selectedSubcategory) ||
          String(vehicle.subcategory_id) === String(selectedSubcategory)
        );
      });
    }

    return filtered;
  }, [data, selectedCategory, selectedSubcategory]);

  // Debug logging for state changes
  useEffect(() => {
    if (selectedCategory && categoriesData?.data) {
      const selectedCategoryData = categoriesData.data.find(
        (category) => category.id === selectedCategory
      );
    }
  }, [
    selectedCategory,
    selectedSubcategory,
    categoryOptions,
    subcategoryOptions,
    categoriesData,
  ]);

  // Mutation for updating vehicle

  // Mutation for deleting vehicle
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation(
    "deleteVehicleStatus",
    {
      invalidateQueries: [{ queryKey: ["getAllVehicle"] }],
      showSuccessNotification: true,
      onSuccess: () => {},
    }
  );

  // Handle menu click for edit/delete actions
  const handleMenuClick = (key, vehicle) => {
    if (key === "edit") {
      setSelectedVehicle(vehicle);
      // Navigate to edit page with vehicle ID and pass vehicle data via state
      navigate(`/post-add`, {
        state: { vehicleData: vehicle, isEdit: true },
      });
    } else if (key === "delete") {
      handleDeleteVehicle(vehicle.id);
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (id) => {
    const result = await showAlert({
      title: "Are you sure?",
      text: "Do you want to delete this vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteVehicle({ slug: id, data: "" });
    }
  };

    const handlePageChange = (page, pageSize) => {
    setQueryParams({
      ...filters,
      page,
      per_page: pageSize,
      keyword: searchTerm,
    });
  };
  // Handle edit form submission

  return (
    <>
      {/* Add CSS for skeleton animations */}
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

      <InnerLayout headerClass="sub-header">
        <section className="tunner-banner">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>Street Tuners</h1>
                <h2>Performance Build</h2>
              </div>
            </div>
          </div>
        </section>
        <section className="tunner-sec">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4 col-lg-3 col-xl-3">
                <div className="d-flex align-items-end mb-4 mt-5">
                  <h2 className="color-white font-40">Filter</h2>
                  <span className="color-white font-20 ms-1">
                    {data ? data.length : 0} Results
                  </span>
                </div>
                <div>
                  <BaseInput
                    placeholder="Location"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/location-icon.png" />}
                  />
                  <BaseInput
                    placeholder="Pricing Range"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/price-icon.png" />}
                  />
                  <BaseInput
                    placeholder="Make"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/model-icon.png" />}
                  />
                  <BaseInput
                    placeholder="Model"
                    className="filter-select"
                    suffix={<img src="/assets/img/down-arrow.png" />}
                    type="select"
                    prefix={<img src="/assets/img/make-icon.png" />}
                  />
                </div>
              </div>
              <div className="col-12 col-md-8 col-lg-9 col-xl-9">
                <div className="d-flex align-items-center">
                  <h2 className="color-red">Performance Build</h2>
                  <span className="color-red-500 font-26">/Vehicles</span>
                </div>
                <div className="row align-items-end">
                  <div className="col-12 col-md-6">
                    <h2 className="color-white font-50">
                      {isCategoriesLoading ? (
                        // Skeleton loader for title
                        <div
                          style={{
                            width: "200px",
                            height: "40px",
                            backgroundColor: "#333",
                            borderRadius: "8px",
                            animation: "pulse 1.5s ease-in-out infinite",
                          }}
                        ></div>
                      ) : (selectedCategory && selectedCategory !== "all") ||
                        selectedSubcategory ? (
                        <div className="d-flex flex-wrap gap-2">
                          {selectedCategory && selectedCategory !== "all" && (
                            <span className="color-white">
                              {
                                categoryOptions.find(
                                  (cat) => cat.value === selectedCategory
                                )?.label
                              }
                              {selectedSubcategory && " → "}
                            </span>
                          )}
                          {selectedSubcategory && (
                            <span className="color-white">
                              {
                                subcategoryOptions.find(
                                  (sub) => sub.value === selectedSubcategory
                                )?.label
                              }
                            </span>
                          )}
                        </div>
                      ) : selectedCategory === "all" ? (
                        <span className="color-white">All Vehicles</span>
                      ) : (
                        <span className="color-white">All Vehicles</span>
                      )}
                    </h2>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row input-mb-0">
                      <div className="col-12 col-md-6">
                        {isCategoriesLoading ? (
                          // Skeleton loader for category dropdown
                          <div
                            className="tunner-select"
                            style={{
                              height: "48px",
                              backgroundColor: "#333",
                              borderRadius: "8px",
                              border: "1px solid #555",
                              animation: "pulse 1.5s ease-in-out infinite",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 12px",
                            }}
                          >
                            <div
                              style={{
                                width: "120px",
                                height: "16px",
                                backgroundColor: "#555",
                                borderRadius: "4px",
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            ></div>
                          </div>
                        ) : (
                          <BaseInput
                            type="select"
                            placeholder="Select Category"
                            className="tunner-select"
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            loading={isCategoriesLoading}
                          />
                        )}
                      </div>
                      <div className="col-12 col-md-6">
                        {isCategoriesLoading ? (
                          // Skeleton loader for subcategory dropdown
                          <div
                            className="tunner-select"
                            style={{
                              height: "48px",
                              backgroundColor: "#333",
                              borderRadius: "8px",
                              border: "1px solid #555",
                              animation: "pulse 1.5s ease-in-out infinite",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 12px",
                            }}
                          >
                            <div
                              style={{
                                width: "140px",
                                height: "16px",
                                backgroundColor: "#555",
                                borderRadius: "4px",
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            ></div>
                          </div>
                        ) : (
                          <BaseInput
                            key={`subcategory-${selectedCategory}`} // Force re-render when category changes
                            type="select"
                            placeholder="Select Subcategory"
                            className="tunner-select"
                            options={subcategoryOptions}
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                            disabled={
                              !selectedCategory || selectedCategory === "all"
                            }
                            loading={isCategoriesLoading}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category and Subcategory Dropdowns */}

                <div className="row mt-5">
                  {loading ? (
                    // Skeleton loaders for vehicle cards
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="col-12 col-sm-6 col-md-4">
                        <div
                          className="vehicle-card-skeleton"
                          style={{
                            backgroundColor: "#1a1a1a",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                            border: "1px solid #333",
                          }}
                        >
                          {/* Image skeleton */}
                          <div
                            style={{
                              width: "100%",
                              height: "200px",
                              backgroundColor: "#333",
                              borderRadius: "8px",
                              marginBottom: "12px",
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          ></div>

                          {/* Title skeleton */}
                          <div
                            style={{
                              width: "80%",
                              height: "20px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                              marginBottom: "8px",
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          ></div>

                          {/* Description skeleton */}
                          <div
                            style={{
                              width: "100%",
                              height: "16px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                              marginBottom: "12px",
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          ></div>

                          {/* Details skeleton */}
                          <div className="d-flex justify-content-between mb-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  width: "60px",
                                  height: "14px",
                                  backgroundColor: "#333",
                                  borderRadius: "4px",
                                  animation: "pulse 1.5s ease-in-out infinite",
                                }}
                              ></div>
                            ))}
                          </div>

                          {/* Price skeleton */}
                          <div
                            style={{
                              width: "50%",
                              height: "18px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : filteredVehicles && filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => {
                      const transformedVehicle = {
                        id: vehicle.id,
                        title: `${vehicle?.make?.name || "Unknown"} ${
                          vehicle?.model?.name || "Model"
                        }`,
                        description: vehicle.description
                          ? vehicle.description.length > 30
                            ? vehicle.description.slice(0, 30) + "..."
                            : vehicle.description
                          : "No description available",
                        state: `${vehicle?.city?.name || "Unknown"} ${
                          vehicle?.state?.name || "Model"
                        }`,
                        details: [
                          {
                            icon: "/assets/img/milega-icon.png",
                            label: `${vehicle?.mileage?.name || "0"} Miles`,
                          },
                          {
                            icon: "/assets/img/fuel-icon.png",
                            label: vehicle?.fuel_type?.name || "Unknown Fuel",
                          },
                          {
                            icon: "/assets/img/auto-icon.png",
                            label:
                              vehicle?.transmission_type?.name ||
                              "Unknown Transmission",
                          },
                        ],
                        price: vehicle.price
                          ? `$${parseFloat(vehicle.price).toLocaleString()}`
                          : "Price not available",
                        attachments: vehicle.attachments || [],
                        image:
                          vehicle.attachments && vehicle.attachments.length > 0
                            ? vehicle.attachments.find(
                                (att) =>
                                  !att.file_url?.toLowerCase().endsWith(".mp4")
                              )?.file_url || "/assets/img/ford-mustang.png"
                            : "/assets/img/ford-mustang.png",
                      };

                      return (
                        <div
                          key={vehicle.id}
                          className="col-12 col-sm-6 col-md-4 col-lg-4"
                        >
                          <VehicleCard
                            car={transformedVehicle}
                            edit_button={
                              window.user?.user?.id === vehicle?.user_id && (
                                <Dropdown
                                  overlay={
                                    <Menu
                                      onClick={({ key, domEvent }) => {
                                        // Prevent event propagation to avoid triggering card click
                                        if (domEvent) {
                                          domEvent.stopPropagation();
                                          domEvent.preventDefault();
                                        }
                                        handleMenuClick(key, vehicle);
                                      }}
                                    >
                                      <Menu.Item key="edit">Edit</Menu.Item>
                                      <Menu.Item key="delete">Delete</Menu.Item>
                                    </Menu>
                                  }
                                  trigger={["click"]}
                                  placement="bottomRight"
                                >
                                  <div
                                    className="white-dots-img"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                  >
                                    <img
                                      src="/assets/img/white-dots.png"
                                      alt="menu"
                                    />
                                  </div>
                                </Dropdown>
                              )
                            }
                            onClick={() =>
                              navigate(`/vehicle/vehicle-detail/${vehicle.id}`)
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h3 className="color-white">
                        {selectedCategory && selectedCategory !== "all"
                          ? "No vehicles found in this category"
                          : "No vehicles found"}
                      </h3>
                      <p className="color-white-500">
                        {selectedCategory && selectedCategory !== "all"
                          ? "Try selecting a different category or subcategory"
                          : "No vehicles are currently available"}
                      </p>
                      {selectedCategory && selectedCategory !== "all" && (
                        <button
                          className="btn btn-outline-light mt-2"
                          onClick={() => {
                            setSelectedCategory("all");
                            setSelectedSubcategory(null);
                          }}
                        >
                          Show All Vehicles
                        </button>
                      )}
                    </div>
                  )}
                </div>

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
                        `${range[0]}-${range[1]} of ${total} posts`
                      }
                      onChange={handlePageChange}
                      className="custom-pagination"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Edit Vehicle Modal */}
      </InnerLayout>
    </>
  );
};

export default Vehicle;
