import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
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
  Table,
  Code2,
} from 'lucide-react';
import { compressImageFile, optimizeDataUrl, optimizePostImages, createMiniThumbnail } from '../../utils/imageUpload';
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
  cleanPastedHtml,
  textToCleanHtmlParagraphs,
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
  const { addPost, updatePost, setIsAdminOpen, posts } = useSite();

  const [title, setTitle] = useState(postToEdit?.title || '');
  const [category, setCategory] = useState<'매거진' | '유흥' | '맛집' | '핫플' | '프로모션'>(
    (() => {
      const cat = postToEdit?.category;
      if (cat === 'VIP매거진' || cat === '커뮤니티' || cat === '공지사항') return '매거진';
      if (cat === '유흥' || cat === '맛집' || cat === '핫플' || cat === '프로모션') return cat;
      return '매거진';
    })()
  );
  const [author, setAuthor] = useState(postToEdit?.author || '오아시스 VIP');
  const [summary, setSummary] = useState(postToEdit?.summary || '');
  const [content, setContent] = useState(postToEdit?.content || '');

  const [images, setImages] = useState<string[]>(
    postToEdit?.images && postToEdit.images.length > 0
      ? postToEdit.images
      : postToEdit?.thumbnail
      ? [postToEdit.thumbnail]
      : []
  );

  // Real-time SEO metrics & optimizations
  const cleanBodyText = useMemo(() => stripFormattingTags(content), [content]);
  const textLength = cleanBodyText.length;

  const isDuplicateTitle = useMemo(() => {
    const norm = title.trim().toLowerCase();
    if (!norm || norm.length < 3) return false;
    return (posts || []).some(
      (p) => String(p.id) !== String(postToEdit?.id) && (p.title || '').trim().toLowerCase() === norm
    );
  }, [title, posts, postToEdit]);

  const isTitleTooShort = title.trim().length > 0 && title.trim().length < 15;
  const isTitleOptimal = title.trim().length >= 15 && title.trim().length <= 60;
  const isTitleTooLong = title.trim().length > 60;

  const isSummaryOptimal = summary.trim().length >= 40 && summary.trim().length <= 160;
  const isImageOnly = images.length > 0 && textLength < 80;

  // 1-Click Auto Extract optimal Meta Description from content
  const handleAutoExtractSummary = () => {
    if (!cleanBodyText) return;
    const extracted = cleanBodyText.slice(0, 140).trim() + (cleanBodyText.length > 140 ? '...' : '');
    setSummary(extracted);
  };
  const [isPinned, setIsPinned] = useState(postToEdit?.isPinned || false);
  const [viewCount, setViewCount] = useState<number>(
    postToEdit?.viewCount !== undefined ? postToEdit.viewCount : 392
  );
  const [tagsInput, setTagsInput] = useState(postToEdit?.tags ? postToEdit.tags.join(', ') : '');

  // Mode: Visual WYSIWYG vs Raw Code vs Preview
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const prevEditorModeRef = useRef<'visual' | 'code' | 'preview'>('visual');

  // Map state
  const [showMapPanel, setShowMapPanel] = useState(false);
  const [mapTitle, setMapTitle] = useState(postToEdit?.mapLocation?.title || '');
  const [mapAddress, setMapAddress] = useState(postToEdit?.mapLocation?.address || '');
  const [mapQuery, setMapQuery] = useState(postToEdit?.mapLocation?.query || '');
  const [hasAttachedMap, setHasAttachedMap] = useState(Boolean(postToEdit?.mapLocation));

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

  // Callback ref to guarantee immediate HTML injection the moment the DOM element attaches
  const setEditorElement = (node: HTMLDivElement | null) => {
    (editorRef as any).current = node;
    if (node && !isInitializedRef.current) {
      const initialBody = postToEdit ? postToEdit.content : '';
      const initialImgs = postToEdit?.images && postToEdit.images.length > 0
        ? postToEdit.images
        : postToEdit?.thumbnail
        ? [postToEdit.thumbnail]
        : [];
      node.innerHTML = postContentToHtml(
        initialBody,
        initialImgs,
        postToEdit?.mapLocation,
        true /* isEditorMode */
      );
      isInitializedRef.current = true;
    }
  };

  // Mode switcher handler with clean 2-way synchronization
  const handleSwitchMode = (newMode: 'visual' | 'code' | 'preview') => {
    if (newMode === editorMode) return;

    let currentWorkingContent = content;

    if (editorMode === 'visual') {
      if (editorRef.current) {
        currentWorkingContent = htmlToPostContent(editorRef.current);
        setContent(currentWorkingContent);
      }
    } else if (editorMode === 'code') {
      if (rawTextareaRef.current) {
        currentWorkingContent = rawTextareaRef.current.value;
        setContent(currentWorkingContent);
      }
    }

    if (newMode === 'visual') {
      if (editorRef.current) {
        editorRef.current.innerHTML = postContentToHtml(
          currentWorkingContent,
          images,
          hasAttachedMap ? { title: mapTitle, address: mapAddress, query: mapQuery } : undefined,
          true /* isEditorMode */
        );
      }
    }

    setEditorMode(newMode);
  };

  // Helper to insert code snippets into raw HTML textarea
  const insertCodeSnippet = (startTag: string, endTag: string = '') => {
    const textarea = rawTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end);
    const replacement = `${startTag}${selectedText}${endTag}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setContent(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 0);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
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

  // Initialize or update fields when postToEdit prop changes
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
      } else {
        setMapTitle('');
        setMapAddress('');
        setMapQuery('');
        setHasAttachedMap(false);
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
          postToEdit.mapLocation,
          true /* isEditorMode */
        );
        isInitializedRef.current = true;
      }
    } else {
      setTitle('');
      setCategory('매거진');
      setAuthor('오아시스 VIP');
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
  }, [postToEdit?.id]);

  // Keep editorRef innerHTML in sync if editorMode changes externally
  useEffect(() => {
    const prevMode = prevEditorModeRef.current;
    prevEditorModeRef.current = editorMode;

    if (prevMode === editorMode) return;

    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = postContentToHtml(
        content,
        images,
        {
          title: mapTitle,
          address: mapAddress,
          query: mapQuery,
        },
        true /* isEditorMode */
      );
    }
  }, [editorMode]);

  // Handle uploaded images
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length >= 6) {
      setUploadError(`사진은 최대 6장까지만 등록 가능합니다. (현재 ${images.length}장 등록됨)`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const availableSlots = 6 - images.length;
    const allowedFiles = fileArray.slice(0, availableSlots);

    if (fileArray.length > availableSlots) {
      setUploadError(`최대 6장까지만 등록 가능하여 선택하신 ${fileArray.length}장 중 ${availableSlots}장만 추가됩니다.`);
    } else {
      setUploadError(null);
    }

    setIsUploading(true);

    try {
      const uploadPromises = allowedFiles.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드할 수 있습니다 (JPG, PNG, WEBP 등).');
        }
        return await compressImageFile(file, 1600, 1600, 0.86, 350000);
      });

      const newBase64Images = await Promise.all(uploadPromises);
      const startIdx = images.length;
      const updatedImages = [...images, ...newBase64Images].slice(0, 6);
      setImages(updatedImages);

      // Auto-insert newly uploaded images into visual editor directly at cursor!
      if (newBase64Images.length > 0 && editorMode === 'visual') {
        newBase64Images.forEach((img, i) => {
          insertPhotoIntoEditor(startIdx + i, img);
        });
      }
    } catch (err: any) {
      console.error('Image compression error:', err);
      setUploadError(err.message || '사진 최적화 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    // 1. Remove from visual editor and re-index remaining cards
    if (editorRef.current) {
      const cards = Array.from(editorRef.current.querySelectorAll('.visual-photo-card'));
      cards.forEach((c) => {
        const idxStr = c.getAttribute('data-photo-idx');
        if (idxStr !== null) {
          const currentIdx = parseInt(idxStr, 10);
          if (currentIdx === indexToRemove) {
            c.remove();
          } else if (currentIdx > indexToRemove) {
            c.setAttribute('data-photo-idx', String(currentIdx - 1));
          }
        }
      });
      syncContentFromVisual();
    }

    // 2. Also clean up any raw [사진N] references in content state & raw textarea
    const photoNumToRemove = indexToRemove + 1;
    setContent((prevContent) => {
      let cleaned = prevContent.replace(
        new RegExp(`(?:<p[^>]*>\\s*)?\\[(?:사진|이미지|image|IMAGE)[_\\s]*${photoNumToRemove}\\](?:\\s*<\\/p>)?`, 'gi'),
        ''
      );
      cleaned = cleaned.replace(/\[(?:사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/gi, (match, p1) => {
        const num = parseInt(p1, 10);
        if (num > photoNumToRemove) {
          return `[사진${num - 1}]`;
        }
        return match;
      });
      return cleaned;
    });

    if (rawTextareaRef.current) {
      const currentVal = rawTextareaRef.current.value;
      let cleaned = currentVal.replace(
        new RegExp(`(?:<p[^>]*>\\s*)?\\[(?:사진|이미지|image|IMAGE)[_\\s]*${photoNumToRemove}\\](?:\\s*<\\/p>)?`, 'gi'),
        ''
      );
      cleaned = cleaned.replace(/\[(?:사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/gi, (match, p1) => {
        const num = parseInt(p1, 10);
        if (num > photoNumToRemove) {
          return `[사진${num - 1}]`;
        }
        return match;
      });
      rawTextareaRef.current.value = cleaned;
    }

    // 3. Update images state
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
        window.history.replaceState({}, '', cleanUrl);
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
        existing.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
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

  // 2. Insert Live HTML Table directly into WYSIWYG Editor
  const insertTableIntoEditor = (rows = 3, cols = 3) => {
    if (editorMode !== 'visual' || !editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    let tableHtml = `<div class="oasis-table-wrap overflow-x-auto my-4 max-w-full"><table class="oasis-table min-w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-sm"><thead><tr class="bg-slate-100 text-slate-800 font-bold">`;
    for (let c = 0; c < cols; c++) {
      const headerTitle = c === 0 ? '구분' : c === 1 ? '상세 내용' : c === 2 ? '혜택 및 조건' : `항목 ${c + 1}`;
      tableHtml += `<th class="border border-slate-300 px-4 py-2.5 text-left bg-slate-100 text-slate-800 font-bold">${headerTitle}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      const isEven = r % 2 === 1;
      tableHtml += `<tr class="${isEven ? 'bg-slate-50' : 'bg-white'}">`;
      for (let c = 0; c < cols; c++) {
        let cellText = `내용 ${r + 1}-${c + 1}`;
        if (r === 0 && c === 0) cellText = '오카다 VIP';
        if (r === 0 && c === 1) cellText = '스위트룸 3박 무료 제공';
        if (r === 0 && c === 2) cellText = '항공권 전액 지원';
        if (r === 1 && c === 0) cellText = '솔레어 리조트';
        if (r === 1 && c === 1) cellText = '롤링 1.5% 즉시 지급';
        if (r === 1 && c === 2) cellText = '전담 버틀러 상시 케어';
        if (r === 2 && c === 0) cellText = '클락 한 리조트';
        if (r === 2 && c === 1) cellText = '프리미엄 골프 18홀 연계';
        if (r === 2 && c === 2) cellText = '최고급 세단 의전 픽업';
        tableHtml += `<td class="border border-slate-300 px-4 py-2.5 text-slate-700">${cellText}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableHtml.trim();
    const tableWrap = tempDiv.firstElementChild;
    if (tableWrap) {
      insertNodeAtCursor(tableWrap);
    }
    saveSelection();
    syncContentFromVisual();
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
        const idxStr = card.getAttribute('data-photo-idx');
        const idxToRemove = idxStr !== null ? parseInt(idxStr, 10) : -1;
        if (idxToRemove >= 0) {
          handleRemoveImage(idxToRemove);
        } else {
          card.remove();
          syncContentFromVisual();
        }
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

    const setBlock = (tag: string) => {
      const blockTag = tag.startsWith('<') ? tag : `<${tag}>`;
      try {
        document.execCommand('formatBlock', false, blockTag);
      } catch {
        try {
          document.execCommand('formatBlock', false, tag);
        } catch {}
      }
    };

    const getCurrentBlockTag = (): string => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return '';
      const node = sel.getRangeAt(0).commonAncestorContainer;
      const el = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
      return el?.closest('h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, div')?.tagName.toLowerCase() || '';
    };

    const sel = window.getSelection();
    const hasSelection = !!(sel && !sel.isCollapsed && sel.rangeCount > 0);

    switch (type) {
      case 'bold':
        document.execCommand('bold', false);
        break;

      case 'underline':
        document.execCommand('underline', false);
        break;

      case 'size-lg': {
        if (hasSelection) {
          document.execCommand('fontSize', false, '5');
        } else {
          const currentTag = getCurrentBlockTag();
          if (currentTag === 'h2') {
            setBlock('p');
          } else {
            setBlock('h2');
          }
        }
        break;
      }

      case 'size-md': {
        if (hasSelection) {
          document.execCommand('fontSize', false, '4');
        } else {
          const currentTag = getCurrentBlockTag();
          if (currentTag === 'h3') {
            setBlock('p');
          } else {
            setBlock('h3');
          }
        }
        break;
      }

      case 'size-normal': {
        if (hasSelection) {
          document.execCommand('fontSize', false, '3');
        } else {
          setBlock('p');
        }
        break;
      }

      case 'size-sm': {
        if (hasSelection) {
          document.execCommand('fontSize', false, '2');
        } else {
          document.execCommand('fontSize', false, '2');
        }
        break;
      }

      case 'highlight': {
        if (hasSelection) {
          const range = sel!.getRangeAt(0);
          const parentMark = (range.commonAncestorContainer.nodeType === 1
            ? (range.commonAncestorContainer as HTMLElement)
            : range.commonAncestorContainer.parentElement)?.closest('mark, span[style*="background-color"]');

          if (parentMark) {
            const textNode = document.createTextNode(parentMark.textContent || '');
            parentMark.parentNode?.replaceChild(textNode, parentMark);
          } else {
            let success = false;
            try {
              success = document.execCommand('hiliteColor', false, '#fef08a');
            } catch {}
            if (!success) {
              try {
                success = document.execCommand('backColor', false, '#fef08a');
              } catch {}
            }
            if (!success) {
              const mark = document.createElement('mark');
              mark.className = 'bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-medium border border-amber-300/60';
              try {
                const contents = range.extractContents();
                mark.appendChild(contents);
                range.insertNode(mark);
              } catch {}
            }
          }
        } else {
          try {
            document.execCommand('hiliteColor', false, '#fef08a');
          } catch {
            document.execCommand('backColor', false, '#fef08a');
          }
        }
        break;
      }

      case 'gold':
        document.execCommand('foreColor', false, '#b8860b');
        break;

      case 'blue':
        document.execCommand('foreColor', false, '#30308A');
        break;

      case 'quote': {
        const currentTag = getCurrentBlockTag();
        if (currentTag === 'blockquote') {
          setBlock('p');
        } else {
          setBlock('blockquote');
        }
        break;
      }

      case 'bullet':
        document.execCommand('insertUnorderedList', false);
        break;

      case 'divider':
        document.execCommand('insertHorizontalRule', false);
        break;

      case 'clear': {
        document.execCommand('removeFormat', false);
        setBlock('p');
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const parentEl = container.nodeType === 1 ? (container as HTMLElement) : container.parentElement;
          if (parentEl && editorRef.current?.contains(parentEl)) {
            const styledParent = parentEl.closest('mark, font, span[style], span[class*="text-"], span[class*="oasis-"]');
            if (styledParent && styledParent !== editorRef.current) {
              const textNode = document.createTextNode(styledParent.textContent || '');
              styledParent.parentNode?.replaceChild(textNode, styledParent);
            }
          }
        }
        break;
      }

      case 'table': {
        insertTableIntoEditor(3, 3);
        break;
      }

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

  // Clean Paste Handler: Prevents foreign styling from breaking layout and preserves clean paragraphs
  const handleEditorPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text/plain');
    const rawHtml = clipboardData.getData('text/html');

    let htmlToInsert = '';
    if (rawHtml && rawHtml.trim()) {
      htmlToInsert = cleanPastedHtml(rawHtml);
    }

    // If no HTML or cleaned HTML is empty, convert plain text lines to clean paragraphs
    if (!htmlToInsert || !htmlToInsert.trim()) {
      htmlToInsert = textToCleanHtmlParagraphs(text);
    }

    if (!htmlToInsert) return;

    restoreSelection();

    let inserted = false;
    try {
      inserted = document.execCommand('insertHTML', false, htmlToInsert);
    } catch {}

    if (!inserted && editorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = htmlToInsert;
          const frag = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            frag.appendChild(tempDiv.firstChild);
          }
          range.insertNode(frag);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
          inserted = true;
        }
      }
      if (!inserted) {
        editorRef.current.innerHTML += htmlToInsert;
      }
    }

    saveSelection();
    syncContentFromVisual();
  };

  // Insert gorgeous pre-formatted visual layout template directly into the editor
  const handleInsertTemplate = () => {
    const templateContent = `## ✨ 2026 오아시스 VIP 카지노 특별 프로모션 & 혜택 요약

### 1. 카지노별 VIP 전용 혜택 비교표
<div class="oasis-table-wrap overflow-x-auto my-4 max-w-full">
  <table class="oasis-table min-w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-sm">
    <thead>
      <tr class="bg-slate-100 text-slate-800 font-bold">
        <th class="border border-slate-300 px-4 py-2.5 text-left bg-slate-100 text-slate-800 font-bold">호텔 / 리조트</th>
        <th class="border border-slate-300 px-4 py-2.5 text-left bg-slate-100 text-slate-800 font-bold">제공 객실</th>
        <th class="border border-slate-300 px-4 py-2.5 text-left bg-slate-100 text-slate-800 font-bold">롤링 커미션</th>
        <th class="border border-slate-300 px-4 py-2.5 text-left bg-slate-100 text-slate-800 font-bold">특별 의전 혜택</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-slate-900">오카다 마닐라</td>
        <td class="border border-slate-300 px-4 py-2.5">오션뷰 이그제큐티브 스위트</td>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-[#b8860b]">최대 1.5% 즉시 지급</td>
        <td class="border border-slate-300 px-4 py-2.5">공항 세단 픽업 + 패스트트랙</td>
      </tr>
      <tr class="bg-slate-50">
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-slate-900">솔레어 리조트</td>
        <td class="border border-slate-300 px-4 py-2.5">스카이타워 프리미어 스위트</td>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-[#b8860b]">최대 1.5% 즉시 지급</td>
        <td class="border border-slate-300 px-4 py-2.5">24시 전담 한국인 버틀러</td>
      </tr>
      <tr>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-slate-900">COD 마닐라</td>
        <td class="border border-slate-300 px-4 py-2.5">누와/노부 럭셔리 스위트</td>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-[#b8860b]">최대 1.4% 즉시 지급</td>
        <td class="border border-slate-300 px-4 py-2.5">미슐랭 레스토랑 F&B 풀지원</td>
      </tr>
      <tr class="bg-slate-50">
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-slate-900">클락 한 리조트</td>
        <td class="border border-slate-300 px-4 py-2.5">메리어트 / 스위스호텔 스위트</td>
        <td class="border border-slate-300 px-4 py-2.5 font-bold text-[#b8860b]">최대 1.5% 즉시 지급</td>
        <td class="border border-slate-300 px-4 py-2.5">명문 골프 클럽 18홀 무료 예약</td>
      </tr>
    </tbody>
  </table>
</div>

### 2. 행사 개요 및 주요 혜택
오아시스를 통해 예약하시는 모든 VIP 회원님께 **항공권 지원 및 롤링 1.5% 즉시 지급** 혜택을 제공합니다.
[형광펜]24시간 한국인 전담 버틀러 서비스[/형광펜]와 최고급 세단 의전이 함께합니다.

### 3. 특급 호텔 스위트룸 무료 숙박
- 마닐라 오카다 / 솔레어 / COD 최고급 스위트룸 제공
- 클락 한 리조트 / 디하이츠 프리미엄 빌라 연계
- VIP 전용 라운지 무료 이용 및 식음료 풀서비스

> "필리핀 최대의 신뢰와 전통, 오아시스가 가장 품격 있는 VIP 여정을 약속드립니다."

### 4. 찾아오시는 길 및 공식 위치
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
    } else if (editorMode === 'code' && rawTextareaRef.current) {
      finalContent = rawTextareaRef.current.value;
      setContent(finalContent);
    }

    if (!title.trim() || !finalContent.trim()) {
      setUploadError('게시글 제목과 본문 내용을 모두 입력해주세요.');
      return;
    }

    const cleanText = stripFormattingTags(finalContent);
    if (images.length > 0 && cleanText.length < 50) {
      setUploadError(
        '검색엔진(SEO) 품질 가이드: 본문이 이미지로만 구성되면 구글/네이버 검색 노출에서 제외됩니다. 본문에 최소 50자 이상의 설명을 작성해주세요.'
      );
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    setUploadError(null);

    try {
      // Dynamically optimize attached images to high resolution (up to 1600px WebP)
      // while safely guarding Firestore document capacity (under 800KB total images payload)
      const optimizedImages = await optimizePostImages(images);

      let primaryThumbnail: string | undefined = undefined;
      if (optimizedImages.length > 0) {
        primaryThumbnail = await createMiniThumbnail(optimizedImages[0]);
      }

      const mapLocationPayload =
        hasAttachedMap && (mapQuery.trim() || mapTitle.trim())
          ? {
              ...(mapTitle.trim() ? { title: mapTitle.trim() } : {}),
              ...(mapAddress.trim() ? { address: mapAddress.trim() } : {}),
              query: (mapQuery.trim() || mapTitle.trim()),
            }
          : undefined;

      const cleanSummary =
        summary.trim() ||
        (() => {
          const stripped = stripFormattingTags(finalContent);
          return stripped.slice(0, 140).trim() + (stripped.length > 140 ? '...' : '');
        })();

      const payload: any = {
        title: title.trim(),
        category,
        author: author.trim() || '오아시스 VIP',
        summary: cleanSummary,
        content: finalContent.trim(),
        isPinned,
        tags,
        viewCount: Number(viewCount) >= 0 ? Number(viewCount) : (postToEdit?.viewCount || 392),
      };

      // Explicitly set images, thumbnail, and mapLocation so deletions properly overwrite existing post data
      payload.images = optimizedImages;
      payload.thumbnail = primaryThumbnail || (optimizedImages.length > 0 ? optimizedImages[0] : '');
      payload.mapLocation = mapLocationPayload || null;

      // Strict Firestore 1MB document boundary guard (keeps entire payload under 900KB)
      const payloadSize = JSON.stringify(payload).length;
      if (payloadSize > 920000 && optimizedImages.length > 0) {
        const recoded = await Promise.all(
          optimizedImages.map((img) => optimizeDataUrl(img, 1200, 1200, 0.76, 120000))
        );
        payload.images = recoded;
        if (recoded.length > 0) {
          payload.thumbnail = await createMiniThumbnail(recoded[0]);
        }
      }

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
      setUploadError(err.message ? `게시글 저장 실패: ${err.message}` : '게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:h-screen flex flex-col bg-slate-100/70 font-sans lg:overflow-hidden animate-in fade-in duration-200">
      {/* 1. Top Navigation Bar (Fixed at top of studio) */}
      <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          {/* Left: Back button & Breadcrumb Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer group shadow-2xs shrink-0"
              title="커뮤니티 목록으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>목록으로</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminOpen(true);
                handleClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#30308A] hover:text-white text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title="관리자 설정 대시보드로 이동"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>관리자 설정</span>
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
            {/* Editor Mode Selector: Visual WYSIWYG vs HTML Tag Code vs Preview */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => handleSwitchMode('visual')}
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
                onClick={() => handleSwitchMode('code')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  editorMode === 'code'
                    ? 'bg-white text-[#30308A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="HTML 소스 코드 및 태그 직접 편집 모드 (HTML 기반 글 작성 및 수정)"
              >
                <Code2 className="w-3.5 h-3.5 text-[#30308A]" />
                <span className="font-extrabold">HTML / 태그 편집</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode('preview')}
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
      <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col lg:overflow-hidden">
        {/* Error Banner */}
        {uploadError && (
          <div className="mb-3 shrink-0 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          
          {/* LEFT COLUMN: Main WYSIWYG Writing Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Title Section (Fixed at top of left canvas, does not scroll away) */}
            <div className="p-4 sm:p-6 pb-3 border-b border-slate-100 shrink-0 space-y-1.5 bg-white">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>제목 (H1 자동 지정)</span>
                  <span className="text-red-500">*</span>
                  <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">구글·네이버 검색창 노출 제목</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isTitleOptimal
                        ? 'text-emerald-600'
                        : isTitleTooShort
                        ? 'text-amber-500'
                        : isTitleTooLong
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {title.length}/60자 {isTitleOptimal ? '(✓ 최적)' : isTitleTooShort ? '(다소 짧음)' : isTitleTooLong ? '(60자 초과)' : ''}
                  </span>
                </div>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="게시글 제목을 입력하세요 (예: 2026 오카다 VIP 스위트룸 이용 후기 및 롤링 혜택 안내)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg sm:text-2xl font-extrabold text-slate-900 border-0 border-b-2 border-slate-200 focus:border-[#30308A] focus:ring-0 px-0 py-1.5 placeholder:text-slate-300 transition-colors bg-transparent leading-snug"
              />
              {isDuplicateTitle && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 mt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>기존 게시글과 동일한 제목입니다. 검색엔진(구글/네이버) 노출 패널티를 방지하기 위해 고유한 제목을 권장합니다.</span>
                </div>
              )}
            </div>

            {/* Real-time WYSIWYG Visual Formatting Toolbar (Fixed at top of left canvas, does NOT scroll!) */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-slate-50 via-indigo-50/25 to-blue-50/30 border-b border-slate-200/80 shrink-0 space-y-2.5 shadow-2xs z-10">
              {/* Row 1: Font Sizes, Boldness, Highlights, Colors */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200/70 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Font Size Group: Instant Headings (대, 중, 보통, 소) */}
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

                    {/* Table Insertion Tool */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTableIntoEditor(3, 3)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer hover:border-[#30308A]"
                      title="표 삽입 (3x3 테이블 삽입 - 셀을 클릭하여 바로 텍스트 편집 및 서식 적용 가능)"
                    >
                      <Table className="w-3.5 h-3.5 text-[#30308A]" />
                      <span>표 삽입</span>
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
                <div className="max-h-64 overflow-y-auto custom-editor-scrollbar p-3.5 sm:p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
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
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">상세 주소 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: New Seaside Dr, Parañaque"
                        value={mapAddress}
                        onChange={(e) => setMapAddress(e.target.value)}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
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
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
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
                        className="px-3 py-1.5 rounded-xl bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
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

            {/* DEDICATED SCROLLABLE BODY CONTENT AREA: 본문 내용만 따로 스크롤! */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 custom-editor-scrollbar bg-white focus-within:ring-1 focus-within:ring-[#30308A]/10">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span>본문 내용</span>
                  <span className="text-red-500">*</span>
                  {editorMode === 'visual' && (
                    <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      실시간 비주얼 에디터
                    </span>
                  )}
                  {editorMode === 'code' && (
                    <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                      HTML / 태그 직접 편집 모드
                    </span>
                  )}
                  {editorMode === 'preview' && (
                    <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                      발행 상태 미리보기
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
              <div className={editorMode === 'visual' ? 'block' : 'hidden'}>
                <div
                  ref={setEditorElement}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onPaste={handleEditorPaste}
                  onBlur={() => {
                    saveSelection();
                    syncContentFromVisual();
                  }}
                  onKeyUp={saveSelection}
                  onMouseUp={saveSelection}
                  onClick={handleEditorClick}
                  onKeyDown={handleEditorKeyDown}
                  data-placeholder="이곳에 내용을 자유롭게 작성하세요. 상단 툴바의 글자 크기(대/중/보통/소), 굵게(B), 형광펜, 표 삽입, 사진 넣기는 항상 상단에 고정되어 있으며 본문만 자유롭게 스크롤됩니다..."
                  className="oasis-article-content visual-editor-canvas w-full min-h-[360px] outline-none text-slate-800 text-base leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none"
                />
              </div>

              {/* 2. RAW HTML CODE / TAG MODE (For power users & HTML posts) */}
              <div className={editorMode === 'code' ? 'block space-y-2.5' : 'hidden'}>
                {/* HTML Tag Quick Helper Bar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-700 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    태그 빠른 삽입:
                  </span>
                  <button type="button" onClick={() => insertCodeSnippet('<p class="my-2 leading-relaxed">', '</p>')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs cursor-pointer border border-slate-700">&lt;p&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<h2 class="text-xl font-bold my-3 pb-1 border-b border-slate-100">', '</h2>')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs cursor-pointer border border-slate-700">&lt;h2&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<h3 class="text-lg font-bold my-2">', '</h3>')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs cursor-pointer border border-slate-700">&lt;h3&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<strong>', '</strong>')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs cursor-pointer border border-slate-700">&lt;b/strong&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<mark class="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-medium">', '</mark>')} className="px-2 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-mono text-xs cursor-pointer border border-amber-800/60">&lt;형광펜&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<div class="oasis-table-wrap overflow-x-auto my-4 max-w-full">\n  <table class="oasis-table min-w-full border-collapse border border-slate-300 rounded-xl text-sm">\n    <thead>\n      <tr class="bg-slate-100 font-bold">\n        <th class="border border-slate-300 px-4 py-2">구분</th>\n        <th class="border border-slate-300 px-4 py-2">세부 내용</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td class="border border-slate-300 px-4 py-2 font-bold">항목</td>\n        <td class="border border-slate-300 px-4 py-2">상세 설명</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n', '')} className="px-2 py-0.5 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 font-mono text-xs cursor-pointer border border-indigo-800/60">&lt;table 표&gt;</button>
                  <button type="button" onClick={() => insertCodeSnippet('<blockquote class="my-3 pl-4 py-2 border-l-4 border-[#30308A] bg-slate-50 text-slate-700 italic rounded-r-lg font-medium">', '</blockquote>')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer border border-slate-700">&lt;인용구&gt;</button>
                  {images.length > 0 && (
                    <button type="button" onClick={() => insertCodeSnippet('[사진1]', '')} className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-mono text-xs cursor-pointer border border-emerald-800/60">[사진1]</button>
                  )}
                  <button type="button" onClick={() => insertCodeSnippet('[지도:오카다 마닐라]', '')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs cursor-pointer border border-slate-700">[지도]</button>
                </div>

                <textarea
                  ref={rawTextareaRef}
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="이곳에 HTML 코드나 본문 내용을 자유롭게 입력하세요. <table>, <div>, <p>, <span> 등 모든 태그가 지원됩니다..."
                  className="w-full h-full min-h-[380px] p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed border border-slate-700 outline-none resize-none shadow-inner focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* 3. FULL ARTICLE PREVIEW (Simulates public post detail layout) */}
              <div className={editorMode === 'preview' ? 'block' : 'hidden'}>
                <div className="w-full min-h-[360px] p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-6">
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
                    <FormattedPostContent
                      content={content}
                      images={images}
                      defaultMap={hasAttachedMap ? { title: mapTitle, address: mapAddress, query: mapQuery } : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Tips (Fixed at bottom of left canvas) */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-t border-slate-200/80 shrink-0 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">💡 {editorMode === 'code' ? 'HTML 모드:' : editorMode === 'preview' ? '미리보기:' : '위지윅 팁:'}</span>
                {editorMode === 'code' ? (
                  <span>작성하신 <strong>HTML 태그(&lt;table&gt;, &lt;p&gt;, &lt;div&gt;, &lt;b&gt; 등)</strong>가 원본 그대로 100% 안전하게 저장 및 렌더링됩니다.</span>
                ) : editorMode === 'preview' ? (
                  <span>실제 사이트에서 회원들에게 표시되는 화면과 100% 동일하게 렌더링됩니다.</span>
                ) : (
                  <span>상단 툴바에서 <strong>글자 크기(대/중/보통/소)</strong>, <strong>굵게/형광펜</strong>, <strong>표 삽입</strong>을 언제든지 바로 적용할 수 있습니다.</span>
                )}
              </div>
              <div className="text-slate-400 hidden sm:block">
                본문 영역만 단독으로 스크롤됩니다.
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Metadata & Image Attachments (4 cols) */}
          {/* 우측 게시글 발행설정 및 사진첨부: 본문 스크롤과 완전히 분리되어 고정 및 독립 스크롤 */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0 overflow-y-auto pr-1 space-y-4 custom-editor-scrollbar">
            
            {/* 1. Publication Meta Settings Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#30308A]" />
                  <span>게시글 발행 설정</span>
                </h3>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">카테고리</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['매거진', '유흥', '맛집', '핫플', '프로모션'] as const).map((cat) => (
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
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">초기 조회수</label>
                  <input
                    type="number"
                    value={viewCount}
                    onChange={(e) => setViewCount(Number(e.target.value))}
                    min={0}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                  />
                </div>
              </div>

              {/* Top Pin Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
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

              {/* Meta Description / Summary with SEO Counter & Auto-Extract Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>검색 요약문 (Meta Description)</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-semibold">SEO 핵심</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoExtractSummary}
                    disabled={!cleanBodyText}
                    className="text-[11px] text-[#30308A] hover:underline font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    title="본문 앞부분에서 검색 최적화 요약문을 자동으로 추출합니다"
                  >
                    <Sparkles className="w-3 h-3 text-[#E5B54F]" />
                    <span>본문 자동추출</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="구글, 네이버 검색결과 제목 아래에 스니펫으로 표시될 1~2줄 핵심 요약글 (50~160자 권장)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className={
                      isSummaryOptimal
                        ? 'text-emerald-600 font-bold'
                        : summary.length === 0
                        ? 'text-slate-400'
                        : 'text-amber-600 font-bold'
                    }
                  >
                    {summary.length}/160자 {isSummaryOptimal ? '(✓ 최적 분량)' : summary.length === 0 ? '(비워두면 자동 생성)' : '(50~160자 권장)'}
                  </span>
                  <span className="text-slate-400 text-[10px]">구글 검색 스니펫</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="마닐라카지노, 오카다, 롤링, VIP의전"
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-[#30308A] outline-none"
                />
              </div>
            </div>

            {/* SEO Live Optimization Analyzer Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-5 space-y-3 shadow-md border border-indigo-900/50">
              <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E5B54F]" />
                  <h3 className="text-xs sm:text-sm font-bold text-white">검색엔진(SEO) 실시간 진단</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  구글 · 네이버 점검
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Title Check */}
                <div className="flex items-start gap-2">
                  {isDuplicateTitle ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : isTitleOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>제목 길이 & 고유성</span>
                      <span className="font-mono text-[11px] text-slate-400">{title.length}/60자</span>
                    </div>
                    {isDuplicateTitle ? (
                      <p className="text-[11px] text-amber-300 mt-0.5">⚠️ 기존 글과 중복된 제목입니다. 고유한 제목을 권장합니다.</p>
                    ) : isTitleTooShort ? (
                      <p className="text-[11px] text-amber-300 mt-0.5">제목이 다소 짧습니다 (검색엔진 권장: 20~60자).</p>
                    ) : isTitleOptimal ? (
                      <p className="text-[11px] text-emerald-300 mt-0.5">✓ 검색결과 노출에 가장 이상적인 길이입니다.</p>
                    ) : isTitleTooLong ? (
                      <p className="text-[11px] text-amber-300 mt-0.5">60자 초과 시 검색창에서 잘릴 수 있습니다.</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-0.5">핵심 키워드를 포함한 20~60자 제목을 권장합니다.</p>
                    )}
                  </div>
                </div>

                {/* 2. Meta Description Check */}
                <div className="flex items-start gap-2">
                  {isSummaryOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : summary.length === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Meta Description (검색 요약문)</span>
                      <span className="font-mono text-[11px] text-slate-400">{summary.length}/160자</span>
                    </div>
                    {summary.length === 0 ? (
                      <p className="text-[11px] text-slate-400 mt-0.5">비워두면 본문 앞부분에서 자동 추출됩니다 (50~160자 권장).</p>
                    ) : isSummaryOptimal ? (
                      <p className="text-[11px] text-emerald-300 mt-0.5">✓ 검색결과 스니펫에 가장 적합한 분량입니다.</p>
                    ) : (
                      <p className="text-[11px] text-amber-300 mt-0.5">권장 분량: 50~160자 (현재 {summary.length}자)</p>
                    )}
                  </div>
                </div>

                {/* 3. Text Depth Check (Image-only prevention) */}
                <div className="flex items-start gap-2">
                  {isImageOnly ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>본문 텍스트 분량 (이미지 전용 글 방지)</span>
                      <span className="font-mono text-[11px] text-slate-400">{textLength}자</span>
                    </div>
                    {isImageOnly ? (
                      <p className="text-[11px] text-amber-300 mt-0.5">⚠️ 본문 텍스트가 부족합니다. 이미지만 올리면 검색엔진이 '빈 글'로 분류합니다 (최소 100자 권장).</p>
                    ) : (
                      <p className="text-[11px] text-emerald-300 mt-0.5">✓ 검색엔진이 색인하기에 충분한 텍스트입니다.</p>
                    )}
                  </div>
                </div>

                {/* 4. Headings & Semantic Info */}
                <div className="flex items-start gap-2 pt-1 border-t border-indigo-900/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">시맨틱 구조 준수:</span> 글 제목은 <strong className="text-emerald-300">H1</strong>으로 단 1개만 자동 부여되며, 본문 소제목은 상단 툴바의 <strong className="text-indigo-200">[대(H2)]</strong>, <strong className="text-indigo-200">[중(H3)]</strong>을 사용하시면 100점 SEO가 유지됩니다.
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Photo Attachments & 1-Click Placement Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
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
                className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
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
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-[#30308A] flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#30308A]">클릭하여 사진 추가</span>
                    <span className="text-xs text-slate-500"> 또는 드래그 앤 드롭</span>
                  </div>
                  <span className="text-[10px] text-slate-400">선명한 FHD/2K급 WebP 자동 최적화</span>
                </div>
              </div>

              {/* High Definition Quality Guarantee Notice */}
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-indigo-50/50 border border-amber-200/60 text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>원본급 선명도 보존 & 초고속 로딩</span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  2K급 고해상도(최대 1600px)와 모던 WebP 압축을 적용하여 원본 사진의 뭉개짐 없이 깨끗한 화질을 유지하며 사이트 용량 부담을 최소화합니다.
                </p>
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
                    className="px-3 py-1.5 bg-[#30308A] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    추가
                  </button>
                </div>
              )}

              {/* Attached Photos List with 1-Click WYSIWYG Placement */}
              {images.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500">등록된 사진 목록:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {images.map((imgSrc, idx) => {
                      const photoNum = idx + 1;
                      const isInserted = isPhotoInContent(content, idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50 gap-2.5 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 flex items-center justify-center p-0.5">
                              <img src={imgSrc} alt="" className="w-full h-full object-contain mx-auto" />
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

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => insertPhotoIntoEditor(idx, imgSrc)}
                              className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#30308A] text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              title="현재 본문 커서 위치에 바로 삽입 (미리보기 없이 사진이 즉시 나타납니다)"
                            >
                              <ImageDown className="w-3 h-3" />
                              <span>본문 넣기</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="사진 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !title.trim()}
                className="w-full py-3 rounded-2xl bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
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
