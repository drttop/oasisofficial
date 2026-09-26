import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Trash2,
  AlertCircle,
  Eye,
  Edit3,
  Loader2,
  MapPin,
  ImageIcon,
  ImageDown,
  ChevronDown,
  Type,
  Bold,
  Highlighter,
  Underline,
  Quote,
  List,
  Eraser,
  LayoutTemplate,
  Sparkles,
  Send,
  Pin,
  Sliders,
  Check,
} from 'lucide-react';
import { compressImageFile, optimizeDataUrl, createMiniThumbnail } from '../../utils/imageUpload';
import { GoogleMapEmbed } from './GoogleMapEmbed';
import {
  isPhotoInContent,
  stripFormattingTags,
  FormattedPostContent,
  parsePostContent,
  postContentToHtml,
  htmlToPostContent,
  createVisualPhotoHtml,
  createVisualMapHtml,
} from '../../utils/postContent';

const POPULAR_MAP_PRESETS = [
  { tag: '오카다', title: '오카다 마닐라 (Okada Manila)', address: 'New Seaside Dr, Entertainment City, Parañaque, 1701 Metro Manila', query: 'Okada Manila Entertainment City' },
  { tag: '솔레어', title: '솔레어 리조트 엔터테인먼트 시티', address: '1 Aseana Ave, Entertainment City, Parañaque, 1701 Metro Manila', query: 'Solaire Resort Entertainment City' },
  { tag: 'COD', title: '시티 오브 드림 마닐라 (City of Dreams)', address: 'Asean Avenue corner Roxas Boulevard, Entertainment City, Parañaque', query: 'City of Dreams Manila' },
  { tag: '뉴포트', title: '뉴포트 월드 리조트 (구 리조트월드)', address: 'Newport Blvd, Newport City, Pasay, 1309 Metro Manila', query: 'Newport World Resorts Manila' },
  { tag: '한클락', title: '한 카지노 리조트 클락 (Hann Resort)', address: 'M.A. Roxas Highway, Clark Freeport Zone, Pampanga', query: 'Hann Casino Resort Clark' },
  { tag: '디하이츠', title: '디하이츠 카지노 리조트 클락', address: 'Monterrace Suites, Clark Freeport Zone, Pampanga', query: 'D\'Heights Resort and Casino Clark' },
];

interface PostEditorPageProps {
  postToEdit?: PostItem | null;
  onClose: () => void;
  onSaved?: (savedPost: PostItem) => void;
}

