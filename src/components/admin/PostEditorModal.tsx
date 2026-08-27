import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import { X, Save, Sparkles, Image, Tag, Pin } from 'lucide-react';

interface PostEditorModalProps {
  postToEdit: PostItem | null;
  onClose: () => void;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({ postToEdit, onClose }) => {
  const { addPost, updatePost } = useSite();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostItem['category']>('공지사항');
  const [author, setAuthor] = useState('오아시스 총괄운영팀');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setAuthor(postToEdit.author);
      setSummary(postToEdit.summary);
      setContent(postToEdit.content);
      setThumbnail(postToEdit.thumbnail || '');
      setIsPinned(postToEdit.isPinned);
      setTagsInput(postToEdit.tags ? postToEdit.tags.join(', ') : '');
    } else {
      setTitle('');
      setCategory('공지사항');
      setAuthor('오아시스 총괄운영팀');
      setSummary('');
      setContent('');
      setThumbnail('');
      setIsPinned(false);
      setTagsInput('');
    }
  }, [postToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (postToEdit) {
      updatePost(postToEdit.id, {
        title: title.trim(),
        category,
        author: author.trim(),
        summary: summary.trim(),
        content: content.trim(),
        thumbnail: thumbnail.trim() || undefined,
        isPinned,
        tags,
      });
    } else {
      addPost({
        title: title.trim(),
        category,
        author: author.trim(),
        summary: summary.trim(),
        content: content.trim(),
        thumbnail: thumbnail.trim() || undefined,
        isPinned,
        tags,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5B54F]" />
            <span>{postToEdit ? '게시글 수정' : '새 게시글 / 공지사항 작성'}</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              게시글 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: [프로모션] 2026 오카다 스위트룸 3박 무료 지원"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Category & Author & Pinned */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] bg-white"
              >
                <option value="공지사항">공지사항</option>
                <option value="프로모션">프로모션</option>
                <option value="VIP매거진">VIP매거진</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">작성자</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#30308A] rounded border-slate-300 focus:ring-[#30308A]"
                />
                <span className="flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-red-500" />
                  상단 중요 공지로 고정
                </span>
              </label>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              대표 이미지 URL (선택)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              한 줄 요약 (리스트 미리보기용)
            </label>
            <input
              type="text"
              placeholder="게시글 목록에 표시될 1~2줄 요약 설명"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              게시글 본문 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={8}
              placeholder="상세 내용을 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] resize-none font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              placeholder="예: 마닐라, 오카다, 스위트룸, 롤링"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#30308A] hover:bg-[#25256e] rounded-lg shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{postToEdit ? '수정 완료' : '게시글 등록'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
