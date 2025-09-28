import React, { useState, useMemo, useEffect } from "react";
import FlatButton from "@/components/shared/button/flatbutton";
import VehicleCard from "@/components/shared/card/vehiclecard";
import BaseInput from "@/components/shared/inputs";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Menu, Dropdown } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import useSweetAlert from "@/hooks/useSweetAlert";

const Vehicle = () => {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();
  const queryClient = useQueryClient();

  // Fetch vehicles using the API (same as vehicle page)
  const { loading, data, refetch } = useQuery("getAllVehicle", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 8, // Show 8 vehicles on homepage
    },
  });

  // Mutation for deleting vehicle
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation(
    "deleteVehicleStatus",
    {
      showSuccessNotification: true,
      onSuccess: () => {
        // Aggressively clear all vehicle-related cache
        queryClient.removeQueries({ queryKey: ["getAllVehicle"] });
        queryClient.removeQueries({ queryKey: ["getMineVehicle"] });
        queryClient.removeQueries({ queryKey: ["getVehicleById"] });
        
        // Force page reload to ensure all data is updated
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    }
  );

  // Handle menu click for edit/delete actions
  const handleMenuClick = (key, vehicle) => {
    if (key === "edit") {
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

  // Transform vehicle data to match VehicleCard component format (same as vehicle page)
  const transformVehicleData = (vehicle) => {
    return {
      id: vehicle.id,
      title: `${vehicle?.make?.name || "Unknown"} ${
        vehicle?.model?.name || "Model"
      }`,
       state: vehicle?.state?.name || "",
      description: vehicle.description
        ? vehicle.description.length > 30
          ? vehicle.description.slice(0, 30) + "..."
          : vehicle.description
        : "No description available",
     
      attachments: vehicle.attachments || [],
      image:
        vehicle.attachments?.[0]?.file_url || "/assets/img/ford-mustang.png",
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
          label: vehicle?.transmission_type?.name || "Unknown Transmission",
        },
      ],
      price: vehicle.price
        ? `$${parseFloat(vehicle.price).toLocaleString()}`
        : "Price on request",
    };
  };

  return (
    <section className="vehicles-sec">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="get-all-text text-center">
              <img src="/assets/img/get-img.png" alt="" />
              <h2 className="text-appcase color-white font-65">
                Luxurious Cars
              </h2>
            </div>
          </div>
          <div className="row  justify-content-center">
            <div className="col-12 col-md-10 col-lg-9 col-xl-8 text-center">
              <p className="">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
          {/* Logos */}
          <div className="col-12">
            <div className="car-logos">
              <img
                src="/assets/img/cars-images.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Filter */}
        <div className="row">
          <div className="col-12">
            <div className="vehicles-box">
              <p className="color-red font-30">Vehicles</p>
              <p className="font-40 color-white font-500">
                Explore All Vehicles
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="row mt-5">
          {loading ? (
            // Loading state
            <div className="col-12 text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="color-white mt-2">Loading vehicles...</p>
            </div>
          ) : data && data.length > 0 ? (
            // Display API data
            data.map((vehicle) => {
              const transformedVehicle = transformVehicleData(vehicle);
              return (
                <div
                  key={vehicle.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
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
              <h3 className="color-white">No vehicles found</h3>
              <p className="color-white-500">
                No vehicles are currently available
              </p>
            </div>
          )}
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="color-white font-30">Want to explore more?</h2>
              <FlatButton
                title="Explore More Cars"
                className="login-btn"
                onClick={() => navigate("/vehicle")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vehicle;