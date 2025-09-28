import React from "react";
import CommunityCard from "@/components/shared/card/communitycard";
import FlatButton from "@/components/shared/button/flatbutton";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import { useNavigate } from "react-router";

const Community = () => {
  const navigate = useNavigate();

  // Fetch forum posts using the API (exactly same as forum page)
  const { loading, data } = useQuery("getForum", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 4, // Get 4 posts for the homepage layout
    },
  });

  // Get current user ID (same as forum page)
  const currentUserId = window?.user?.user?.id;

  const { mutate: toggleLike } = useMutation("likeForum", {
    invalidateQueries: [{ queryKey: ["getForum"] }],
    showSuccessNotification: false,
    onSuccess: (response, variables) => {
      console.log("Like toggled successfully for post:", variables.slug);
    },
    onError: (error) => {
      console.error("Failed to toggle like:", error);
    },
  });

  const handleLikeToggle = (post) => {
    toggleLike({ slug: `${post.id}/like`, data: {} });
  };

  // Format time ago (exactly same logic as forum page)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown time";
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Helper function to get display info based on anonymous setting
  const getDisplayInfo = (post) => {
    if (post?.is_anonymous) {
      return {
        name: "Anonymous",
        image: "/assets/img/dummy.png",
      };
    }
    return {
      name: post?.user?.name || "Anonymous",
      image: post?.user?.profile_image || "/assets/img/dummy.png",
    };
  };

  const handleForumClick = () => {
    navigate("/forum");
  };

  console.log("Forum API data:", data);

  return (
    <section className="community-sec">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="event-slider-content mb-4">
              <p className="color-red font-28">Forum</p>
              <h2 className="color-white font-55">Community Forum</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {loading ? (
            // Loading state - maintain exact same structure
            <>
              <div className="col-12 col-md-4 col-xl-3">
                <div className="community-card community-height">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-6">
                <div className="community-card">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "150px" }}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-3">
                <div className="community-card community-more-detail">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Display forum posts with proper ForumImageDisplay integration
            <>
              {data && data.length > 0 ? (
                <>
                  {/* First card - 3 columns with image */}
                  <div className="col-12 col-md-4 col-xl-3">
                    <div style={{ cursor: "pointer" }}>
                      <CommunityCard
                        onBodyClick={handleForumClick}
                        cardClass="community-height"
                        userImage={getDisplayInfo(data[0]).image}
                        username={getDisplayInfo(data[0]).name}
                        timeAgo={formatTimeAgo(data[0]?.created_at)}
                        description={
                          data[0]?.description || "No description available"
                        }
                        comments={data[0]?.comments}
                        isOwner={window.user?.user?.id === data[0]?.user_id}
                        post={data[0]} // Pass full post object for ForumImageDisplay
                        isLiked={data[0]?.is_liked || false}
                        likearea={
                          <div
                            className="d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(data[0]);
                            }}
                          >
                            {data[0]?.likes?.some(
                              (like) => like.user_id === currentUserId
                            ) ? (
                              <img
                                src="/assets/img/blue-like.png"
                                alt="Likes"
                                className="like-icon active"
                              />
                            ) : (
                              <img
                                src="/assets/img/like-icon.png"
                                alt="Likes"
                                className="like-icon"
                              />
                            )}
                            <p className="ms-2 mt-1" style={{ color: "#fff" }}>
                              {data[0]?.likes?.length || 0} Likes
                            </p>
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Second section - 6 columns */}
                  <div className="col-12 col-md-4 col-xl-6">
                    {/* First card in 6-col section - without image header */}
                    {data[1] && (
                      <div style={{ cursor: "pointer" }}>
                        <CommunityCard
                          onBodyClick={handleForumClick}
                          userImage={getDisplayInfo(data[1]).image}
                          username={getDisplayInfo(data[1]).name}
                          timeAgo={formatTimeAgo(data[1]?.created_at)}
                          description={
                            data[1]?.description || "No description available"
                          }
                          comments={data[1]?.comments}
                          isOwner={window.user?.user?.id === data[1]?.user_id}
                          post={data[1]} // Pass full post object for ForumImageDisplay
                          isLiked={data[1]?.is_liked || false}
                          showHeader={false} // Don't show image header for this card
                          likearea={
                            <div
                              className="d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeToggle(data[1]);
                              }}
                            >
                              {data[1]?.likes?.some(
                                (like) => like.user_id === currentUserId
                              ) ? (
                                <img
                                  src="/assets/img/blue-like.png"
                                  alt="Likes"
                                  className="like-icon active"
                                />
                              ) : (
                                <img
                                  src="/assets/img/like-icon.png"
                                  alt="Likes"
                                  className="like-icon"
                                />
                              )}
                              <p
                                className="ms-2 mt-1"
                                style={{ color: "#fff" }}
                              >
                                {data[1]?.likes?.length || 0} Likes
                              </p>
                            </div>
                          }
                        />
                      </div>
                    )}

                    {/* Second card in 6-col section - with image */}
                    {data[2] && (
                      <div style={{ cursor: "pointer" }}>
                        <CommunityCard
                          onBodyClick={handleForumClick}
                          userImage={getDisplayInfo(data[2]).image}
                          username={getDisplayInfo(data[2]).name}
                          timeAgo={formatTimeAgo(data[2]?.created_at)}
                          description={
                            data[2]?.description || "No description available"
                          }
                          comments={data[2]?.comments}
                          isOwner={window.user?.user?.id === data[2]?.user_id}
                          post={data[2]} // Pass full post object for ForumImageDisplay
                          isLiked={data[2]?.is_liked || false}
                          cardClass="community-img-height mt-3"
                          likearea={
                            <div
                              className="d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeToggle(data[2]);
                              }}
                            >
                              {data[2]?.likes?.some(
                                (like) => like.user_id === currentUserId
                              ) ? (
                                <img
                                  src="/assets/img/blue-like.png"
                                  alt="Likes"
                                  className="like-icon active"
                                />
                              ) : (
                                <img
                                  src="/assets/img/like-icon.png"
                                  alt="Likes"
                                  className="like-icon"
                                />
                              )}
                              <p
                                className="ms-2 mt-1"
                                style={{ color: "#fff" }}
                              >
                                {data[2]?.likes?.length || 0} Likes
                              </p>
                            </div>
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Third card - 3 columns with image and extra description */}
                  <div className="col-12 col-md-4 col-xl-3">
                    {data[3] && (
                      <div style={{ cursor: "pointer" }}>
                        <CommunityCard
                          onBodyClick={handleForumClick   }
                          userImage={getDisplayInfo(data[3]).image}
                          username={getDisplayInfo(data[3]).name}
                          timeAgo={formatTimeAgo(data[3]?.created_at)}
                          description={
                            data[3]?.description || "No description available"
                          }
                          extraDescription={
                            data[3]?.description || "No description available"
                          }
                          comments={data[3]?.comments}
                          isOwner={window.user?.user?.id === data[3]?.user_id}
                          post={data[3]} // Pass full post object for ForumImageDisplay
                          isLiked={data[3]?.is_liked || false}
                          cardClass="community-more-detail"
                          likearea={
                            <div
                              className="d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeToggle(data[3]);
                              }}
                            >
                              {data[3]?.likes?.some(
                                (like) => like.user_id === currentUserId
                              ) ? (
                                <img
                                  src="/assets/img/blue-like.png"
                                  alt="Likes"
                                  className="like-icon active"
                                />
                              ) : (
                                <img
                                  src="/assets/img/like-icon.png"
                                  alt="Likes"
                                  className="like-icon"
                                />
                              )}
                              <p
                                className="ms-2 mt-1"
                                style={{ color: "#fff" }}
                              >
                                {data[3]?.likes?.length || 0} Likes
                              </p>
                            </div>
                          }
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Fallback to static data if no API data - maintain exact same structure
                <>
                  <div className="col-12 col-md-4 col-xl-3">
                    <CommunityCard
                      cardClass="community-height"
                      image="/assets/img/community-card-img.png"
                      userImage="/assets/img/akera-img.png"
                      username="Anonymous 1"
                      timeAgo="12 hour ago"
                      title="Do we have Modded cars?"
                      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      likes={256}
                      comments={10}
                    />
                  </div>
                  <div className="col-12 col-md-4 col-xl-6">
                    <CommunityCard
                      userImage="/assets/img/akera-img.png"
                      username="Anonymous 1"
                      timeAgo="12 hour ago"
                      title="Do we have Modded cars?"
                      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      likes={256}
                      comments={10}
                      showHeader={false}
                    />
                    <CommunityCard
                      image="/assets/img/community-card-img.png"
                      userImage="/assets/img/akera-img.png"
                      username="Anonymous 1"
                      timeAgo="12 hour ago"
                      title="Do we have Modded cars?"
                      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      likes={256}
                      comments={10}
                      cardClass="community-img-height mt-3"
                    />
                  </div>
                  <div className="col-12 col-md-4 col-xl-3">
                    <CommunityCard
                      image="/assets/img/community-card-img.png"
                      userImage="/assets/img/akera-img.png"
                      username="Anonymous 1"
                      timeAgo="12 hour ago"
                      title="Do we have Modded cars?"
                      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      extraDescription="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      likes={256}
                      comments={10}
                      cardClass="community-more-detail"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-12  col-md-10 col-lg-8 text-center">
            <p className="font-14 color-white-800 mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <FlatButton
              title="Read More"
              className="login-btn theme-button"
              onClick={() => navigate("/forum")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
