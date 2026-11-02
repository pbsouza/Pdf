import React from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, Reply, Send, Plus } from 'lucide-react';
import { CommentItem } from '../../types/pdf';

interface CommentsPanelProps {
  comments: CommentItem[];
  currentPage: number;
  onSelectPage: (page: number) => void;
  onAddComment: (text: string, page: number) => void;
  onAddReply: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onStatusChange: (commentId: string, status: 'open' | 'accepted' | 'resolved') => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  comments,
  currentPage,
  onSelectPage,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onStatusChange,
}) => {
  const [newCommentText, setNewCommentText] = React.useState('');
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'open' | 'accepted' | 'resolved'>('all');

  const filtered = comments.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim(), currentPage);
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;
    onAddReply(commentId, replyText.trim());
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-xs">
      {/* Top Filter */}
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850 flex items-center justify-between">
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Comments ({comments.length})</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-[11px] outline-none"
        >
          <option value="all">All ({comments.length})</option>
          <option value="open">Open</option>
          <option value="accepted">Accepted</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Add quick comment box */}
      <form onSubmit={handleCreateComment} className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850">
        <div className="flex flex-col space-y-1.5">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Add a comment on Page ${currentPage}...`}
            rows={2}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded p-1.5 text-xs outline-none focus:border-[#b70228] resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Page {currentPage}</span>
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="flex items-center space-x-1 px-2.5 py-1 bg-[#b70228] text-white rounded text-[11px] font-medium disabled:opacity-40 transition-opacity"
            >
              <Send className="w-3 h-3" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </form>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">No comments found.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPage(item.page)}
              className="bg-white dark:bg-neutral-800 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-2 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-xs"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: item.color || '#b70228' }}
                  >
                    {item.author.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">{item.author}</div>
                    <div className="text-[10px] text-neutral-400">{item.timestamp} · p.{item.page}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <select
                    value={item.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onStatusChange(item.id, e.target.value as any)}
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-medium outline-none ${
                      item.status === 'resolved'
                        ? 'border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40'
                        : item.status === 'accepted'
                        ? 'border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="accepted">Accepted</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(item.id);
                    }}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-red-500 rounded"
                    title="Delete thread"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Text */}
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                {item.text}
              </p>

              {/* Replies */}
              {item.replies && item.replies.length > 0 && (
                <div className="pl-3 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-2 mt-2 pt-1">
                  {item.replies.map((r) => (
                    <div key={r.id} className="text-[11px] space-y-0.5">
                      <div className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{r.author}</span>
                        <span className="text-[10px]">· {r.timestamp}</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {replyingToId === item.id ? (
                <div className="pt-2 flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(item.id);
                      if (e.key === 'Escape') setReplyingToId(null);
                    }}
                    placeholder="Write a reply..."
                    autoFocus
                    className="flex-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs outline-none"
                  />
                  <button
                    onClick={() => handleSendReply(item.id)}
                    className="px-2 py-1 bg-[#b70228] text-white rounded text-xs"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyingToId(item.id);
                  }}
                  className="flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 pt-1"
                >
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
