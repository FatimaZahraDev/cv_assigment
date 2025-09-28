import React from "react";
import FlatButton from "./flatbutton";
import { useNavigate } from "react-router";
import useSweetAlert from "@/hooks/useSweetAlert";

const MarkAsInterestedButton = ({
  eventId,
  interestedUsers = [],
  onMarkAsInterested,
  className = "",
  ...props
}) => {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();
  const isInterested = interestedUsers.some(
    (user) => user.id === window?.user?.user?.id
  );

  const handleClick = (e) => {
    e.stopPropagation();
    if (window.user && window.user.user) {
      if (onMarkAsInterested) {
        onMarkAsInterested(eventId);
      }
    } else {
      showAlert({
        title: "Login Required",
        text: "You need to login first to access this feature.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <FlatButton
      title={isInterested ? "Interested" : "Mark As Interested"}
      className={className}
      onClick={handleClick}
      {...props}
    />
  );
};

export default MarkAsInterestedButton;
