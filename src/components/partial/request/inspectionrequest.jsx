import React from "react";
import { useQuery } from "@/hooks/reactQuery";
import { DeleteOutlined } from "@ant-design/icons";
import InspectionCard from "@/components/shared/card/inspectioncard";
import { Skeleton, Pagination } from "antd";
import { useMutation } from "@/hooks/reactQuery";
import useSweetAlert from "@/hooks/useSweetAlert";
import FlatButton from "@/components/shared/button/flatbutton";

const InspectionRequest = () => {
  const {
    data: getInspectionRequest,
    loading: isLoading,
    isError,
    error,
    pagination,
    setQueryParams,
  } = useQuery("getInspectionRequest", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 4,
    },
  });
  const handlePageChange = (page, pageSize) => {
    setQueryParams({
      page,
      per_page: pageSize,
    });
  };

  // 👉 Backend se data array
  const requests = getInspectionRequest || [];
  const { showAlert } = useSweetAlert();

  const { mutate: deleteInspection } = useMutation("deleteInspectionRequest", {
    showSuccessNotification: true,
    invalidateQueries: [{ queryKey: ["getInspectionRequest"] }],
  });

  const handleDelete = async (id) => {
    const result = await showAlert({
      title: "Are you sure?",
      text: "Do you want to delete this inspection request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      deleteInspection({ slug: id, data: "" });
    }
  };

  console.log("Inspection Requests:", requests);
  return (
    <>
      <div className="row">
        {/* 👉 Loading State */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div className="col-12 col-md-6 col-lg-6 mb-4" key={index}>
              <div className="token-card p-3">
                <div className="token-card-header d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Skeleton.Avatar active size={50} shape="circle" />
                    <div className="ms-2">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 120 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 180, marginTop: 8 }}
                      />
                    </div>
                  </div>
                  <Skeleton.Avatar active size={30} shape="circle" />
                </div>

                <div className="token-body mt-3">
                  <Skeleton.Input
                    active
                    style={{ width: "60%", marginBottom: 10 }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: "80%", marginBottom: 10 }}
                  />
                  <Skeleton.Input active style={{ width: "90%" }} />
                </div>

                <div className="d-flex align-items-center justify-content-end mt-4 gap-2">
                  <Skeleton.Button active style={{ width: 100, height: 35 }} />
                  <Skeleton.Button active style={{ width: 100, height: 35 }} />
                </div>
              </div>
            </div>
          ))}

        {/* 👉 Error State */}
        {isError && (
          <div className="col-12">
            <p className="text-danger">
              Failed to load requests: {error?.message}
            </p>
          </div>
        )}

        {/* 👉 Data Render */}
        {!isLoading &&
          !isError &&
          requests.map((req) => (
            <div className="col-12 col-md-6 col-lg-6 mb-4" key={req.id}>
              <div>
                <InspectionCard
                  my_profile_img={
                    req?.user?.profile_image || "/assets/img/dummy.png"
                  }
                  user_name={req?.user?.name || "N/A"}
                  request_for_car={`${req?.vehicle_ad?.make?.name || ""} ${
                    req?.vehicle_ad?.model?.name || ""
                  } (${req?.vehicle_ad?.year?.name || ""})`}
                  request_for=""
                  request_status={
                    <span
                      style={{
                        color:
                          req?.status === "pending"
                            ? "orange"
                            : req?.status === "completed"
                            ? "green"
                            : req?.status === "inprogress"
                            ? "blue"
                            : "black", // default
                      }}
                    >
                      {req?.status || "N/A"}
                    </span>
                  }
                  service_price={
                    req?.inspector_price || req?.inspector_price || "N/A"
                  }
                  inspector_img={
                    req?.inspector?.profile_image || "/assets/img/dummy.png"
                  }
                  inspector_name={req?.inspector?.name || "N/A"}
                  inspector_location={`${req?.inspector?.city || "N/A"}  ${
                    req?.inspector?.state || "N/A"
                  }`}
                  payment_status={req?.payment_status || "N/A"}
                  request_time={
                    req?.inspection_time_start ||
                    req?.inspection_time ||
                    req?.inspection_time_end
                      ? `${(
                          req?.inspection_time_start ||
                          req?.inspection_time ||
                          ""
                        )
                          ?.toString()
                          ?.slice(0, 5)}${
                          req?.inspection_time_end
                            ? ` - ${req?.inspection_time_end
                                ?.toString()
                                ?.slice(0, 5)}`
                            : ""
                        }`
                      : "N/A"
                  }
                  request_date={
                    req?.inspection_date_start ||
                    req?.inspection_date ||
                    req?.inspection_date_end
                      ? `${
                          req?.inspection_date_start ||
                          req?.inspection_date ||
                          ""
                        }${
                          req?.inspection_date_end
                            ? ` - ${req?.inspection_date_end}`
                            : ""
                        }`
                      : "N/A"
                  }
                  deleteButton={
                    <FlatButton
                      title={<DeleteOutlined />}
                      className="req-delete-btn"
                      onClick={() => handleDelete(req.id)}
                    />
                  }
                />
              </div>
            </div>
          ))}
        {!isLoading && !isError && requests.length === 0 && (
          <div className="col-12 text-center py-5">
            <h3 className="color-white fon-18">You don’t have any requests</h3>
          </div>
        )}
        {pagination && pagination.total > 0 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination
              current={pagination?.currentPage || pagination?.current_page || 1}
              total={pagination?.total || pagination?.count || 0}
              pageSize={pagination?.perPage || pagination?.per_page || 4}
              pageSizeOptions={["4", "10", "20", "50", "100"]}
              showSizeChanger
              showQuickJumper
              onChange={handlePageChange}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InspectionRequest;
