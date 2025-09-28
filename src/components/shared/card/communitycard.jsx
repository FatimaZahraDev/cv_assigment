import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Modal, Form } from "antd";
import { useMutation } from "@/hooks/reactQuery";
import CustomModal from "../modal";
import BaseInput from "@/components/shared/inputs";
import FlatButton from "@/components/shared/button/flatbutton";
import ForumImageDisplay from "./ForumImageDisplay";
import { p } from "framer-motion/client";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now";

  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const CommentBox = ({
  comment,
  onReply,
  post,
  onSetReplyingTo,
  commentInputRef,
  
}) => {
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(comment.user_reaction);
  const [showAllReplies, setShowAllReplies] = useState(false); // State to control reply visibility
  const [commentReactions, setCommentReactions] = useState(
    comment.reactions || []
  ); // Store reactions array from API
  const [userCurrentReaction, setUserCurrentReaction] = useState(null); // Track current user's reaction
  const reactionsRef = React.useRef(null);

  // Process reactions from API response to get counts by type
  const getReactionCounts = (reactionsArray) => {
    const counts = {};
    if (Array.isArray(reactionsArray)) {
      reactionsArray.forEach((reaction) => {
        const type = reaction.reaction;
        counts[type] = (counts[type] || 0) + 1;
      });
    }
    return counts;
  };

  // Get current user's reaction from reactions array
  const getCurrentUserReaction = (reactionsArray) => {
    if (!Array.isArray(reactionsArray)) return null;
    const currentUserId = window?.user?.user?.id;
    if (!currentUserId) return null;

    const userReaction = reactionsArray.find(
      (reaction) => reaction.user_id === currentUserId
    );
    return userReaction ? userReaction.reaction : null;
  };

  const reactionCounts = getReactionCounts(commentReactions);

  // Update user's current reaction when commentReactions change
  React.useEffect(() => {
    const currentUserReaction = getCurrentUserReaction(commentReactions);
    setUserCurrentReaction(currentUserReaction);
  }, [commentReactions]);

  // Close reactions dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactions]);

  const reactions = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😠", label: "Angry" },
  ];

  const { mutate: likeComment } = useMutation("likeForumComment", {
    onSuccess: (data) => {
      setIsLiked(data.data.is_liked);
      setLikesCount(data.data.likes_count);
    },
    showSuccessNotification: false, // Add this line to suppress notification
  });

  const { mutate: addReaction } = useMutation("addCommentReaction", {
    invalidateQueries: [
      { queryKey: ["getForum"] },
      { queryKey: ["getTrendingForum"] },
    ],
    onSuccess: (data) => {
      if (data?.data) {
        // Update reactions array if provided
        if (data.data.reactions && Array.isArray(data.data.reactions)) {
          setCommentReactions(data.data.reactions);
        }
      }
      setShowReactions(false);
    },
    onError: (error) => {
      console.error("Failed to add reaction:", error);
      // Revert optimistic update on error
      setUserCurrentReaction(getCurrentUserReaction(commentReactions));
    },
    showSuccessNotification: false, // Suppress notification
  });

  const handleReaction = (reactionType) => {
    const currentUserId = window?.user?.user?.id;
    if (!currentUserId) return;

    // Optimistic update for immediate UI feedback
    if (userCurrentReaction === reactionType) {
      // User is removing their current reaction
      setUserCurrentReaction(null);
      // Remove user's reaction from the reactions array
      setCommentReactions((prev) =>
        prev.filter(
          (reaction) =>
            !(
              reaction.user_id === currentUserId &&
              reaction.reaction === reactionType
            )
        )
      );
    } else {
      // User is adding a new reaction or changing their reaction
      setUserCurrentReaction(reactionType);

      // Update reactions array optimistically
      setCommentReactions((prev) => {
        // Remove any existing reaction from this user
        const withoutUserReaction = prev.filter(
          (reaction) => reaction.user_id !== currentUserId
        );
        // Add the new reaction
        return [
          ...withoutUserReaction,
          { user_id: currentUserId, reaction: reactionType },
        ];
      });
    }

    // Make the API call
    addReaction({
      slug: `${comment.id}/react`,
      data: { reaction: reactionType },
    });
  };

  return (
    <div className="modal-comment-box">
      <div className="d-flex mb-3">
        <div className="comment-user-img me-3">
          <img
            src={comment.user?.avatar || "/assets/img/seller-profile.png"}
            alt="Anonymous" // Always anonymous
          />
        </div>
        <div className="comment-content w-100">
          <div className="d-flex align-items-center">
            <p className="font-600 me-2">Anonymous</p> {/* Always anonymous */}
            <p className="color-white-500">
              {formatTimeAgo(comment.created_at)}
            </p>
          </div>
          <p className="font-14 color-white-500 mt-1">{comment.comment}</p>
          <div className="d-flex align-items-center mt-2">
            {/* Display existing reactions with counts */}
            <div className="d-flex align-items-center">
              {(() => {
                const reactionEntries = Object.entries(reactionCounts).filter(
                  ([_, count]) => count > 0
                );
                const maxDisplay = 5;
                const displayReactions = reactionEntries.slice(0, maxDisplay);
                const remainingCount = reactionEntries.length - maxDisplay;

                return (
                  <>
                    {displayReactions.map(([reactionType, count]) => {
                      const reactionEmoji =
                        reactions.find((r) => r.type === reactionType)?.emoji ||
                        "👍";
                      return (
                        <div
                          key={reactionType}
                          className="d-flex align-items-center  py-1 rounded"
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                          // onClick={() => handleReaction(reactionType)}
                        >
                          <span className="me-1">{reactionEmoji}</span>
                          <span style={{ color: "#fff" }}>{count}</span>
                        </div>
                      );
                    })}
                    {remainingCount > 0 && (
                      <div
                        className="d-flex align-items-center me-2 px-2 py-1 rounded"
                        style={{
                          backgroundColor: "#333",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      >
                        +{remainingCount} more
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="position-relative" ref={reactionsRef}>
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setShowReactions(!showReactions)}
              >
                <p className="ms-2" style={{ color: "#fff" }}>
                  React
                </p>
              </div>

              {showReactions && (
                <div
                  className="position-absolute bg-dark border rounded p-2 d-flex gap-2"
                  style={{
                    bottom: "100%",
                    left: 0,
                    zIndex: 1000,
                    minWidth: "200px",
                    marginBottom: "5px",
                  }}
                >
                  {reactions.map((reaction) => (
                    <div
                      key={reaction.type}
                      className={`text-center p-1 rounded ${
                        userCurrentReaction === reaction.type
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                      style={{ cursor: "pointer", minWidth: "30px" }}
                      onClick={() => handleReaction(reaction.type)}
                      title={reaction.label}
                    >
                      <span style={{ fontSize: "18px" }}>{reaction.emoji}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Only show Reply text for parent comments (not replies) */}
            {!comment.parent_id && (
              <a
                onClick={() => {
                  console.log("Reply clicked for comment:", comment.id);
                  onSetReplyingTo(comment);
                  // Scroll to comment input box
                  if (commentInputRef && commentInputRef.current) {
                    commentInputRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                className="ms-3"
                style={{ cursor: "pointer" }}
              >
                Reply
              </a>
            )}
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="replies-section mt-3 ps-5">
              {/* Show first reply or all replies based on showAllReplies state */}
              {(showAllReplies
                ? comment.replies
                : comment.replies.slice(0, 1)
              ).map((reply) => (
                <CommentBox
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  post={post}
                  onSetReplyingTo={onSetReplyingTo}
                  commentInputRef={commentInputRef}
                />
              ))}

              {/* Show "Show more comments" if there are more than 1 reply and not all are shown */}
              {comment.replies.length > 1 && !showAllReplies && (
                <div className="mt-2">
                  <a
                    onClick={() => setShowAllReplies(true)}
                    className="color-primary"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                  >
                    Show more comments ({comment.replies.length - 1} more)
                  </a>
                </div>
              )}

              {/* Show "Show less" option when all replies are displayed */}
              {comment.replies.length > 1 && showAllReplies && (
                <div className="mt-2">
                  <a
                    onClick={() => setShowAllReplies(false)}
                    className="color-primary"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                  >
                    Show less comments
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommunityCard = ({
  image,
  userImage,
  username,
  timeAgo,
  description,
  likes,
  comments,
  showHeader = true,
  cardClass = "",
  onMenuClick,
  isOwner = false,
  post = null,
  isLiked = false,
  onLikeToggle,
  likearea,
  onBodyClick
}) => {
  const [currentLikes, setCurrentLikes] = useState(likes || 0);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [form] = Form.useForm();
  const [postComments, setPostComments] = useState(comments || []);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we're replying to
  const [showAllComments, setShowAllComments] = useState(false); // State to control main comments visibility
  const commentInputRef = React.useRef(null); // Ref for scrolling to comment input

  // Function to organize comments - now handles both old flat structure and new nested structure
  const organizeComments = (commentsData) => {
    if (!Array.isArray(commentsData)) return [];

    // Check if comments already have replies array (new structure)
    const hasNestedReplies = commentsData.some(
      (comment) => comment.replies && Array.isArray(comment.replies)
    );

    if (hasNestedReplies) {
      // New structure: comments already have replies array
      return commentsData.map((comment) => ({
        ...comment,
        replies: comment.replies || [],
      }));
    } else {
      // Old structure: flat comments that need to be organized
      // Separate parent comments and replies
      const parentComments = commentsData.filter(
        (comment) => !comment.parent_id
      );
      const replies = commentsData.filter((comment) => comment.parent_id);

      // Attach replies to their parent comments
      const threaded = parentComments.map((parent) => {
        const parentReplies = replies.filter(
          (reply) => reply.parent_id === parent.id
        );
        return {
          ...parent,
          replies: parentReplies,
        };
      });

      return threaded;
    }
  };

  // Organize comments whenever the comments prop changes
  useEffect(() => {
    const organized = organizeComments(comments || []);
    setPostComments(organized);
  }, [comments]);

  useEffect(() => {
    setCurrentLikes(likes || 0);
    setCurrentIsLiked(isLiked);
  }, [likes, isLiked]);

  const { mutate: addComment, isPending: isAddingComment } = useMutation(
    "createForumComment",
    {
      invalidateQueries: [
        { queryKey: ["getForum"] },
        { queryKey: ["getTrendingForum"] },
      ],
      useFormData: false, // Send as JSON, not FormData
      showSuccessNotification: false, // Don't show success notification for comments
      onSuccess: (response) => {
        setNewComment("");
        setReplyingTo(null);
        if (response?.data) {
          const newComment = response.data;
          setPostComments((prev) => {
            // Insert new comment at the top
            const updated = [
              { ...newComment, replies: newComment.replies || [] },
              ...prev,
            ];
            // If we now have more than 4 comments and showAllComments was true, keep it true
            // Otherwise, ensure showAllComments is false so the new comment is visible in the first 4
            if (updated.length > 4) {
              setShowAllComments(false); // Reset to show first 4 including the new comment
            }
            return updated;
          });
        }
        form.resetFields(["comment"]);
      },

      onError: (error) => {
        console.error("Failed to add comment:", error);
        // Show user-friendly error message
        if (error?.message) {
          console.error("Error details:", error.message);
        }
        if (error?.status) {
          console.error("HTTP Status:", error.status);
        }
      },
    }
  );

  const { mutate: addReply, isPending: isAddingReply } = useMutation(
    "replyToComment",
    {
      useFormData: false, // Send as JSON, not FormData
      showSuccessNotification: false,
      invalidateQueries: [
        { queryKey: ["getForum"] },
        { queryKey: ["getTrendingForum"] },
      ], // Don't show success notification for replies
      onSuccess: (response) => {
        setNewComment("");
        setReplyingTo(null); // Clear reply state
        if (response?.data) {
          const newReply = response.data;

          // Function to add reply to the correct parent comment
          const addReplyToThreaded = (comments, reply) => {
            return comments.map((comment) => {
              if (comment.id === reply.parent_id) {
                // Add reply to this comment's replies array
                return {
                  ...comment,
                  replies: [...(comment.replies || []), reply],
                };
              }
              // Handle nested replies (replies to replies) - search in existing replies
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReplyToThreaded(comment.replies, reply),
                };
              }
              return comment;
            });
          };

          setPostComments((prev) => {
            const updated = addReplyToThreaded(prev, newReply);
            return updated;
          });
        }
        form.resetFields(["comment"]);
      },
      onError: (error) => {
        console.error("Failed to add reply:", error);
        if (error?.message) {
          console.error("Reply error details:", error.message);
        }
        if (error?.status) {
          console.error("HTTP Status:", error.status);
        }
      },
    }
  );

  // Calculate total comment count including replies
  const getTotalCommentCount = (threadedComments) => {
    if (!Array.isArray(threadedComments)) return 0;

    return threadedComments.reduce((total, comment) => {
      // Count the parent comment
      let count = 1;
      // Count all replies
      if (comment.replies && Array.isArray(comment.replies)) {
        count += comment.replies.length;
      }
      return total + count;
    }, 0);
  };

  const handleCommentsClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() && post?.id) {
      if (replyingTo) {
        // We're replying to a comment

        addReply({
          slug: `${post.id}/comments`,
          data: {
            comment: newComment,
            parent_id: replyingTo.id,
          },
        });
      } else {
        // We're adding a new parent comment

        addComment({
          slug: `${post.id}/comments`,
          data: { comment: newComment },
        });
      }
    } else {
      console.warn("Cannot add comment:", {
        hasComment: !!newComment.trim(),
        hasPostId: !!post?.id,
        postId: post?.id,
        user: window.user,
      });
    }
  };

  const handleAddReply = (commentId, replyText) => {
    addReply({
      slug: `${post.id}/comments`,
      data: {
        comment: replyText,
        parent_id: commentId,
      },
    });
  };

  // Get display name based on anonymous setting
  const getDisplayName = (user, isAnonymous) => {
    return isAnonymous ? "Anonymous" : user?.name || "Anonymous";
  };

  return (
    <div className={`community-card ${cardClass}`}>
      {/* Use ForumImageDisplay component for multiple images with Swiper and lightbox */}
      {showHeader && post?.attachments && post.attachments.length > 0 && (
        <div className="community-header">
          <ForumImageDisplay
            attachments={post.attachments}
            postTitle={description || "Forum Post"}
          />
        </div>
      )}

      {/* Fallback for old image prop when showHeader is true but no post attachments */}
      {showHeader &&
        image &&
        (!post?.attachments || post.attachments.length === 0) && (
          <div className="community-header">
            <img src={image} alt="Forum post" className="event-img-height" />
          </div>
        )}

      <div className="community-body mt-3" onClick={onBodyClick}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="community-user-img">
              <img
                src={userImage}
                alt={getDisplayName(post?.user, post?.is_anonymous)}
              />
            </div>
            <div className="ms-2">
              <p className="font-600">
                {getDisplayName(post?.user, post?.is_anonymous)}
              </p>
              <p className="color-white-500">{timeAgo}</p>
            </div>
          </div>

          {isOwner && (
            <Dropdown
              menu={{
                items: [
                  { key: "edit", label: "Edit" },
                  { key: "delete", label: "Delete" },
                ],
                onClick: ({ key }) => onMenuClick(key, post),
              }}
              trigger={["click"]}
            >
              <span>
                <img
                  src="/assets/img/dot-vertical.png"
                  alt="Options"
                  style={{ cursor: "pointer" }}
                />
              </span>
            </Dropdown>
          )}
        </div>

        <p className="font-14 color-white-500 mt-3">{description}</p>

        <div className="d-flex align-items-center mt-3 mb-3">
          {likearea}

          <div
            className="d-flex align-items-center ms-4"
            style={{ cursor: "pointer" }}
            onClick={handleCommentsClick}
          >
            <img src="/assets/img/message-icon.png" alt="Comments" />
            <p className="ms-2 mt-1">
              {getTotalCommentCount(postComments)} Comments
            </p>
          </div>
        </div>

        <CustomModal
          title="Comments"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          className="comment-modal"
          width={1200}
        >
          <div className="mt-3">
            <div className="mt-3">
              {Array.isArray(postComments) && postComments.length > 0 ? (
                <>
                  {/* Show first 4 comments or all comments based on showAllComments state */}
                  {(showAllComments
                    ? postComments
                    : postComments.slice(0, 4)
                  ).map((comment) => (
                    <CommentBox
                      key={comment.id}
                      comment={comment}
                      onReply={handleAddReply}
                      post={post}
                      onSetReplyingTo={setReplyingTo}
                      commentInputRef={commentInputRef}
                    />
                  ))}

                  {/* Show "Show more comments" if there are more than 4 comments and not all are shown */}
                  {postComments.length > 4 && !showAllComments && (
                    <div className="mt-3 text-center">
                      <a
                        onClick={() => setShowAllComments(true)}
                        className="color-primary"
                        style={{ cursor: "pointer", fontSize: "14px" }}
                      >
                        Show more comments ({postComments.length - 4} more)
                      </a>
                    </div>
                  )}

                  {/* Show "Show less" option when all comments are displayed */}
                  {postComments.length > 4 && showAllComments && (
                    <div className="mt-3 text-center">
                      <a
                        onClick={() => setShowAllComments(false)}
                        className="color-primary"
                        style={{ cursor: "pointer", fontSize: "14px" }}
                      >
                        Show less comments
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="font-26 ">No comments yet</p>
                  <p className="color-white-500 font-16">
                    Be the first to comment
                  </p>
                </div>
              )}
            </div>
            <Form form={form}>
              {replyingTo && (
                <div className="mb-2 p-2 bg-secondary rounded d-flex justify-content-between align-items-center">
                  <small className="text-light">
                    Replying to <strong>Anonymous</strong>{" "}
                    {/* Always anonymous */}
                    <span className="ms-1 text-muted">
                      {replyingTo.comment?.length > 50
                        ? `${replyingTo.comment.substring(0, 50)}...`
                        : replyingTo.comment}
                    </span>
                  </small>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => {
                      setReplyingTo(null);
                      setNewComment("");
                    }}
                    style={{ fontSize: "12px", padding: "2px 8px" }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div
                className="modal-text-area d-flex align-items-end w-100"
                ref={commentInputRef}
              >
                <BaseInput
                  type="textarea"
                  name="comment"
                  className="form-control bg-transparent"
                  placeholder={
                    replyingTo ? `Reply to Anonymous...` : "Add a comment..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <FlatButton
                  className="btn btn-primary ms-2"
                  onClick={handleAddComment}
                  title={
                    isAddingComment
                      ? "Posting..."
                      : replyingTo
                      ? "Reply"
                      : "Post"
                  }
                  loading={isAddingComment}
                  disabled={isAddingComment || !newComment.trim()}
                />
              </div>
            </Form>
          </div>
        </CustomModal>
      </div>
    </div>
  );
};

export default CommunityCard;
