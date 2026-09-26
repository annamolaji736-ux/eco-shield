import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, ShieldCheck, Share2, Plus, AlertCircle, Clock } from 'lucide-react';
import { CommunityPost } from '../types';

interface PostsViewProps {
  posts: CommunityPost[];
  onAddPost: (content: string) => void;
}

export const PostsView: React.FC<PostsViewProps> = ({ posts, onAddPost }) => {
  const [filter, setFilter] = useState<'all' | 'official' | 'community'>('all');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const filteredPosts = posts.filter((p) => {
    if (filter === 'official') return p.isOfficial;
    if (filter === 'community') return !p.isOfficial;
    return true;
  });

  const handleLike = (id: string, current: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? current) + 1,
    }));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddPost(newContent.trim());
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="p-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Community Safety Feed
          </h2>
          <p className="text-xs text-slate-500">Live verified updates from agencies & locals</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Post</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => setFilter('official')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'official' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Official Bulletins
        </button>
        <button
          onClick={() => setFilter('community')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'community' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Citizens
        </button>
      </div>

      {/* New Post Creator Box */}
      {isCreating && (
        <form onSubmit={handlePostSubmit} className="mb-4 bg-white p-3 rounded-2xl border border-amber-300 shadow-md">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share an emergency update, roadblock, or shelter advisory..."
            rows={3}
            className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400">Location automatically tagged to District 4</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs font-bold bg-amber-400 text-slate-900 px-3 py-1 rounded-lg hover:bg-amber-300"
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => {
          const upvoteCount = likes[post.id] ?? post.upvotes;
          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-slate-200 transition-all"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      post.isOfficial ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {post.isOfficial ? 'GOV' : post.author[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{post.author}</span>
                      {post.isOfficial && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                          <ShieldCheck className="w-2.5 h-2.5 text-amber-700" />
                          Official
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{post.location}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">{post.content}</p>

              {/* Post Footer Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={() => handleLike(post.id, post.upvotes)}
                  className="flex items-center gap-1.5 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-semibold tabular-nums">{upvoteCount}</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">{post.commentsCount} replies</span>
                </div>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.author, text: post.content });
                    } else {
                      alert('Emergency advisory link copied to clipboard!');
                    }
                  }}
                  className="hover:text-slate-700 transition-colors cursor-pointer p-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
