import React, { useState } from "react";
import FlatButton from "@/components/shared/button/flatbutton";
import CustomModal from "@/components/shared/modal";
import BaseInput from "@/components/shared/inputs";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { Button, Modal, Skeleton, Pagination } from "antd";
import TokenCard from "@/components/shared/card/tokencard";
import { useNavigate } from "react-router";

const TokenMoneyRequest = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const navigate = useNavigate();
  const {
    data: getRequestToken,
    loading: isLoading,
    isError,
    error,
    pagination,
    setQueryParams,
  } = useQuery("getRequestToken", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 4,
    },
  });

  // 👉 Backend se data array
  const requests = getRequestToken || [];
  const { mutate: updateRequestToken, isPending: isUpdatingStatus } =
    useMutation("updateRequestToken", {
      useFormData: false,

      invalidateQueries: [{ queryKey: ["getRequestToken"] }],
      onSuccess: () => {},
    });
  const handleStatusChange = (tokenId, updatedStatus, reason = "") => {
    const payload =
      updatedStatus === "rejected"
        ? { status: updatedStatus, reject_reason: reason }
        : { status: updatedStatus };

    updateRequestToken({
      slug: `${tokenId}/status`,
      data: payload,
    });

    console.log("Status changed:", tokenId, payload);
  };
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
              <TokenCard
                byer_img={req?.buyer?.profile_image || "/assets/img/dummy.png"}
                buyer_name={req?.buyer?.name || "N/A"}
                buyer_email={req?.buyer?.email || "N/A"}
                car_name={`${req?.vehicle_ad?.make?.name || ""} ${
                  req?.vehicle_ad?.model?.name || ""
                } (${req?.vehicle_ad?.year?.name || ""})`}
                token_amount={`$${req?.token_money || 0}`}
                buyer_concern={req?.concern || "No concern"}
                onDetailClick={() =>
                  navigate(`/vehicle/vehicle-detail/${req?.vehicle_ad?.id}`)
                }
                button_area={
                  <>
                    {req?.status === "rejected" ? (
                      <p className="text-danger fw-bold m-0">Rejected</p>
                    ) : req?.status === "approved" ? (
                      <p className="text-success fw-bold m-0">Approved</p>
                    ) : (
                      <>
                        <FlatButton
                          title="Decline"
                          className="decline-btn me-3"
                          onClick={() => {
                            setSelectedRequestId(req.id); // ✅ yaha id set karo
                            setShowRejectModal(true);
                          }}
                        />
                        <FlatButton
                          title="Accept"
                          className="accept-btn"
                          onClick={() => handleStatusChange(req.id, "approved")}
                        />
                      </>
                    )}
                  </>
                }
              />
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
              pageSize={pagination?.perPage || pagination?.per_page || 6}
              pageSizeOptions={["6", "10", "20", "50", "100"]}
              showSizeChanger
              showQuickJumper
              onChange={(page, pageSize) => setQueryParams({ page, per_page: pageSize })}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
      <CustomModal
        footer={false}
        open={showRejectModal}
        className="modal-form-input "
        onCancel={() => setShowRejectModal(false)}
        title="Reject Request"
      >
        <BaseInput
          className=""
          rows="3"
          type="textarea"
          name="reason"
          placeholder="Enter reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />

        <div className="d-flex align-items-center justify-content-end mt-4">
          <FlatButton
            className="cancel-btn"
            title="Cancel"
            onClick={() => setShowRejectModal(false)}
          />

          <FlatButton
            title="Confirm Reject"
            className="decline-btn ms-3"
            onClick={() => {
              if (selectedRequestId) {
                handleStatusChange(selectedRequestId, "rejected", rejectReason); // ✅ ab sahi id jaayegi
              }
              setShowRejectModal(false);
              setRejectReason("");
              setSelectedRequestId(null);
            }}
            disabled={!rejectReason.trim()}
          />
        </div>
        </CustomModal>
    </>
  );
};

export default TokenMoneyRequest;