export const PostEditorPage: React.FC<PostEditorPageProps> = ({
  postToEdit,
  onClose,
  onSaved,
}) => {
  const { addPost, updatePost, user } = useSite();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'공지사항' | '프로모션' | 'VIP매거진'>('공지사항');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [viewCount, setViewCount] = useState<number>(392);
  const [tagsInput, setTagsInput] = useState('');

  // Mode: Visual WYSIWYG vs Raw Code vs Preview
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual');

  // Map state
  const [showMapPanel, setShowMapPanel] = useState(false);
  const [mapTitle, setMapTitle] = useState('');
  const [mapAddress, setMapAddress] = useState('');
  const [mapQuery, setMapQuery] = useState('');
  const [hasAttachedMap, setHasAttachedMap] = useState(false);

  // References
  const editorRef = useRef<HTMLDivElement>(null);
  const rawTextareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedRangeRef = useRef<Range | null>(null);

  // Upload UI state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track if initial HTML has been injected into editorRef
  const isInitializedRef = useRef(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save current selection range in the visual editor
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        lastSavedRangeRef.current = range.cloneRange();
      }
    }
  };

  // Restore saved selection range
  const restoreSelection = () => {
    if (typeof window === 'undefined' || !lastSavedRangeRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(lastSavedRangeRef.current);
    }
  };

  // Sync content state from visual editor
  const syncContentFromVisual = () => {
    if (editorRef.current) {
      const serialized = htmlToPostContent(editorRef.current);
      setContent(serialized);
    }
  };

  // Handle typing inside visual editor with instant tag detection
  const handleEditorInput = () => {
    saveSelection();

    // Auto-detect and replace typed or pasted photo tags [사진1] ~ [사진6] with live visual photo cards immediately
    if (editorRef.current && images.length > 0) {
      const html = editorRef.current.innerHTML;
      const photoMatch = html.match(/\[(?:사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/i);
      if (photoMatch) {
        const pNum = parseInt(photoMatch[1], 10);
        const pIdx = pNum - 1;
        if (images[pIdx]) {
          const cardHtml = createVisualPhotoHtml(pIdx, images[pIdx]);
          editorRef.current.innerHTML = html.replace(photoMatch[0], cardHtml);
        }
      }
    }

    syncContentFromVisual();
  };

  // Initialize or update fields when postToEdit changes
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category as any);
      setAuthor(postToEdit.author);
      setSummary(postToEdit.summary || '');
      setContent(postToEdit.content);
      setIsPinned(postToEdit.isPinned || false);
      setViewCount(postToEdit.viewCount !== undefined ? postToEdit.viewCount : 392);
      setTagsInput(postToEdit.tags ? postToEdit.tags.join(', ') : '');

      if (postToEdit.mapLocation) {
        setMapTitle(postToEdit.mapLocation.title || '');
        setMapAddress(postToEdit.mapLocation.address || '');
        setMapQuery(postToEdit.mapLocation.query || '');
        setHasAttachedMap(true);
      }

      const postImages = postToEdit.images && postToEdit.images.length > 0
        ? postToEdit.images
        : postToEdit.thumbnail
        ? [postToEdit.thumbnail]
        : [];
      setImages(postImages);

      // Inject visual HTML into contentEditable
      if (editorRef.current) {
        editorRef.current.innerHTML = postContentToHtml(
          postToEdit.content,
          postImages,
          postToEdit.mapLocation
        );
        isInitializedRef.current = true;
      }
    } else {
      setTitle('');
      setCategory('공지사항');
      setAuthor(user?.displayName || '오아시스 VIP');
      setSummary('');
      setContent('');
      setIsPinned(false);
      setViewCount(Math.floor(Math.random() * 200) + 350);
      setTagsInput('');
      setImages([]);
      setMapTitle('');
      setMapAddress('');
      setMapQuery('');
      setHasAttachedMap(false);

      if (editorRef.current) {
        editorRef.current.innerHTML = '<p><br></p>';
        isInitializedRef.current = true;
      }
    }
  }, [postToEdit, user]);

  // Keep editorRef innerHTML in sync if switching back from code mode
  useEffect(() => {
    if (editorMode === 'visual' && editorRef.current) {
      const currentVisualContent = htmlToPostContent(editorRef.current);
      if (currentVisualContent !== content) {
        editorRef.current.innerHTML = postContentToHtml(content, images, {
          title: mapTitle,
          address: mapAddress,
          query: mapQuery,
        });
      }
    }
  }, [editorMode]);

  // Handle uploaded images
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length + fileArray.length > 6) {
      setUploadError(`사진은 최대 6장까지만 등록 가능합니다. (현재 ${images.length}장 등록됨)`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = fileArray.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드할 수 있습니다 (JPG, PNG, WEBP 등).');
        }
        return await compressImageFile(file, 720, 720, 0.65);
      });

      const newBase64Images = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newBase64Images].slice(0, 6);
      const startIdx = images.length;
      setImages(updatedImages);

      // Auto-insert first uploaded image into visual editor directly at cursor!
      if (newBase64Images.length > 0 && editorMode === 'visual') {
        insertPhotoIntoEditor(startIdx, newBase64Images[0]);
      }
    } catch (err: any) {
      console.error('Image compression error:', err);
      setUploadError(err.message || '사진 최적화 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    // Remove from visual editor if present
    if (editorRef.current) {
      const cards = editorRef.current.querySelectorAll(`.visual-photo-card[data-photo-idx="${indexToRemove}"]`);
      cards.forEach((c) => c.remove());
      syncContentFromVisual();
    }
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setUploadError(null);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (images.length >= 6) {
      setUploadError('사진은 최대 6장까지만 등록 가능합니다.');
      return;
    }
    const newIdx = images.length;
    const url = manualUrl.trim();
    setImages((prev) => [...prev, url].slice(0, 6));
    setManualUrl('');
    setShowUrlInput(false);

    // Auto-insert into editor
    if (editorMode === 'visual') {
      insertPhotoIntoEditor(newIdx, url);
    }
  };

  // Helper to insert a DOM node at the current cursor / selection in the visual editor
  const insertNodeAtCursor = (node: Node) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    restoreSelection();

    const sel = window.getSelection();
    let range: Range | null = null;

    if (sel && sel.rangeCount > 0) {
      const testRange = sel.getRangeAt(0);
      if (editorRef.current.contains(testRange.commonAncestorContainer)) {
        range = testRange;
      }
    }

    if (range) {
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      // Append at bottom
      editorRef.current.appendChild(node);
    }

    // Insert an empty paragraph after to allow smooth subsequent typing
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    node.parentNode?.insertBefore(p, node.nextSibling);

    saveSelection();
    syncContentFromVisual();
  };

  // Safe Close and navigate away with URL cleaning
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        url.searchParams.delete('edit');
        const cleanSearch = url.searchParams.toString();
        const cleanUrl = url.pathname + (cleanSearch ? `?${cleanSearch}` : '') + (url.hash || '');
        window.history.pushState({}, '', cleanUrl);
      } catch {
        // ignore
      }
    }
    onClose();
  };

  // 1. Insert Live Visual Photo Card directly into WYSIWYG Editor
  const insertPhotoIntoEditor = (photoIndex: number, imageUrl: string) => {
    if (editorRef.current) {
      const existing = editorRef.current.querySelector(`.visual-photo-card[data-photo-idx="${photoIndex}"]`);
      if (existing) {
        existing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = createVisualPhotoHtml(photoIndex, imageUrl).trim();
    const photoCard = tempDiv.firstElementChild;
    if (photoCard) {
      insertNodeAtCursor(photoCard);
    }
  };

  // 2. Insert Live Visual Map Card directly into WYSIWYG Editor
  const insertMapIntoEditor = (customTitle?: string, customAddress?: string) => {
    const titleVal = (customTitle || mapTitle || mapQuery).trim();
    const addressVal = (customAddress || mapAddress).trim();
    const queryVal = (mapQuery || titleVal).trim();

    if (!titleVal && !queryVal) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = createVisualMapHtml(titleVal, addressVal, queryVal).trim();
    const mapCard = tempDiv.firstElementChild;
    if (mapCard) {
      insertNodeAtCursor(mapCard);
      setHasAttachedMap(true);
    }
  };

  const handleSelectPreset = (preset: typeof POPULAR_MAP_PRESETS[0]) => {
    setMapTitle(preset.title);
    setMapAddress(preset.address);
    setMapQuery(preset.query);
    setHasAttachedMap(true);
    insertMapIntoEditor(preset.title, preset.address);
  };

  const handleClearMap = () => {
    setMapTitle('');
    setMapAddress('');
    setMapQuery('');
    setHasAttachedMap(false);
    if (editorRef.current) {
      const mapCards = editorRef.current.querySelectorAll('.visual-map-card');
      mapCards.forEach((c) => c.remove());
      syncContentFromVisual();
    }
  };

  // Handle click events inside the visual editor (e.g. Delete photo card or map card)
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Delete photo card button
    const deletePhotoBtn = target.closest('.delete-photo-btn');
    if (deletePhotoBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = deletePhotoBtn.closest('.visual-photo-card');
      if (card) {
        card.remove();
        syncContentFromVisual();
      }
      return;
    }

    // Delete map card button
    const deleteMapBtn = target.closest('.delete-map-btn');
    if (deleteMapBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = deleteMapBtn.closest('.visual-map-card');
      if (card) {
        card.remove();
        syncContentFromVisual();
      }
      return;
    }
  };

  // Visual WYSIWYG Formatting Engine: Instant In-place Application
  const applyVisualFormat = (type: string) => {
    if (editorMode !== 'visual' || !editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    switch (type) {
      case 'bold':
        document.execCommand('bold', false);
        break;

      case 'underline':
        document.execCommand('underline', false);
        break;

      case 'size-lg': {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const span = document.createElement('span');
          span.className = 'text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug';
          try {
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          } catch {
            document.execCommand('formatBlock', false, '<h2>');
          }
        } else {
          document.execCommand('formatBlock', false, '<h2>');
        }
        break;
      }

      case 'size-md': {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const span = document.createElement('span');
          span.className = 'text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug';
          try {
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          } catch {
            document.execCommand('formatBlock', false, '<h3>');
          }
        } else {
          document.execCommand('formatBlock', false, '<h3>');
        }
        break;
      }

      case 'size-normal':
        document.execCommand('formatBlock', false, '<p>');
        document.execCommand('fontSize', false, '3');
        break;

      case 'size-sm': {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const span = document.createElement('span');
          span.className = 'text-xs text-slate-500 leading-normal inline-block';
          try {
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          } catch {
            document.execCommand('fontSize', false, '2');
          }
        } else {
          document.execCommand('fontSize', false, '2');
        }
        break;
      }

      case 'highlight': {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const mark = document.createElement('mark');
          mark.className = 'bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-medium border border-amber-300/60';
          try {
            const contents = range.extractContents();
            mark.appendChild(contents);
            range.insertNode(mark);
            sel.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(mark);
            sel.addRange(newRange);
          } catch {
            document.execCommand('hiliteColor', false, '#fef08a');
          }
        } else {
          document.execCommand('hiliteColor', false, '#fef08a');
        }
        break;
      }

      case 'gold':
        document.execCommand('foreColor', false, '#b8860b');
        break;

      case 'blue':
        document.execCommand('foreColor', false, '#30308A');
        break;

      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        break;

      case 'bullet':
        document.execCommand('insertUnorderedList', false);
        break;

      case 'divider':
        document.execCommand('insertHorizontalRule', false);
        break;

      case 'clear':
        document.execCommand('removeFormat', false);
        document.execCommand('formatBlock', false, '<p>');
        break;

      default:
        break;
    }

    saveSelection();
    syncContentFromVisual();
  };

  // Keyboard shortcut Ctrl+B / Cmd+B in visual editor
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      applyVisualFormat('bold');
    }
  };

  // Insert gorgeous pre-formatted visual layout template directly into the editor
  const handleInsertTemplate = () => {
    const templateContent = `## ✨ 2026 오아시스 VIP 카지노 특별 프로모션

### 1. 행사 개요 및 주요 혜택
오아시스를 통해 예약하시는 모든 VIP 회원님께 **항공권 지원 및 롤링 1.5% 즉시 지급** 혜택을 제공합니다.
[형광펜]24시간 한국인 전담 버틀러 서비스[/형광펜]와 최고급 세단 의전이 함께합니다.

### 2. 특급 호텔 스위트룸 무료 숙박
- 마닐라 오카다 / 솔레어 / COD 최고급 스위트룸 제공
- 클락 한 리조트 / 디하이츠 프리미엄 빌라 연계
- VIP 전용 라운지 무료 이용 및 식음료 풀서비스

> "필리핀 최대의 신뢰와 전통, 오아시스가 가장 품격 있는 VIP 여정을 약속드립니다."

### 3. 찾아오시는 길 및 공식 위치
[지도:오카다 마닐라]

문의 사항은 24시간 카카오톡 또는 텔레그램으로 언제든 편하게 연락 주시기 바랍니다.`;

    if (content.trim()) {
      if (!confirm('현재 작성 중인 본문 아래에 추천 서식 템플릿을 추가하시겠습니까?')) {
        return;
      }
      const combined = `${content}\n\n${templateContent}`;
      setContent(combined);
      if (editorRef.current) {
        editorRef.current.innerHTML = postContentToHtml(combined, images, {
          title: '오카다 마닐라',
          query: 'Okada Manila Entertainment City',
        });
      }
    } else {
      setContent(templateContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = postContentToHtml(templateContent, images, {
          title: '오카다 마닐라',
          query: 'Okada Manila Entertainment City',
        });
      }
    }
    setEditorMode('visual');
  };

  // Submit & Save Post
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Ensure latest visual changes are serialized
    let finalContent = content;
    if (editorMode === 'visual' && editorRef.current) {
      finalContent = htmlToPostContent(editorRef.current);
      setContent(finalContent);
    }

    if (!title.trim() || !finalContent.trim()) {
      setUploadError('게시글 제목과 본문 내용을 모두 입력해주세요.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const optimizedImages = await Promise.all(
        images.map((img) => optimizeDataUrl(img, 720, 720, 0.65))
      );

      let primaryThumbnail: string | undefined = undefined;
      if (optimizedImages.length > 0) {
        primaryThumbnail = await createMiniThumbnail(optimizedImages[0]);
      }

      const mapLocationPayload =
        hasAttachedMap && (mapQuery.trim() || mapTitle.trim())
          ? {
              title: mapTitle.trim() || undefined,
              address: mapAddress.trim() || undefined,
              query: (mapQuery.trim() || mapTitle.trim()),
            }
          : undefined;

      const cleanSummary = summary.trim() || stripFormattingTags(finalContent).slice(0, 100) + '...';

      const payload = {
        title: title.trim(),
        category,
        author: author.trim() || '오아시스 VIP',
        summary: cleanSummary,
        content: finalContent.trim(),
        thumbnail: primaryThumbnail,
        images: optimizedImages.length > 0 ? optimizedImages : undefined,
        isPinned,
        tags,
        viewCount: Number(viewCount) >= 0 ? Number(viewCount) : (postToEdit?.viewCount || 392),
        mapLocation: mapLocationPayload,
      };

      if (postToEdit) {
        await updatePost(postToEdit.id, payload);
        const updatedPost: PostItem = {
          ...postToEdit,
          ...payload,
        };
        if (onSaved) {
          onSaved(updatedPost);
        } else {
          onClose();
        }
      } else {
        const created = await addPost(payload);
        if (onSaved && created) {
          onSaved(created as any);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Error saving post:', err);
      setUploadError('게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-100/60 min-h-screen pb-16 animate-in fade-in duration-200">
      {/* 1. Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Back button & Breadcrumb Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer group shadow-2xs shrink-0"
              title="커뮤니티 목록으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>목록으로</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 text-[#E5B54F] shrink-0" />
                <span className="truncate">{postToEdit ? `게시글 수정: ${postToEdit.title}` : '커뮤니티 새 글 작성'}</span>
              </h1>
            </div>
          </div>

          {/* Right: Mode Switcher, Cancel & Primary Save Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Editor Mode Selector */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditorMode('visual')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  editorMode === 'visual'
                    ? 'bg-white text-[#30308A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="글자 크기, 굵기, 형광펜, 사진이 화면에 즉시 표시되는 실시간 비주얼 에디터"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#30308A]" />
                <span className="font-extrabold">실시간 비주얼</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  즉시 반영
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  syncContentFromVisual();
                  setEditorMode('preview');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  editorMode === 'preview'
                    ? 'bg-white text-[#30308A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="발행 상태 미리보기"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>미리보기</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-bold transition-colors cursor-pointer hidden md:inline-flex"
            >
              취소
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || !title.trim()}
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5B54F]" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#E5B54F]" />
                  <span>{postToEdit ? '수정 내용 저장' : '게시글 등록하기'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Banner */}
        {uploadError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Main WYSIWYG Writing Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Title Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-mono">{title.length}/100자</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="게시글 제목을 입력하세요 (예: 2026 오카다 VIP 스위트룸 이용 후기 및 롤링 혜택 안내)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 border-0 border-b-2 border-slate-200 focus:border-[#30308A] focus:ring-0 px-0 py-2 sm:py-3 placeholder:text-slate-300 transition-colors bg-transparent leading-snug"
                />
              </div>

              {/* Real-time WYSIWYG Visual Formatting Toolbar */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 via-indigo-50/25 to-blue-50/30 rounded-2xl border border-slate-200/90 space-y-3 shadow-2xs">
                {/* Row 1: Font Sizes, Boldness, Highlights, Colors */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200/70 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Font Size Group: Instant Headings */}
                    <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
                        <Type className="w-3.5 h-3.5 text-[#30308A]" />
                        크기:
                      </span>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('size-lg')}
                        className="px-2.5 py-1 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                        title="대제목 (Heading 2) - 선택 텍스트 또는 줄을 큰 제목 크기로 즉시 변환"
                      >
                        대
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('size-md')}
                        className="px-2.5 py-1 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                        title="중제목 (Heading 3) - 선택 텍스트 또는 줄을 중간 소제목으로 즉시 변환"
                      >
                        중
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('size-normal')}
                        className="px-2.5 py-1 hover:bg-slate-100 rounded-lg text-xs font-normal text-slate-700 transition-colors cursor-pointer"
                        title="보통 본문 (Paragraph) - 기본 텍스트 크기로 변환"
                      >
                        보통
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('size-sm')}
                        className="px-2 py-1 hover:bg-slate-100 rounded-lg text-[11px] text-slate-500 transition-colors cursor-pointer"
                        title="작은 글씨 (Small note)"
                      >
                        소
                      </button>
                    </div>

                    {/* Font Weight: Instant Bold */}
                    <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('bold')}
                        className="px-3 py-1 hover:bg-slate-100 rounded-lg text-xs font-black text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="굵게 (Bold) - 단축키 Ctrl+B (선택 즉시 굵어집니다)"
                      >
                        <Bold className="w-3.5 h-3.5 text-slate-900" />
                        <span>굵게</span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('underline')}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                        title="밑줄 (Underline)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Instant Live Highlight & Colors */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('highlight')}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="형광펜 강조 (선택 즉시 본문에서 노란색 형광펜이 칠해집니다)"
                      >
                        <Highlighter className="w-3.5 h-3.5 text-amber-700" />
                        <span>형광펜</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('gold')}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="골드 포인트 컬러"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#E5B54F] inline-block"></span>
                        <span>골드</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('blue')}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold text-[#30308A] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        title="네이비 블루 포인트 컬러"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#30308A] inline-block"></span>
                        <span>파랑</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('quote')}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        title="인용구 박스 삽입"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('bullet')}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        title="목록 기호"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyVisualFormat('clear')}
                        className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-600 shadow-2xs transition-colors cursor-pointer"
                        title="선택 텍스트 서식 지우기"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Template Preset Button */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleInsertTemplate}
                    className="px-3 py-1 bg-white hover:bg-indigo-50/70 text-[#30308A] border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ml-auto"
                    title="서식이 완성된 추천 레이아웃 템플릿 즉시 삽입"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5 text-[#30308A]" />
                    <span>추천 서식 템플릿</span>
                  </button>
                </div>

                {/* Row 2: Media & Maps Quick Insert directly into text */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Google Map Toggle Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowMapPanel((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                        showMapPanel || hasAttachedMap
                          ? 'bg-[#30308A] text-white border-[#30308A]'
                          : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200 hover:border-[#30308A]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E5B54F]" />
                      <span>📍 구글 지도 등록 / 본문 삽입</span>
                      {hasAttachedMap ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500 text-white font-bold">
                          등록됨
                        </span>
                      ) : (
                        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showMapPanel ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Photo quick insert tags */}
                    {images.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 ml-1">
                          <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                          사진 본문 넣기:
                        </span>
                        {images.map((imgUrl, idx) => {
                          const photoNum = idx + 1;
                          const inserted = isPhotoInContent(content, idx);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => insertPhotoIntoEditor(idx, imgUrl)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer transition-all hover:border-[#30308A]"
                              title={`커서 위치에 사진 ${photoNum} 즉시 삽입 (미리보기 없이 바로 사진이 나타납니다)`}
                            >
                              <ImageDown className="w-3 h-3 text-[#30308A]" />
                              <span>사진 {photoNum} 넣기</span>
                              {inserted && (
                                <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-semibold hidden md:inline-flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>실시간 위지윅(WYSIWYG) - 폰트, 형광펜, 사진이 화면에 즉시 표시됩니다</span>
                  </span>
                </div>

                {/* Collapsible Google Maps System Panel */}
                {showMapPanel && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#30308A] flex items-center justify-center text-white">
                          <MapPin className="w-4 h-4 text-[#E5B54F]" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            구글 지도 (Google Maps) 시스템
                            {hasAttachedMap && (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ✓ 대표 위치 등록됨
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            원하는 장소를 선택하면 글 본문 작성 위치에 실제 구글 지도가 즉시 삽입됩니다.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMapPanel(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        title="지도 패널 접기"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 1-Click Popular Manila & Clark Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>💡 1초 빠른 등록 (인기 마닐라 / 클락 리조트):</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_MAP_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                              mapTitle === preset.title
                                ? 'bg-[#30308A] text-white border-[#30308A] shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-200/70 text-slate-600 font-mono">
                              {preset.tag}
                            </span>
                            <span>{preset.title.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">장소 / 호텔명</label>
                        <input
                          type="text"
                          placeholder="예: 오카다 마닐라"
                          value={mapTitle}
                          onChange={(e) => {
                            setMapTitle(e.target.value);
                            setHasAttachedMap(true);
                          }}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">상세 주소 (선택)</label>
                        <input
                          type="text"
                          placeholder="예: New Seaside Dr, Parañaque"
                          value={mapAddress}
                          onChange={(e) => setMapAddress(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">구글 검색어</label>
                        <input
                          type="text"
                          placeholder="예: Okada Manila Entertainment City"
                          value={mapQuery}
                          onChange={(e) => {
                            setMapQuery(e.target.value);
                            setHasAttachedMap(true);
                          }}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                        />
                      </div>
                    </div>

                    {/* Map Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => insertMapIntoEditor()}
                          disabled={!mapTitle.trim() && !mapQuery.trim()}
                          className="px-3.5 py-1.5 rounded-xl bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#E5B54F]" />
                          <span>본문에 지도 즉시 삽입</span>
                        </button>
                        {hasAttachedMap && (
                          <button
                            type="button"
                            onClick={handleClearMap}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                          >
                            지도 초기화
                          </button>
                        )}
                      </div>
                      {(mapQuery.trim() || mapTitle.trim()) && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          미리보기: {mapTitle || mapQuery}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Writing Canvas: Real-time WYSIWYG vs Code vs Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span>본문 내용</span>
                    <span className="text-red-500">*</span>
                    {editorMode === 'visual' && (
                      <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        실시간 비주얼 에디터 활성화
                      </span>
                    )}
                    {editorMode === 'code' && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
                        태그 직접 편집 모드
                      </span>
                    )}
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      {content.length.toLocaleString()}자 작성됨
                    </span>
                  </div>
                </div>

                {/* 1. VISUAL WYSIWYG EDITOR (Primary Real-time Canvas) */}
                {editorMode === 'visual' && (
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    onBlur={() => {
                      saveSelection();
                      syncContentFromVisual();
                    }}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onClick={handleEditorClick}
                    onKeyDown={handleEditorKeyDown}
                    data-placeholder="이곳에 내용을 자유롭게 작성하세요. 상단 툴바의 굵게(B), 글자 크기, 형광펜, 사진 넣기를 누르면 미리보기 없이 화면에 즉시 반영됩니다..."
                    className="w-full min-h-[580px] p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 focus:border-[#30308A] focus:ring-2 focus:ring-[#30308A]/10 outline-none text-slate-800 text-base leading-relaxed overflow-y-auto transition-all shadow-inner empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-slate-100 [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_blockquote]:my-3 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#30308A] [&_blockquote]:bg-slate-50 [&_blockquote]:text-slate-700 [&_blockquote]:italic [&_blockquote]:rounded-r-lg [&_blockquote]:font-medium [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_mark]:bg-amber-200 [&_mark]:text-amber-950 [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:rounded [&_mark]:font-medium [&_mark]:border [&_mark]:border-amber-300/60"
                  />
                )}

                {/* 2. RAW CODE / TAG MODE (For power users) */}
                {editorMode === 'code' && (
                  <textarea
                    ref={rawTextareaRef}
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="본문 내용을 입력하세요..."
                    className="w-full min-h-[580px] p-5 sm:p-7 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed border border-slate-700 focus:border-[#30308A] focus:ring-0 outline-none resize-y transition-all shadow-inner"
                  />
                )}

                {/* 3. FULL ARTICLE PREVIEW (Simulates public post detail layout) */}
                {editorMode === 'preview' && (
                  <div className="w-full min-h-[580px] p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#30308A]/10 text-[#30308A] mb-2">
                        {category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {title || '제목 미리보기'}
                      </h2>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-3">
                        <span>작성자: {author || '오아시스 VIP'}</span>
                        <span>•</span>
                        <span>조회수: {viewCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {parsePostContent(
                        content,
                        images,
                        hasAttachedMap ? { title: mapTitle, address: mapAddress, query: mapQuery } : undefined
                      ).map((seg, idx) => {
                        if (seg.type === 'text') {
                          return <FormattedPostContent key={idx} content={seg.text || ''} />;
                        }
                        if (seg.type === 'image' && seg.imageUrl) {
                          return (
                            <div key={idx} className="my-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                              <img src={seg.imageUrl} alt="사진" className="w-full max-h-96 object-cover" />
                            </div>
                          );
                        }
                        if (seg.type === 'map' && seg.mapQuery) {
                          return (
                            <div key={idx} className="my-4">
                              <GoogleMapEmbed query={seg.mapQuery} title={seg.mapTitle} address={seg.mapAddress} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Tips */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">💡 위지윅 팁:</span>
                  <span>단축키 <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">Ctrl+B</code>로 즉시 굵게 적용됩니다.</span>
                </div>
                <div className="text-slate-500">
                  우측 사진 목록에서 <strong className="text-slate-700">[사진 넣기]</strong>를 누르면 본문 작성 위치에 바로 사진이 삽입됩니다.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Metadata & Image Attachments (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* 1. Publication Meta Settings Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#30308A]" />
                  <span>게시글 발행 설정</span>
                </h3>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">카테고리</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['공지사항', '프로모션', 'VIP매거진'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#30308A] text-white border-[#30308A] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author & Initial View Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">작성자 닉네임</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="오아시스 VIP"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">초기 조회수</label>
                  <input
                    type="number"
                    value={viewCount}
                    onChange={(e) => setViewCount(Number(e.target.value))}
                    min={0}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                  />
                </div>
              </div>

              {/* Top Pin Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">상단 고정 공지</div>
                    <div className="text-[11px] text-slate-500">목록 최상단에 항상 고정</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#30308A] rounded border-slate-300 focus:ring-[#30308A] cursor-pointer"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  카드 요약문 (선택 - 비워두면 자동 생성)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="목록 카드 및 검색엔진 메타태그에 노출될 요약글..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="마닐라카지노, 오카다, 롤링, VIP의전"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                />
              </div>
            </div>

            {/* 2. Photo Attachments & 1-Click Placement Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#30308A]" />
                  <h3 className="text-sm font-extrabold text-slate-900">사진 첨부 (최대 6장)</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">{images.length}/6</span>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#30308A] bg-indigo-50/50'
                    : 'border-slate-200 hover:border-[#30308A] hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#30308A] flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#30308A]">클릭하여 사진 추가</span>
                    <span className="text-xs text-slate-500"> 또는 드래그 앤 드롭</span>
                  </div>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP 지원 (자동 720p 최적화)</span>
                </div>
              </div>

              {/* Manual URL Input Toggle */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-[#30308A] hover:underline cursor-pointer font-medium"
                >
                  {showUrlInput ? '접기' : '+ 웹 이미지 URL 직접 입력'}
                </button>
              </div>

              {showUrlInput && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="url"
                    placeholder="https://... 이미지 링크"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-200 outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="px-3 py-2 bg-[#30308A] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    추가
                  </button>
                </div>
              )}

              {/* Attached Photos List with 1-Click WYSIWYG Placement */}
              {images.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-500">등록된 사진 목록:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {images.map((imgSrc, idx) => {
                      const photoNum = idx + 1;
                      const isInserted = isPhotoInContent(content, idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50 gap-2.5 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                              <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800">사진 {photoNum}</span>
                                {idx === 0 && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                                    대표 썸네일
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {isInserted ? (
                                  <span className="text-emerald-600 font-medium">✓ 본문에 삽입됨</span>
                                ) : (
                                  <span>미삽입 (하단 갤러리 노출)</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => insertPhotoIntoEditor(idx, imgSrc)}
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#30308A] text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              title="현재 본문 커서 위치에 바로 삽입 (미리보기 없이 사진이 즉시 나타납니다)"
                            >
                              <ImageDown className="w-3.5 h-3.5" />
                              <span>본문 넣기</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="사진 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Save Action for Sidebar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !title.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5B54F]" />
                    <span>저장 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#E5B54F]" />
                    <span>{postToEdit ? '게시글 수정 완료하기' : '새 게시글 즉시 발행하기'}</span>
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
