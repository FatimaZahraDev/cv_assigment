import React, { useMemo, useState } from "react";
import { Popover, Tooltip } from "antd";
import EmojiPicker from "emoji-picker-react";
import { useMutation } from "@/hooks/reactQuery";

/**
 * ReactionBar component
 * - Displays existing reaction counters
 * - Opens selector to add/change a reaction
 * - Integrates with API via endpoint keys
 */
const ReactionBar = ({
  postId,
  subjectId,
  subjectType = "comment", // 'comment' | 'reply'
  existingReactions = [], // [{ emoji: '👍', by: 1, count: 3 } | per react-reactions SlackCounter API]
}) => {
  const [reactions, setReactions] = useState(existingReactions);
  const [open, setOpen] = useState(false);

  const endpointAdd = useMemo(
    () => (subjectType === "reply" ? "addReplyReaction" : "addCommentReaction"),
    [subjectType]
  );
  const endpointList = useMemo(
    () =>
      subjectType === "reply" ? "listReplyReactions" : "listCommentReactions",
    [subjectType]
  );

  const { mutate: addReaction, isPending } = useMutation(endpointAdd, {
    // We don't invalidate a list here; callers can refetch comments if needed
    showSuccessNotification: false,
    onSuccess: (response) => {
      const serverCounters = response?.data?.reactions || response?.data || [];
      if (Array.isArray(serverCounters) && serverCounters.length) {
        setReactions(serverCounters);
      }
      setOpen(false);
    },
  });

  const handleSelect = (emojiData) => {
    // emoji-picker-react provides { unified, names, emoji, ... }
    const value = emojiData?.emoji || "";
    if (!value || !postId || !subjectId) return;

    const baseSlug =
      subjectType === "reply"
        ? `${postId}/comments/${subjectId.commentId}/replies/${subjectId.replyId}/reactions`
        : `${postId}/comments/${subjectId}/reactions`;

    addReaction({
      slug: baseSlug,
      data: { reaction: value },
    });
  };

  const totalCount = useMemo(() => {
    if (!Array.isArray(reactions) || reactions.length === 0) return 0;
    return reactions.reduce((sum, r) => sum + (r.count || r.value || 0), 0);
  }, [reactions]);

  return (
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center">
        {Array.isArray(reactions) && reactions.length > 0 ? (
          <div className="d-flex align-items-center">
            {reactions.slice(0, 5).map((r, idx) => (
              <span key={idx} className="me-1" style={{ fontSize: 18 }}>
                {r.emoji || r.symbol || r.label || ""}
              </span>
            ))}
            <span className="ms-1 color-white-500">{totalCount || 0}</span>
          </div>
        ) : (
          <span className="color-white-500">0</span>
        )}
      </div>
      <Popover
        trigger="click"
        open={open}
        onOpenChange={(v) => setOpen(v)}
        content={<EmojiPicker onEmojiClick={(e) => handleSelect(e)} />}
      >
        <button
          className="btn btn-sm btn-link ms-3 p-0"
          disabled={isPending}
          aria-label="Add reaction"
          type="button"
        >
          <img src="/assets/img/emoji-add.png" alt="Add reaction" />
        </button>
      </Popover>
    </div>
  );
};

export default ReactionBar;
