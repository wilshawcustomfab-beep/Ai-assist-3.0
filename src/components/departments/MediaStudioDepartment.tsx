import React, { useState } from 'react';
import { 
  Film, 
  Share2, 
  Sparkles, 
  Plus, 
  Instagram, 
  Facebook, 
  Video, 
  CheckCircle, 
  Clock, 
  Copy, 
  Check, 
  X,
  Send,
  Eye,
  Camera
} from 'lucide-react';
import { MediaPostDraft, TemplarAdmin } from '../../types';

interface MediaStudioDepartmentProps {
  mediaDrafts: MediaPostDraft[];
  activeAdmin: TemplarAdmin;
  onRefresh: () => void;
  onRequestApproval: (draft: MediaPostDraft) => void;
}

export const MediaStudioDepartment: React.FC<MediaStudioDepartmentProps> = ({
  mediaDrafts,
  activeAdmin,
  onRefresh,
  onRequestApproval
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Draft Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('#TemplarsAirsoft #UKAirsoft #WoodlandAirsoft');
  const [visualPrompt, setVisualPrompt] = useState('Tactical airsoft operators maneuvering through lush pine woodland with atmospheric red smoke grenade.');
  const [targetAudience, setTargetAudience] = useState('UK Airsoft Enthusiasts in Berkshire/Surrey');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDrafts = mediaDrafts.filter(d => platformFilter === 'all' || d.platform === platformFilter);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/templar/media/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          title,
          content,
          hashtags: hashtags.split(' ').filter(h => h.trim().length > 0),
          visualPrompt,
          targetAudience,
          status: 'draft'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setTitle('');
        setContent('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Draft create error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-pink-950/60 text-pink-300 border border-pink-800/40 font-bold">
              DEPARTMENT 02 • MEDIA STUDIO & CONTENT
            </span>
            <span className="text-zinc-500 text-xs font-mono">Social Outreach & Brand Assets</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Viral Social Captions, Reels & Tactical Posters</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Craft high-converting woodland skirmish announcements for Instagram, TikTok, Facebook & YouTube.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Media Draft</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-max overflow-x-auto text-xs font-mono">
        {['all', 'instagram', 'tiktok', 'facebook', 'youtube'].map(p => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
              platformFilter === p ? 'bg-red-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Media Draft Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrafts.map((draft) => {
          const isPublished = draft.status === 'published';
          const isPending = draft.status === 'pending_approval';
          return (
            <div 
              key={draft.id}
              className="rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/50 p-4 flex flex-col justify-between shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {draft.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                    {draft.platform === 'tiktok' && <Video className="w-4 h-4 text-cyan-400" />}
                    {draft.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-400" />}
                    <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                      {draft.platform}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                    isPublished 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                      : isPending
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/40 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {draft.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mb-2">{draft.title}</h3>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {draft.content}
                </div>

                {/* Hashtags */}
                <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] font-mono text-red-400/90">
                  {draft.hashtags.map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                </div>

                {/* AI Visual Prompt preview */}
                <div className="mt-3 p-2.5 rounded-lg bg-zinc-850/60 border border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-bold text-zinc-300 text-[10px] uppercase block mb-0.5">Creative Asset Spec:</span>
                  <p className="italic line-clamp-2">{draft.visualPrompt}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyText(`${draft.content}\n\n${draft.hashtags.join(' ')}`, draft.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors active:scale-95"
                >
                  {copiedId === draft.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === draft.id ? 'Copied' : 'Copy'}</span>
                </button>

                {!isPublished && (
                  <button
                    onClick={() => onRequestApproval(draft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Authorize Live</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Media Draft */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white">Create Social Media Campaign Draft</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Target Platform</label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="instagram">Instagram (Reels / Carousel)</option>
                    <option value="tiktok">TikTok (Short POV)</option>
                    <option value="facebook">Facebook (Game Day Announcement)</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                    placeholder="Operation Red Citadel Launch"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Post Caption & Copy</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none leading-relaxed"
                  placeholder="Lock & load! Join us this Sunday at Templars Airsoft UK..."
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Hashtag Bundle</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Visual Poster / Video Direction</label>
                <input
                  type="text"
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
