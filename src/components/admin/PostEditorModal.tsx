import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  X,
  Save,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Pin,
  UploadCloud,
  Trash2,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  ImageDown,
  Loader2,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageUpload';
import { isPhotoInContent, parsePostContent } from '../../utils/postContent';

interface PostEditorModalProps {
  postToEdit: PostItem | null;
  defaultCategory?: PostItem['category'];
  onClose: () => void;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  postToEdit,
  defaultCategory = '공지사항',
  onClose,
}) => {
  const { addPost, updatePost } = useSite();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostItem['category']>(defaultCategory);
  const [author, setAuthor] = useState('오아시스 총괄운영팀');
  const [viewCount, setViewCount] = useState<number>(392);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Editor tabs: edit vs live preview
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Upload UI state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setAuthor(postToEdit.author);
      setSummary(postToEdit.summary);
      setContent(postToEdit.content);
      setIsPinned(postToEdit.isPinned);
      setViewCount(postToEdit.viewCount !== undefined ? postToEdit.viewCount : 392);
      setTagsInput(postToEdit.tags ? postToEdit.tags.join(', ') : '');

      // Initialize images (up to 6)
      if (postToEdit.images && postToEdit.images.length > 0) {
        setImages(postToEdit.images.slice(0, 6));
      } else if (postToEdit.thumbnail) {
        setImages([postToEdit.thumbnail]);
      } else {
        setImages([]);
      }
    } else {
      setTitle('');
      setCategory(defaultCategory);
      setAuthor('오아시스 총괄운영팀');
      setViewCount(392);
      setSummary('');
      setContent('');
      setImages([]);
      setIsPinned(false);
      setTagsInput('');
    }
  }, [postToEdit, defaultCategory]);

  // Handle direct file upload (supports drag-and-drop & file picker)
  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (fileArray.length === 0) {
      setUploadError('이미지 파일(JPG, PNG, WEBP 등)만 업로드 가능합니다.');
      return;
    }

    const remainingSlots = 6 - images.length;
    if (remainingSlots <= 0) {
      setUploadError('사진은 최대 6장까지만 첨부할 수 있습니다.');
      return;
    }

    const filesToProcess = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      setUploadError(`사진은 최대 6장까지 가능하여 ${remainingSlots}장만 추가되었습니다.`);
    }

    setIsUploading(true);
    try {
      const processedPromises = filesToProcess.map((file) => compressImageFile(file));
      const newImages = await Promise.all(processedPromises);
      setImages((prev) => [...prev, ...newImages].slice(0, 6));
    } catch (err) {
      console.error('Failed to process image:', err);
      setUploadError('이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setUploadError(null);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (images.length >= 6) {
      setUploadError('사진은 최대 6장까지만 등록 가능합니다.');
      return;
    }
    setImages((prev) => [...prev, manualUrl.trim()].slice(0, 6));
    setManualUrl('');
    setShowUrlInput(false);
  };

  const handleInsertPhoto = (photoNumber: number) => {
    const tag = `\n[사진${photoNumber}]\n`;
    const textarea = contentRef.current;
    if (!textarea) {
      setContent((prev) => (prev ? `${prev}${tag}` : tag.trim()));
      return;
    }

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const textBefore = textarea.value.substring(0, start);
    const textAfter = textarea.value.substring(end);

    const newContent = `${textBefore}${tag}${textAfter}`;
    setContent(newContent);
    setActiveTab('edit');

    setTimeout(() => {
      textarea.focus();
      const newPos = start + tag.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const primaryThumbnail = images.length > 0 ? images[0] : undefined;

    setIsSubmitting(true);
    try {
      if (postToEdit) {
        await updatePost(postToEdit.id, {
          title: title.trim(),
          category,
          author: author.trim(),
          summary: summary.trim() || content.trim().slice(0, 100) + '...',
          content: content.trim(),
          thumbnail: primaryThumbnail,
          images: images.length > 0 ? images : undefined,
          isPinned,
          tags,
          viewCount: Number(viewCount) >= 0 ? Number(viewCount) : (postToEdit.viewCount || 392),
        });
      } else {
        await addPost({
          title: title.trim(),
          category,
          author: author.trim(),
          summary: summary.trim() || content.trim().slice(0, 100) + '...',
          content: content.trim(),
          thumbnail: primaryThumbnail,
          images: images.length > 0 ? images : undefined,
          isPinned,
          tags,
          viewCount: Number(viewCount) >= 0 ? Number(viewCount) : 392,
        });
      }
      onClose();
    } catch (err) {
      console.error('Error saving post:', err);
      setUploadError('게시글 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5B54F]" />
            <span>{postToEdit ? '게시글 수정' : '커뮤니티 게시글 작성'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              게시글 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="게시글 제목을 입력하세요 (예: 2026 오카다 VIP 스위트룸 후기)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Category & Author & Initial ViewCount & Pinned */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] bg-white font-medium"
              >
                <option value="공지사항">공지사항</option>
                <option value="프로모션">프로모션</option>
                <option value="VIP매거진">VIP매거진</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">작성자 닉네임</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>기본 조회수</span>
              </label>
              <input
                type="number"
                min="0"
                value={viewCount}
                onChange={(e) => setViewCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] font-mono"
                placeholder="392"
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
                  상단 중요 공지 고정
                </span>
              </label>
            </div>
          </div>

          {/* DIRECT IMAGE UPLOAD SECTION (Max 6 photos, Drag & Drop + Click to upload) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                <span>사진 첨부 (직접 업로드, 최대 6장)</span>
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    images.length >= 6
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {images.length} / 6장
                </span>
                {!showUrlInput && images.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-[11px] text-slate-500 hover:text-[#30308A] flex items-center gap-0.5"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>URL로 입력</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Notification */}
            {uploadError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />

            {/* Upload Area / Gallery Grid */}
            <div className="space-y-3">
              {/* Photo preview cards (grid of up to 6 photos) */}
              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((imgSrc, idx) => {
                    const isInserted = isPhotoInContent(content, idx);
                    return (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative h-28 sm:h-32 w-full overflow-hidden group">
                          <img
                            src={imgSrc}
                            alt={`업로드 사진 ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                          
                          {/* Photo Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#E5B54F]" />
                              {idx === 0 ? '사진 1 (대표 썸네일)' : `사진 ${idx + 1}`}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow cursor-pointer"
                            title="사진 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Insertion Status on Image */}
                          <div className="absolute bottom-2 left-2">
                            {isInserted ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-600/95 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                                본문 삽입됨 [사진{idx + 1}]
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-300 text-[10px] font-medium shadow">
                                본문 미삽입
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Insert Button below photo */}
                        <div className="p-2 bg-slate-900 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleInsertPhoto(idx + 1)}
                            className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isInserted
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                                : 'bg-[#30308A] hover:bg-[#3d3da5] text-white shadow'
                            }`}
                          >
                            <ImageDown className="w-3.5 h-3.5 text-[#E5B54F]" />
                            <span>{isInserted ? `[사진${idx + 1}] 다시 넣기` : `본문에 [사진${idx + 1}] 넣기`}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add additional photo slot if less than 6 images exist */}
                  {images.length < 6 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`h-36 sm:h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#30308A] bg-[#30308A]/5'
                          : 'border-slate-300 hover:border-[#30308A] hover:bg-slate-50'
                      }`}
                    >
                      <Plus className="w-6 h-6 text-[#30308A] mb-1" />
                      <p className="text-xs font-bold text-slate-700">사진 추가하기 ({images.length + 1}/6)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">클릭 또는 파일 드래그</p>
                    </div>
                  )}
                </div>
              )}

              {/* Main Dropzone when 0 images exist */}
              {images.length === 0 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                    isDragging
                      ? 'border-[#30308A] bg-[#30308A]/10 scale-[1.01]'
                      : 'border-slate-300 hover:border-[#30308A] hover:bg-slate-50/80 bg-slate-50/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#30308A]/10 text-[#30308A] flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    클릭하여 사진 선택 또는 여기에 드래그 (최대 6장)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    스마트폰 카메라 사진, 갤러리 이미지, 캡처 화면 모두 즉시 첨부 가능합니다 (JPG, PNG, WEBP)
                  </p>
                  {isUploading && (
                    <p className="text-xs font-bold text-[#30308A] mt-2 animate-pulse">
                      사진을 최적화하여 업로드하는 중입니다...
                    </p>
                  )}
                </div>
              )}

              {/* Optional Manual URL Input Fallback */}
              {showUrlInput && images.length < 6 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">이미지 웹 URL 직접 입력</span>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      닫기
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... 또는 웹 이미지 주소"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="px-3 py-1.5 bg-[#30308A] text-white text-xs font-bold rounded-lg hover:bg-[#25256e]"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              한 줄 요약 (리스트 미리보기용, 선택)
            </label>
            <input
              type="text"
              placeholder="게시글 목록 카드에 표시될 1~2줄 요약 설명"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Content with Toolbar & Inline Photo Insertion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                게시글 본문 내용 <span className="text-red-500">*</span>
              </label>

              {/* Edit / Preview Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'edit'
                      ? 'bg-white text-[#30308A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  본문 작성
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'preview'
                      ? 'bg-white text-[#30308A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  실제 미리보기
                </button>
              </div>
            </div>

            {/* Quick Photo Insert Bar (when photos are uploaded, up to 6) */}
            {images.length > 0 && (
              <div className="p-2.5 bg-gradient-to-r from-blue-50/70 to-slate-50 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                    본문 사진 삽입 도구:
                  </span>
                  {images.map((_, idx) => {
                    const photoNum = idx + 1;
                    const inserted = isPhotoInContent(content, idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertPhoto(photoNum)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer transition-all hover:border-[#30308A]"
                      >
                        <ImageDown className="w-3 h-3 text-[#30308A]" />
                        <span>+ [사진{photoNum}]</span>
                        {inserted && (
                          <span className="text-[10px] text-emerald-600 font-bold ml-0.5">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  본문 원하는 위치에 커서를 두고 버튼을 누르세요 (최대 6장)
                </span>
              </div>
            )}

            {activeTab === 'edit' ? (
              <div>
                <textarea
                  ref={contentRef}
                  required
                  rows={8}
                  placeholder="자유롭게 커뮤니티 글을 작성해 보세요...&#10;&#10;💡 사진을 원하는 위치에 넣고 싶을 때는 위 [+ [사진1]~[사진6]] 버튼을 누르거나, 본문에 직접 [사진1], [사진2], [사진3]... 라고 적으시면 해당 위치에 사진이 크게 삽입됩니다."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30308A] resize-y min-h-[190px] font-sans leading-relaxed bg-white"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                  <span>지원 태그: [사진1] ~ [사진6] (대소문자/띄어쓰기 무관)</span>
                  <span>{content.length}자 작성</span>
                </div>
              </div>
            ) : (
              /* Live Preview Box */
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 min-h-[200px] max-h-[380px] overflow-y-auto space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#30308A]" />
                    본문 실시간 미리보기
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    실제 게시글 화면과 동일하게 렌더링됩니다
                  </span>
                </div>

                {content.trim() ? (
                  <div className="space-y-3 text-slate-800">
                    {parsePostContent(content, images).map((seg, idx) => {
                      if (seg.type === 'text') {
                        return (
                          <div key={idx} className="whitespace-pre-line leading-relaxed">
                            {seg.text}
                          </div>
                        );
                      }
                      if (seg.type === 'image' && seg.imageUrl) {
                        return (
                          <div
                            key={idx}
                            className="my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative shadow-sm"
                          >
                            <img
                              src={seg.imageUrl}
                              alt={seg.imageLabel || '본문 사진'}
                              className="w-full max-h-56 object-contain bg-slate-950"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                              <ImageIcon className="w-3 h-3 text-[#E5B54F]" />
                              {seg.imageLabel}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10">본문 내용을 입력하시면 여기에 실시간으로 표시됩니다.</p>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              태그 (쉼표로 구분, 선택)
            </label>
            <input
              type="text"
              placeholder="예: 마닐라, 오카다, 카지노후기, VIP의전"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              사진 첨부: <span className="font-bold text-slate-800">{images.length}/6장</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isUploading || isSubmitting}
                className="px-6 py-2 text-xs font-bold text-white bg-[#30308A] hover:bg-[#25256e] rounded-lg shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{postToEdit ? '수정 완료' : '게시글 등록하기'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

