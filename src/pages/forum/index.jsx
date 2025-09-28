import React, { useState } from "react";
import InnerLayout from "@/components/shared/layout/innerlayout";
import BaseInput from "@/components/shared/inputs";
import { Spin, Skeleton, Empty, Pagination, Dropdown } from "antd";
import CommunityCard from "@/components/shared/card/communitycard";
import AddForum from "./add";
import { useQuery, useMutation } from "@/hooks/reactQuery";
import useSweetAlert from "@/hooks/useSweetAlert";
import { Menu } from "antd";

const Forum = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const { showAlert } = useSweetAlert();

  // Simple pagination implementation as requested - copied from event module
  const { loading, data, pagination, setQueryParams } = useQuery("getForum", {
    enablePagination: true,
    defaultQueryParams: {
      page: 1,
      per_page: 4,
    },
  });
  const currentUserId = window?.user?.user?.id;

  console.log("forum data", data);
  const { mutate: deleteForum, isPending: isDeleting } = useMutation(
    "deleteForum",
    {
      invalidateQueries: [{ queryKey: ["getForum"] }],
      showSuccessNotification: true,
      onSuccess: async () => {},
    }
  );

  const { mutate: toggleLike } = useMutation("likeForum", {
    invalidateQueries: [{ queryKey: ["getForum"] }, { queryKey: ["getTrendingForum"] }],
    showSuccessNotification: false, // Suppress notification for post likes
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

  const handlePageChange = (page, pageSize) => {
    setQueryParams({
      ...filters,
      page,
      per_page: pageSize,
      keyword: searchTerm,
    });
  };

  const handleMenuClick = (key, post) => {
    if (key === "edit") {
      // Find the most up-to-date post data from the current data array
      const freshPost = data?.find((p) => p.id === post.id) || post;
      console.log("Setting selected post for edit:", freshPost);
      setSelectedPost(freshPost);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (key === "delete") {
      handleDeletePost(post.id);
    }
  };

  const handleDeletePost = async (id) => {
    const result = await showAlert({
      title: "Are you sure?",
      text: `Do you want to delete this forum post?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteForum({ slug: id, data: "" });
    }
  };

  const handleEditComplete = () => {
    setSelectedPost(null); // Clear selected post after edit
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setQueryParams({
      ...filters,
      search: value,
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";

    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Helper function to get display info based on anonymous setting
  const getDisplayInfo = (post) => {
    if (post?.is_anonymous) {
      return {
        name: "Anonymous",
        image: "/assets/img/dummy.png"
      };
    }
    return {
      name: post?.user?.name || "Anonymous",
      image: post?.user?.profile_image || "/assets/img/dummy.png"
    };
  };

  // Trending Now API call
  const trendingQuery = useQuery("getTrendingForum", {
    endpoint: "forum/trending",
    defaultQueryParams: { page: 1, per_page: 3 },
  });
  const { loading: trendingLoading, data: trendingData = [], refetch: refetchTrending } = trendingQuery;

  // Trending like handler
  const handleTrendingLikeToggle = (post) => {
    toggleLike({
      slug: `${post.id}/like`,
      data: {},
      onSuccess: () => {
        refetchTrending();
      },
    });
  };

  return (
    <InnerLayout headerClass="sub-header">
      <section className="forum-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-3 col-xl-3">
              <div className="d-flex align-items-end mb-4 mt-5">
                <h2 className="color-white font-40">Filter</h2>
                <span className="color-white font-20 ms-1">
                  {pagination?.total || 0} Results
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
                  placeholder="Pick Date"
                  className="filter-select"
                  suffix={<img src="/assets/img/down-arrow.png" />}
                  type="select"
                  prefix={<img src="/assets/img/price-icon.png" />}
                />

                <BaseInput
                  placeholder="Category"
                  className="filter-select"
                  suffix={<img src="/assets/img/down-arrow.png" />}
                  type="select"
                  prefix={<img src="/assets/img/make-icon.png" />}
                />
              </div>
              <div className="footer-border">
                <h2 className="color-white mt-2 mb-3">Trending now</h2>
                {trendingLoading ? (
                  <div className="trending-skeleton">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-dark rounded p-3 mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Skeleton.Avatar size="small" active />
                          <div className="ms-2">
                            <Skeleton.Input active size="small" style={{ width: 80 }} />
                          </div>
                        </div>
                        <Skeleton active paragraph={{ rows: 2 }} />
                        <div className="d-flex align-items-center mt-2">
                          <Skeleton.Button active size="small" style={{ width: 60 }} />
                          <Skeleton.Button active size="small" style={{ width: 80, marginLeft: 16 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trendingData?.data && trendingData.data.length > 0 ? (
                  trendingData.data.map((post) => {
                    const displayInfo = getDisplayInfo(post);
                    return (
                      <CommunityCard
                        key={post.id}
                        userImage={displayInfo.image}
                        username={displayInfo.name}
                        timeAgo={formatTimeAgo(post?.created_at)}
                        description={
                          post?.description || "No description available"
                        }
                        comments={post?.comments}
                        isOwner={window.user?.user?.id === post?.user_id}
                        onMenuClick={handleMenuClick}
                        post={post}
                        isLiked={post?.is_liked || false}
                        onLikeToggle={() => handleTrendingLikeToggle(post)}
                        likearea={
                          <div
                            className="d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleLikeToggle(post)}
                          >
                            {post?.likes?.some(
                              (like) => like.user_id === currentUserId
                            ) ? (
                             <img
                                src="/assets/img/blue-like.png"
                                alt="Likes"
                                className="like-icon active "
                              />
                            ) : (
                               <img
                                src="/assets/img/like-icon.png"
                                alt="Likes"
                                className="like-icon"
                              />
                              
                            )}
                            <p className="ms-2 mt-1" style={{ color: "#fff" }}>
                              {post?.likes?.length || 0} Likes
                            </p>
                          </div>
                        }
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-3">
                    <span className="color-white-500">No trending posts</span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-8 col-lg-9 col-xl-9">
              <div className="custom-input d-flex justify-content-between mt-3 align-items-end">
                <h2 className="color-white font-50">Forum</h2>
                <div>
                  <BaseInput
                    type=""
                    placeholder="Search Posts"
                    className="tunner-select"
                    icon={<img src="/assets/img/search-icon.png" />}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Add Forum Form - Keep existing structure */}
              <div className="row mt-4">
                <div className="col-12">
                  <AddForum
                    editData={selectedPost}
                    onEditComplete={handleEditComplete}
                  />
                </div>
              </div>

              {/* Forum Posts List - Using CommunityCard with ForumImageDisplay */}
              {loading ? (
                <div className="row mt-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="col-12 mb-4">
                      <div className="bg-dark rounded p-3">
                        <div className="d-flex align-items-center mb-3">
                          <Skeleton.Avatar size="large" active />
                          <div className="ms-3">
                            <Skeleton.Input
                              active
                              size="small"
                              style={{ width: 120 }}
                            />
                            <Skeleton.Input
                              active
                              size="small"
                              style={{ width: 80, marginTop: 8 }}
                            />
                          </div>
                        </div>
                        <Skeleton active paragraph={{ rows: 3 }} />
                        <div className="d-flex align-items-center mt-3">
                          <Skeleton.Button
                            active
                            size="small"
                            style={{ width: 80 }}
                          />
                          <Skeleton.Button
                            active
                            size="small"
                            style={{ width: 100, marginLeft: 16 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Forum Posts using CommunityCard with ForumImageDisplay */}
                  <div className="row mt-4">
                    {data && data.length > 0 ? (
                      data.map((post) => {
                        const displayInfo = getDisplayInfo(post);
                        
                       
                        
                        return (
                          <div className="col-12" key={post.id}>
                            <CommunityCard
                              userImage={displayInfo.image}
                              username={displayInfo.name}
                              timeAgo={formatTimeAgo(post?.created_at)}
                              description={
                                post?.description || "No description available"
                              }
                              comments={post?.comments}
                              isOwner={window.user?.user?.id === post?.user_id}
                              onMenuClick={handleMenuClick}
                              post={post} // Pass full post object with attachments
                              isLiked={post?.is_liked || false}
                              likearea={
                                <div
                                  className="d-flex align-items-center"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleLikeToggle(post)}
                                >
                                  {post?.likes?.some(
                                    (like) => like.user_id === currentUserId
                                  ) ? (
                                    <img
                                      src="/assets/img/blue-like.png"
                                      alt="Likes"
                                      className="like-icon active "
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
                                    {post?.likes?.length || 0} Likes
                                  </p>
                                </div>
                              }
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-12 text-center py-5">
                        <h3 className="color-white">No forum posts found</h3>
                        <p className="color-white-500">
                          Try adjusting your search or create the first post
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Simple pagination - copied from event module */}
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </InnerLayout>
  );
};

export default Forum;