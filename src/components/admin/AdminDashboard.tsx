import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem, CasinoItem, BannerSlide, PhilippineTourSpot } from '../../types';
import { initialSiteConfig } from '../../data/initialData';
import { OasisLogoHorizontal } from '../OasisLogoHorizontal';
import { CasinoEditorModal } from './CasinoEditorModal';
import { PhilippineSpotEditorModal } from './PhilippineSpotEditorModal';
import {
  X,
  Palette,
  Globe,
  Sliders,
  Building2,
  FileText,
  Inbox,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Pin,
  CheckCircle2,
  Sparkles,
  Crown,
  Send,
  MessageCircle,
  ExternalLink,
  Shield,
  Info,
  Landmark,
  Compass,
  MapPin,
  HelpCircle,
  Copy,
  Check,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    siteConfig,
    updateSiteConfig,
    bannerSlides,
    updateBannerSlide,
    casinos,
    reorderCasinos,
    deleteCasino,
    philippineSpots,
    addPhilippineSpot,
    updatePhilippineSpot,
    deletePhilippineSpot,
    serviceSteps,
    updateServiceStep,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    posts,
    deletePost,
    openPostEditor,
    inquiryLeads,
    updateInquiryStatus,
    deleteInquiry,
    resetToDefaults,
    exportDataJSON,
    getExportJSONString,
    importDataJSON,
  } = useSite();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('oasis_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'seo' | 'banners' | 'casinos' | 'philippines' | 'process' | 'posts' | 'leads' | 'backup'>('general');

  // Modals state
  const [casinoModalOpen, setCasinoModalOpen] = useState(false);
  const [editingCasino, setEditingCasino] = useState<CasinoItem | null>(null);

  const [spotModalOpen, setSpotModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<PhilippineTourSpot | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app Confirmation Modal (replaces browser window.confirm which is blocked in iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = siteConfig.adminPassword || 'oasis1234!';
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('oasis_admin_auth', 'true');
      setPasswordError('');
      setPasswordInput('');
      showToast('관리자 인증에 성공하였습니다.');
    } else {
      setPasswordError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('oasis_admin_auth');
    setIsAdminOpen(false);
  };

  // 1. If not authenticated, render secure authentication modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#30308A] via-[#E5B54F] to-[#30308A]" />
          
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#30308A] to-slate-900 border border-[#E5B54F]/40 flex items-center justify-center shadow-lg shadow-black/40 mb-4">
              <Lock className="w-7 h-7 text-[#E5B54F]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              오아시스 관리자 보안 인증
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              본 시스템은 인가된 총괄 관리자 전용 CMS입니다.<br />
              접속을 위해 관리자 암호를 입력해 주십시오.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                관리자 비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="관리자 암호 입력 (초기: oasis1234!)"
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E5B54F] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1.5 animate-in fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  {passwordError}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#30308A] to-[#25256e] hover:from-[#3b3bb0] hover:to-[#30308A] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E5B54F]/30"
              >
                <Unlock className="w-4 h-4 text-[#E5B54F]" />
                <span>관리자 로그인</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl transition-all"
              >
                취소하고 사이트로 돌아가기
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              SSL 256-bit Security
            </span>
            <span>초기 기본 암호: oasis1234!</span>
          </div>
        </div>
      </div>
    );
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        showToast('설정 및 데이터가 성공적으로 복원되었습니다.');
      } else {
        showToast('올바른 백업 JSON 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#30308A] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5 text-[#E5B54F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  오아시스 관리자 CMS 대시보드
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5B54F] text-slate-950">
                  ADMIN LIVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firebase 클라우드 실시간 동기화
                </span>
              </div>
              <p className="text-xs text-slate-400">
                수정 및 작성하신 모든 내용이 클라우드 DB에 즉시 저장되어 넷플리파이 및 모든 방문자에게 실시간 반영됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                showToast('설정이 실시간으로 반영되었습니다.');
                setIsAdminOpen(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#30308A] hover:bg-[#25256e] text-white text-xs font-bold transition-all shadow cursor-pointer"
            >
              적용 후 사이트 보기
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="관리자 로그아웃"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>로그아웃</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-slate-900 px-6 flex space-x-1 sm:space-x-2 overflow-x-auto border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'general'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            기본정보 & 테마설정
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'about'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            About Oasis 소개 관리
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'seo'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO & 메타태그
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'banners'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            메인 배너 슬라이더
          </button>
          <button
            onClick={() => setActiveTab('casinos')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'casinos'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            카지노 목록 ({casinos.length})
          </button>
          <button
            onClick={() => setActiveTab('philippines')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'philippines'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            필리핀 소개/투어 카드 ({philippineSpots.length})
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'process'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            이용방법 관리
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'posts'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            커뮤니티/공지 관리 ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'leads'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            상담 신청 접수함 ({inquiryLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3.5 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-[#E5B54F] text-[#E5B54F]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            데이터 백업/초기화
          </button>
        </div>

        {/* Main Tab Content Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
              {/* TAB 1: General & Theme Settings */}
          {activeTab === 'general' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Security & Password Settings Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#E5B54F]" />
                    관리자 접속 보안 및 암호(비밀번호) 설정
                  </h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    보안 잠금 활성화됨
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block mb-1">
                      현재 등록된 비밀번호
                    </span>
                    <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-[#E5B54F]">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      <span>{siteConfig.adminPassword || 'oasis1234!'}</span>
                      <span className="text-[10px] text-slate-500 font-sans ml-auto">
                        (초기: oasis1234!)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      새 관리자 비밀번호로 변경
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="새 비밀번호 입력"
                          className="w-full px-3 py-2 pr-8 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#E5B54F]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPassword.trim()) {
                            showToast('새 비밀번호를 입력해 주세요.');
                            return;
                          }
                          if (newPassword.trim().length < 4) {
                            showToast('비밀번호는 최소 4자 이상이어야 합니다.');
                            return;
                          }
                          updateSiteConfig({ adminPassword: newPassword.trim() });
                          setNewPassword('');
                          showToast('관리자 접속 비밀번호가 성공적으로 변경 및 저장되었습니다.');
                        }}
                        className="px-3.5 py-2 bg-[#E5B54F] hover:bg-[#d6a53f] text-slate-950 font-bold text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer shadow"
                      >
                        암호 변경
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  * 암호를 변경하시면 Firebase 클라우드 DB에 즉시 저장되며, 이후 관리자 모드 접속 시 변경된 암호로만 로그인할 수 있습니다.
                </p>
              </div>
              
              {/* Header Logo & Navigation */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Palette className="w-4 h-4 text-[#30308A]" />
                  로고 및 메인 네비게이션 관리
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">상단 좌측 메인 로고 (파일 업로드 또는 이미지 URL)</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-48 h-16 rounded-xl bg-slate-950 border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                          <img
                            src={siteConfig.headerLogo || "/images/oasis_header_logo.webp"}
                            alt="Logo Preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateSiteConfig({ headerLogo: reader.result as string });
                                  showToast('로고 이미지가 성공적으로 적용되었습니다.');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#30308A] file:text-white hover:file:bg-[#25256e] cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder="또는 이미지 URL 직접 입력 (https://...)"
                            value={siteConfig.headerLogo?.startsWith('data:') ? '' : (siteConfig.headerLogo || '')}
                            onChange={(e) => updateSiteConfig({ headerLogo: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                          />
                        </div>
                        {siteConfig.headerLogo && siteConfig.headerLogo !== '/images/oasis_header_logo.webp' && (
                          <button
                            onClick={() => {
                              updateSiteConfig({ headerLogo: '/images/oasis_header_logo.webp' });
                              showToast('기본 공식 골드 로고로 복원되었습니다.');
                            }}
                            className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors whitespace-nowrap"
                          >
                            기본 로고로 복원
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        * 투명 배경의 가로형 PNG/SVG 이미지를 권장합니다. 로컬 파일 업로드 또는 이미지 URL(https://...)을 입력하시면 즉시 적용됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-3">네비게이션 카테고리명 변경 (상단 메뉴)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">메뉴 1</span>
                        <input
                          type="text"
                          value={siteConfig.navMenu1 || '오아시스 소개'}
                          onChange={(e) => updateSiteConfig({ navMenu1: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">메뉴 2</span>
                        <input
                          type="text"
                          value={siteConfig.navMenu2 || '카지노 소개'}
                          onChange={(e) => updateSiteConfig({ navMenu2: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">메뉴 3</span>
                        <input
                          type="text"
                          value={siteConfig.navMenu3 || '필리핀 소개'}
                          onChange={(e) => updateSiteConfig({ navMenu3: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">메뉴 4</span>
                        <input
                          type="text"
                          value={siteConfig.navMenu4 || '이용방법'}
                          onChange={(e) => updateSiteConfig({ navMenu4: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">메뉴 5</span>
                        <input
                          type="text"
                          value={siteConfig.navMenu5 || '커뮤니티'}
                          onChange={(e) => updateSiteConfig({ navMenu5: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#30308A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Palette className="w-4 h-4 text-[#30308A]" />
                  브랜드 정보 및 디자인 테마
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      웹사이트 공식 명칭
                    </label>
                    <input
                      type="text"
                      value={siteConfig.siteName}
                      onChange={(e) => updateSiteConfig({ siteName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      영문 서브타이틀
                    </label>
                    <input
                      type="text"
                      value={siteConfig.subTitle}
                      onChange={(e) => updateSiteConfig({ subTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
                    />
                  </div>
                </div>

                {/* Point Color Picker */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      포인트 강조 컬러 (현재: {siteConfig.pointColor})
                    </span>
                    <p className="text-[11px] text-slate-500">
                      공식 지정 색상 #30308A 또는 원하는 브랜드 컬러를 직접 선택할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={siteConfig.pointColor || '#30308A'}
                      onChange={(e) => updateSiteConfig({ pointColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => updateSiteConfig({ pointColor: '#30308A' })}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      #30308A 기본값 리셋
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Send className="w-4 h-4 text-sky-500" />
                  소셜 미디어 & 실시간 메신저 연동 설정 (카카오톡, 텔레그램)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      텔레그램 아이디 표시
                    </label>
                    <input
                      type="text"
                      value={siteConfig.telegramId}
                      onChange={(e) => updateSiteConfig({ telegramId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      텔레그램 연결 링크 (URL)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.telegramUrl}
                      onChange={(e) => updateSiteConfig({ telegramUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      카카오톡 아이디 표시
                    </label>
                    <input
                      type="text"
                      value={siteConfig.kakaoId}
                      onChange={(e) => updateSiteConfig({ kakaoId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      카카오톡 오픈채팅 / 채널 링크 (URL)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.kakaoUrl}
                      onChange={(e) => updateSiteConfig({ kakaoUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      대표 전화번호 (인터넷전화 / 현지폰)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.phoneNumber}
                      onChange={(e) => updateSiteConfig({ phoneNumber: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      공식 이메일
                    </label>
                    <input
                      type="email"
                      value={siteConfig.email}
                      onChange={(e) => updateSiteConfig({ email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Corporate details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  라이센스 및 사업자 정보
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">대표 디렉터</label>
                    <input
                      type="text"
                      value={siteConfig.representative}
                      onChange={(e) => updateSiteConfig({ representative: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">정부 공인 라이센스 표기</label>
                    <input
                      type="text"
                      value={siteConfig.licenseNumber}
                      onChange={(e) => updateSiteConfig({ licenseNumber: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">현지 오피스 주소</label>
                    <input
                      type="text"
                      value={siteConfig.companyAddress}
                      onChange={(e) => updateSiteConfig({ companyAddress: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: About Oasis Section Manager */}
          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Top Intro Bar */}
              <div className="bg-gradient-to-r from-[#141432] via-[#20205A] to-[#141432] text-white p-6 rounded-2xl shadow-sm space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-[#E5B54F]">
                  <Landmark className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">ABOUT OASIS AGENT 관리</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  PAGCOR, GAB, PCSO 정부 공인 에이전트 인증 및 13년 현지 직영 케어 메시지를 직접 수정하실 수 있습니다. (Enter로 원하는 위치에서 줄바꿈 가능)
                </p>
              </div>

              {/* Main Title & Subtitle */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Info className="w-4 h-4 text-[#30308A]" />
                  섹션 상단 타이틀 및 배지
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">상단 영문 배지 문구</label>
                    <input
                      type="text"
                      value={siteConfig.aboutBadge || 'ABOUT OASIS AGENT'}
                      onChange={(e) => updateSiteConfig({ aboutBadge: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">메인 대제목 (Enter로 줄바꿈 가능)</label>
                      <span className="text-[10px] text-amber-600 font-medium">원하는 위치에서 Enter(줄바꿈) 입력</span>
                    </div>
                    <textarea
                      rows={2}
                      value={siteConfig.aboutTitle || ''}
                      onChange={(e) => updateSiteConfig({ aboutTitle: e.target.value })}
                      placeholder="PAGCOR · GAB · PCSO 필리핀 정부 공인&#10;13년 현지 직영 VIP 공식 에이전트"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold resize-y"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">서브 설명문 (Enter로 줄바꿈 가능)</label>
                      <span className="text-[10px] text-amber-600 font-medium">원하는 위치에서 Enter(줄바꿈) 입력</span>
                    </div>
                    <textarea
                      rows={3}
                      value={siteConfig.aboutSubtitle || ''}
                      onChange={(e) => updateSiteConfig({ aboutSubtitle: e.target.value })}
                      placeholder="오아시스는 필리핀 정부 산하 PAGCOR, GAB, PCSO 정식 공인 에이전트로서..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Story Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-[#30308A]" />
                  본문 스토리 및 정부기관 공인·현지케어 안내
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">스토리 헤드라인 문구</label>
                      <span className="text-[10px] text-amber-600 font-medium">Enter 줄바꿈 지원</span>
                    </div>
                    <textarea
                      rows={2}
                      value={siteConfig.aboutStoryHeading || ''}
                      onChange={(e) => updateSiteConfig({ aboutStoryHeading: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">스토리 단락 1 (PAGCOR · GAB · PCSO 공인 및 13년 무사고)</label>
                    <textarea
                      rows={3}
                      value={siteConfig.aboutStoryParagraph1 || ''}
                      onChange={(e) => updateSiteConfig({ aboutStoryParagraph1: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">스토리 단락 2 (마닐라·클락 인프라 및 24시간 현지 밀착케어)</label>
                    <textarea
                      rows={3}
                      value={siteConfig.aboutStoryParagraph2 || ''}
                      onChange={(e) => updateSiteConfig({ aboutStoryParagraph2: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">하단 핵심 보증 하이라이트 박스 문구</label>
                    <textarea
                      rows={2}
                      value={siteConfig.aboutStoryHighlight || ''}
                      onChange={(e) => updateSiteConfig({ aboutStoryHighlight: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Image and Floating Badge Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  대표 이미지 및 공인 엠블럼 배지 문구
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">대표 이미지 URL</label>
                    <input
                      type="url"
                      value={siteConfig.aboutImageUrl || ''}
                      onChange={(e) => updateSiteConfig({ aboutImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">플로팅 배지 상단 텍스트</label>
                    <input
                      type="text"
                      value={siteConfig.aboutLicenseTitle || '필리핀 정부기관 공식 승인 에이전시'}
                      onChange={(e) => updateSiteConfig({ aboutLicenseTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">플로팅 배지 기관 표기</label>
                    <input
                      type="text"
                      value={siteConfig.aboutLicenseSub || 'PAGCOR · GAB · PCSO Official Registered Agency'}
                      onChange={(e) => updateSiteConfig({ aboutLicenseSub: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Stats Numbers */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-4 h-4 text-[#E5B54F]" />
                  하단 통계 수치 관리 (4개 지표)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">지표 1 (연차)</label>
                    <input
                      type="text"
                      value={siteConfig.aboutStat1Num || '13+'}
                      onChange={(e) => updateSiteConfig({ aboutStat1Num: e.target.value })}
                      placeholder="13+"
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={siteConfig.aboutStat1Label || '년 현지 직영 VIP 운영'}
                      onChange={(e) => updateSiteConfig({ aboutStat1Label: e.target.value })}
                      placeholder="년 현지 직영 VIP 운영"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">지표 2 (정부공인)</label>
                    <input
                      type="text"
                      value={siteConfig.aboutStat2Num || '100%'}
                      onChange={(e) => updateSiteConfig({ aboutStat2Num: e.target.value })}
                      placeholder="100%"
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={siteConfig.aboutStat2Label || 'PAGCOR·GAB·PCSO 공인'}
                      onChange={(e) => updateSiteConfig({ aboutStat2Label: e.target.value })}
                      placeholder="PAGCOR·GAB·PCSO 공인"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">지표 3 (고객수)</label>
                    <input
                      type="text"
                      value={siteConfig.aboutStat3Num || '20,000+'}
                      onChange={(e) => updateSiteConfig({ aboutStat3Num: e.target.value })}
                      placeholder="20,000+"
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={siteConfig.aboutStat3Label || '누적 VIP 고객 현지 케어'}
                      onChange={(e) => updateSiteConfig({ aboutStat3Label: e.target.value })}
                      placeholder="누적 VIP 고객 현지 케어"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">지표 4 (상주케어)</label>
                    <input
                      type="text"
                      value={siteConfig.aboutStat4Num || '24 / 7'}
                      onChange={(e) => updateSiteConfig({ aboutStat4Num: e.target.value })}
                      placeholder="24 / 7"
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={siteConfig.aboutStat4Label || '한국인 베테랑 현지 상주'}
                      onChange={(e) => updateSiteConfig({ aboutStat4Label: e.target.value })}
                      placeholder="한국인 베테랑 현지 상주"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SEO & Meta Tags */}
          {activeTab === 'seo' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-4 h-4 text-[#30308A]" />
                  검색 엔진 최적화 (SEO) 및 메타 태그 설정
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SEO 브라우저 타이틀 (Title Tag)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.seoTitle}
                    onChange={(e) => updateSiteConfig({ seoTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    검색 엔진 설명문 (Meta Description)
                  </label>
                  <textarea
                    rows={3}
                    value={siteConfig.seoDescription}
                    onChange={(e) => updateSiteConfig({ seoDescription: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    타겟 검색 키워드 (쉼표 구분)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.seoKeywords}
                    onChange={(e) => updateSiteConfig({ seoKeywords: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Google Search Result Preview */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 mt-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    홈페이지 구글 검색 결과 미리보기 (Main SERP Preview)
                  </span>
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                      {siteConfig.seoTitle || siteConfig.siteName}
                    </p>
                    <p className="text-xs text-emerald-700 truncate">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://oasis46.com'}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                      {siteConfig.seoDescription || siteConfig.subTitle}
                    </p>
                  </div>
                </div>

                {/* Google Search Engine Indexing Guide */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>구글 검색 결과 반영 및 파비콘 노출 안내</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800 leading-relaxed">
                    <li>
                      <strong>SEO 타이틀 변경 시</strong>: 관리자 페이지에서 변경한 내용은 즉시 저장되지만, 구글 검색 결과는 구글봇(Googlebot)이 사이트를 다시 방문(크롤링)하여 캐시를 갱신할 때 반영됩니다.
                    </li>
                    <li>
                      <strong>즉시 갱신 요청</strong>: 구글 서치 콘솔(Google Search Console)의 [URL 검사]에 도메인(<code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">https://oasis46.com/</code> 또는 해당 게시글 URL)을 입력하고 <strong>[색인 생성 요청]</strong>을 클릭하시면 우선적으로 갱신됩니다.
                    </li>
                    <li>
                      <strong>파비콘(Favicon) 노출</strong>: 구글 검색 결과의 파비콘은 별도의 전용 로봇(<code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">Googlebot-Favicon</code>)이 별도 주기로 수집합니다. 최초 색인 시 지구본 아이콘으로 뜨다가 수집 완료 후 골드 로고로 자동 교체됩니다.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Dynamic Post SEO & Google Indexation Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E5B54F]" />
                    커뮤니티 개별 게시글 구글 검색(SEO) 자동 최적화 시스템
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    동적 Meta & JSON-LD 활성화됨
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  모든 커뮤니티 게시글은 고유 Dynamic URL(<code className="bg-slate-100 px-1 py-0.5 rounded text-[#30308A] font-mono">?post=ID</code>)을 가지며, 사용자가 접속하거나 구글 봇(Googlebot)이 크롤링할 때 게시글 제목, 요약문, 썸네일, 태그를 기반으로 <strong className="text-slate-800">Title, Description, Canonical URL, OpenGraph, Schema.org Article 구조화 데이터</strong>가 실시간 동적 주입됩니다.
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    현재 등록된 게시글별 고유 SEO 주소 목록 ({posts.length}개):
                  </span>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50">
                    {posts.map((post) => {
                      const postUrl = typeof window !== 'undefined' ? `${window.location.origin}?post=${encodeURIComponent(post.id)}` : `?post=${post.id}`;
                      return (
                        <div key={post.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {post.category}
                              </span>
                              <span className="font-bold text-slate-900 truncate">
                                {post.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono truncate">
                              {postUrl}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(postUrl);
                              }
                              showToast(`"${post.title}" 고유 주소가 복사되었습니다.`);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>URL 복사</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Robots.txt & Sitemap.xml Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#30308A]" />
                    검색 엔진 수집 로봇 & 사이트맵 (robots.txt & sitemap.xml)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    정상 설정 완료
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* robots.txt */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">1. robots.txt</span>
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#30308A] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>새 탭 열기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      구글 봇의 모든 페이지 크롤링을 허용하고 sitemap.xml 경로를 안내합니다.
                    </p>
                    <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono whitespace-pre-wrap">
{`User-agent: *
Allow: /
Sitemap: https://oasis46.com/sitemap.xml`}
                    </pre>
                  </div>

                  {/* sitemap.xml */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">2. sitemap.xml</span>
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#30308A] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>새 탭 열기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      메인 홈 및 개별 게시글 dynamic URL이 포함된 사이트맵입니다.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://oasis46.com/sitemap.xml"
                        className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white border border-slate-300 rounded-lg text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText('https://oasis46.com/sitemap.xml');
                          }
                          showToast('sitemap.xml 주소가 복사되었습니다.');
                        }}
                        className="px-2.5 py-1.5 bg-[#30308A] text-white rounded-lg text-[11px] font-bold shrink-0 hover:bg-[#25256e] cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Engine Ownership Verification Card (Google & Naver) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    검색엔진 사이트 소유권 확인 (Google & Naver)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    인증 파일 및 메타태그 등록됨
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Google Search Console */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-bold text-slate-800">구글 서치 콘솔 (Google)</span>
                      </div>
                      <a
                        href="/google0a5b1c5b114c2a44.html"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#30308A] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>인증파일 열기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      HTML 파일 업로드 및 메타 태그 인증이 모두 적용되어 있습니다.
                    </p>
                    <div className="p-2 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono break-all">
                      google0a5b1c5b114c2a44.html
                    </div>
                  </div>

                  {/* Naver Search Advisor */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-slate-800">네이버 서치어드바이저 (Naver)</span>
                      </div>
                      <a
                        href="/naver768b575e5a46ce5f8205f8ec6a081d0d.html"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#30308A] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>인증파일 열기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      HTML 파일 업로드 및 메타 태그 인증이 모두 적용되어 있습니다.
                    </p>
                    <div className="p-2 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono break-all">
                      naver768b575e5a46ce5f8205f8ec6a081d0d.html
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Banner Slider Manager */}
          {activeTab === 'banners' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">
                  메인 히어로 배너 슬라이드 관리
                </h3>
              </div>

              <div className="space-y-4">
                {bannerSlides.map((slide, sIdx) => (
                  <div
                    key={slide.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-[#30308A]">
                        슬라이드 #{sIdx + 1} ({slide.badge})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">상단 뱃지 텍스트</label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) => updateBannerSlide(slide.id, { badge: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">버튼 문구</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={(e) => updateBannerSlide(slide.id, { ctaText: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">메인 헤드라인 제목 (Enter로 줄바꿈 가능)</label>
                        <span className="text-[10px] text-amber-600 font-medium">원하는 위치에서 Enter(줄바꿈)를 누르세요</span>
                      </div>
                      <textarea
                        rows={2}
                        value={slide.title}
                        onChange={(e) => updateBannerSlide(slide.id, { title: e.target.value })}
                        placeholder="메인 헤드라인을 입력하세요. 줄바꿈 시 화면에 그대로 반영됩니다."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold resize-y"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">서브 설명문 (Enter로 줄바꿈 가능)</label>
                        <span className="text-[10px] text-amber-600 font-medium">원하는 위치에서 Enter(줄바꿈)를 누르세요</span>
                      </div>
                      <textarea
                        rows={3}
                        value={slide.subtitle}
                        onChange={(e) => updateBannerSlide(slide.id, { subtitle: e.target.value })}
                        placeholder="서브 설명문을 입력하세요. 줄바꿈 시 화면에 그대로 반영됩니다."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">배경 이미지 URL</label>
                        <button
                          type="button"
                          onClick={() => updateBannerSlide(slide.id, { bgImage: sIdx === 0 ? '/images/hero_bg.jpg' : '/images/casino_table.jpg' })}
                          className="text-[10px] text-[#30308A] hover:underline font-bold"
                        >
                          기본 고화질 카지노 배경으로 리셋
                        </button>
                      </div>
                      <input
                        type="text"
                        value={slide.bgImage}
                        onChange={(e) => updateBannerSlide(slide.id, { bgImage: e.target.value })}
                        placeholder="/images/hero_bg.jpg 또는 이미지 URL"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Casino List Manager */}
          {activeTab === 'casinos' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Section Header Controls */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Crown className="w-4 h-4 text-[#30308A]" />
                  카지노 소개 섹션 메인 타이틀 및 소개글 직접 수정
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">상단 영문 배지 문구</label>
                    <input
                      type="text"
                      value={siteConfig.casinoBadge || 'MAJOR CASINO & VIP RESORTS'}
                      onChange={(e) => updateSiteConfig({ casinoBadge: e.target.value })}
                      placeholder="MAJOR CASINO & VIP RESORTS"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">메인 타이틀 (Heading)</label>
                    <input
                      type="text"
                      value={siteConfig.casinoTitle || '필리핀 메이저 카지노 공식 제휴 라인업'}
                      onChange={(e) => updateSiteConfig({ casinoTitle: e.target.value })}
                      placeholder="필리핀 메이저 카지노 공식 제휴 라인업"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      서브 설명문 (줄바꿈 시 화면에 그대로 반영)
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfig.casinoSubtitle || ''}
                      onChange={(e) => updateSiteConfig({ casinoSubtitle: e.target.value })}
                      placeholder="오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    제휴 카지노 & 복합리조트 리스트 ({casinos.length}개)
                  </h3>
                  <p className="text-xs text-slate-500">
                    마닐라 및 클락 카지노 정보를 추가, 수정, 삭제할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCasino(null);
                    setCasinoModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#30308A] hover:bg-[#25256e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>신규 카지노 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {casinos.map((casino, idx) => (
                  <div
                    key={casino.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={casino.image}
                        alt={casino.name}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/80 text-[#E5B54F] font-mono text-[10px] font-black backdrop-blur-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#30308A]/10 text-[#30308A]">
                            순서 {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {casino.region === 'manila' ? '마닐라' : '클락'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {casino.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {casino.englishName}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                          {casino.highlights}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {/* Order adjustment buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={async () => {
                              if (idx === 0) return;
                              const updated = [...casinos];
                              const [moved] = updated.splice(idx, 1);
                              updated.splice(idx - 1, 0, moved);
                              await reorderCasinos(updated);
                              showToast(`'${casino.name}' 순서를 위로 올렸습니다.`);
                            }}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="위로 이동"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === casinos.length - 1}
                            onClick={async () => {
                              if (idx === casinos.length - 1) return;
                              const updated = [...casinos];
                              const [moved] = updated.splice(idx, 1);
                              updated.splice(idx + 1, 0, moved);
                              await reorderCasinos(updated);
                              showToast(`'${casino.name}' 순서를 아래로 내렸습니다.`);
                            }}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="아래로 이동"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCasino(casino);
                              setCasinoModalOpen(true);
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            수정
                          </button>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: '카지노 삭제',
                                message: `'${casino.name}' 카지노를 목록에서 삭제하시겠습니까?`,
                                confirmText: '삭제',
                                confirmColor: 'bg-red-600 hover:bg-red-700',
                                onConfirm: () => {
                                  deleteCasino(casino.id);
                                  showToast('카지노가 삭제되었습니다.');
                                },
                              });
                            }}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Philippine Tour Spots Manager */}
          {activeTab === 'philippines' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Section Header Controls */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Compass className="w-4 h-4 text-[#30308A]" />
                  필리핀 소개 섹션 메인 타이틀 및 소개글 직접 수정
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">상단 영문 배지 문구</label>
                    <input
                      type="text"
                      value={siteConfig.philippinesBadge || 'PHILIPPINES VIP TRAVEL & GOLF'}
                      onChange={(e) => updateSiteConfig({ philippinesBadge: e.target.value })}
                      placeholder="PHILIPPINES VIP TRAVEL & GOLF"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">메인 타이틀 (Heading)</label>
                    <input
                      type="text"
                      value={siteConfig.philippinesTitle || '필리핀 VIP 라이프스타일 & 여행 가이드'}
                      onChange={(e) => updateSiteConfig({ philippinesTitle: e.target.value })}
                      placeholder="필리핀 VIP 라이프스타일 & 여행 가이드"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      서브 설명문 (줄바꿈 시 화면에 그대로 반영)
                    </label>
                    <textarea
                      rows={3}
                      value={siteConfig.philippinesSubtitle || ''}
                      onChange={(e) => updateSiteConfig({ philippinesSubtitle: e.target.value })}
                      placeholder="화려한 마닐라의 도심 라이프와 클락의 여유로운 명문 골프 코스까지,\n오아시스가 엄선한 프리미엄 필리핀 투어 정보를 안내해 드립니다."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    필리핀 VIP 투어/라이프스타일 카드 리스트 ({philippineSpots.length}개)
                  </h3>
                  <p className="text-xs text-slate-500">
                    호텔, 골프, 다이닝 등 필리핀 소개 카드를 직접 추가, 수정, 삭제할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSpot(null);
                    setSpotModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#30308A] hover:bg-[#25256e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 소개 카드 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {philippineSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4"
                  >
                    <img
                      src={spot.image}
                      alt={spot.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 bg-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E1E4F] text-[#E5B54F]">
                            {spot.location}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {spot.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {spot.subtitle}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                          {spot.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setEditingSpot(spot);
                            setSpotModalOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          수정
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: '소개 카드 삭제',
                              message: `'${spot.title}' 소개 카드를 삭제하시겠습니까?`,
                              confirmText: '삭제',
                              confirmColor: 'bg-red-600 hover:bg-red-700',
                              onConfirm: () => {
                                deletePhilippineSpot(spot.id);
                                showToast('카드가 삭제되었습니다.');
                              },
                            });
                          }}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Process Manager */}
          {activeTab === 'process' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#30308A]" />
                  이용절차 메인 타이틀 관리
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">섹션 메인 타이틀</label>
                    <input
                      type="text"
                      value={siteConfig.processTitle || '오아시스 VIP 의전 서비스 이용절차'}
                      onChange={(e) => updateSiteConfig({ processTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">서브 설명문</label>
                    <textarea
                      rows={2}
                      value={siteConfig.processSubtitle || '첫 상담부터 호텔 예약, 공항 패스트트랙, 현지 1:1 케어 및 출국 정산까지 빈틈없는 5단계 원스톱 VIP 프로세스로 모십니다.'}
                      onChange={(e) => updateSiteConfig({ processSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    VIP 서비스 이용절차 관리
                  </h3>
                  <p className="text-xs text-slate-500">
                    5단계 프로세스의 제목과 설명을 수정할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {serviceSteps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-[#30308A]">
                        STEP {step.stepNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">진행 단계 제목</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateServiceStep(sIdx, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">영문 타이틀</label>
                        <input
                          type="text"
                          value={step.engTitle}
                          onChange={(e) => updateServiceStep(sIdx, { engTitle: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">메인 설명문</label>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => updateServiceStep(sIdx, { description: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Management */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 mt-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#30308A]" />
                    자주 묻는 질문(FAQ) 관리
                  </h3>
                  <button
                    onClick={() => {
                      addFaq({ category: '새 카테고리', question: '새로운 질문', answer: '답변을 입력하세요.' });
                    }}
                    className="px-3 py-1.5 bg-[#30308A] hover:bg-[#25256e] text-white rounded text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    FAQ 추가
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ 섹션 메인 타이틀</label>
                    <input
                      type="text"
                      value={siteConfig.faqTitle || '자주 묻는 질문 (FAQ)'}
                      onChange={(e) => updateSiteConfig({ faqTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ 섹션 서브 설명문</label>
                    <textarea
                      rows={2}
                      value={siteConfig.faqSubtitle || 'VIP 고객님들께서 가장 자주 문의하시는 내용을 정리했습니다.'}
                      onChange={(e) => updateSiteConfig({ faqSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={faq.category}
                          onChange={(e) => updateFaq(faq.id, { category: e.target.value })}
                          className="px-2 py-1 text-xs border border-slate-300 rounded text-[#30308A] font-bold w-32"
                          placeholder="카테고리"
                        />
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                          placeholder="질문을 입력하세요"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg resize-y"
                          placeholder="답변을 입력하세요"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Community & Notices CMS */}
          {activeTab === 'posts' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Header Editor */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-[#30308A]" />
                  커뮤니티 메인 타이틀 관리
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">커뮤니티 섹션 메인 타이틀</label>
                    <input
                      type="text"
                      value={siteConfig.communityTitle || '오아시스 공식 커뮤니티 & VIP 소식'}
                      onChange={(e) => updateSiteConfig({ communityTitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">커뮤니티 섹션 서브 설명문</label>
                    <textarea
                      rows={2}
                      value={siteConfig.communitySubtitle || '최신 카지노 프로모션, 특급 호텔 이벤트, 마닐라/클락 VIP 여행 팁 및 공식 공지사항을 확인하세요.'}
                      onChange={(e) => updateSiteConfig({ communitySubtitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-y"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    커뮤니티 및 공지사항 CMS 관리
                  </h3>
                  <p className="text-xs text-slate-500">
                    운영자 전용 게시판 글 작성, 상단 고정 및 수정/삭제
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAdminOpen(false);
                    openPostEditor(null);
                  }}
                  className="px-4 py-2 bg-[#30308A] hover:bg-[#25256e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 글 작성하기</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                      <th className="p-3.5 font-bold">구분</th>
                      <th className="p-3.5 font-bold">제목</th>
                      <th className="p-3.5 font-bold hidden sm:table-cell">작성자</th>
                      <th className="p-3.5 font-bold hidden sm:table-cell">조회수</th>
                      <th className="p-3.5 font-bold hidden md:table-cell">날짜</th>
                      <th className="p-3.5 font-bold text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
                              고정
                            </span>
                          )}
                          {(post.mapLocation || post.content.includes('[지도') || post.content.includes('[구글지도') || post.content.includes('[map:')) && (
                            <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#30308A] border border-blue-200/60" title="구글 지도 포함">
                              <MapPin className="w-2.5 h-2.5 text-[#E5B54F]" />
                              지도
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 max-w-md truncate">
                          {post.title}
                        </td>
                        <td className="p-3.5 text-slate-500 hidden sm:table-cell">
                          {post.author}
                        </td>
                        <td className="p-3.5 text-slate-600 hidden sm:table-cell font-mono">
                          {(post.viewCount || 0).toLocaleString()}회
                        </td>
                        <td className="p-3.5 text-slate-500 hidden md:table-cell">
                          {post.date}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => {
                              setIsAdminOpen(false);
                              openPostEditor(post);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: '게시글 영구 삭제',
                                message: `'${post.title}' 게시글을 삭제하시겠습니까? 삭제 후에는 목록과 상세 화면에서 즉시 영구 삭제됩니다.`,
                                confirmText: '게시글 삭제',
                                confirmColor: 'bg-red-600 hover:bg-red-700',
                                onConfirm: () => {
                                  deletePost(post.id);
                                  showToast('게시글이 영구 삭제되었습니다.');
                                },
                              });
                            }}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Inquiry Leads Inbox */}
          {activeTab === 'leads' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    실시간 1:1 VIP 상담 신청 접수함
                  </h3>
                  <p className="text-xs text-slate-500">
                    웹사이트 방문 고객들이 접수한 VIP 예약 및 상담 신청 목록입니다.
                  </p>
                </div>
              </div>

              {inquiryLeads.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  접수된 상담 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiryLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{lead.name}</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {lead.contactType === 'telegram' ? '텔레그램' : lead.contactType === 'kakao' ? '카카오톡' : '전화'} : <strong>{lead.contactValue}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{lead.createdAt}</span>
                          <select
                            value={lead.status}
                            onChange={(e) => updateInquiryStatus(lead.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              lead.status === '상담완료'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : lead.status === '상담진행중'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-red-50 text-red-700 border-red-300'
                            }`}
                          >
                            <option value="접수대기">접수대기</option>
                            <option value="상담진행중">상담진행중</option>
                            <option value="상담완료">상담완료</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: '상담 내역 삭제',
                                message: '이 상담 접수 내역을 삭제하시겠습니까?',
                                confirmText: '삭제',
                                confirmColor: 'bg-red-600 hover:bg-red-700',
                                onConfirm: () => {
                                  deleteInquiry(lead.id);
                                  showToast('상담 내역이 삭제되었습니다.');
                                },
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400">희망 지역: </span>
                          <strong className="text-slate-800">{lead.targetRegion}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">예상 일정: </span>
                          <strong className="text-slate-800">{lead.expectedDate || '미정'}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                        {lead.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Backup / Restore / Reset */}
          {activeTab === 'backup' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <RotateCcw className="w-4 h-4 text-[#30308A]" />
                  데이터 백업, 가져오기 및 초기화
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  모든 사이트 설정, 카지노 목록, 공지사항 게시글, 상담 신청 내역을 JSON 파일로 안전하게 백업하거나 다른 기기에서 복원할 수 있습니다.
                </p>

                {/* Permanent Source Code Sync Box */}
                <div className="p-4 rounded-xl bg-amber-50/80 border-2 border-amber-200/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        현재 모든 수정한 내용을 소스코드 파일(ZIP/Netlify)에 영구 고정하기
                      </span>
                      <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
                        아래 <strong>[설정 텍스트 복사]</strong> 버튼을 누른 뒤, AI 채팅창에 그대로 붙여넣어 주시면 
                        제가 소스코드 파일(<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">initialData.ts</code>)에 영구 고정해 드립니다. 
                        이렇게 하면 ZIP 다운로드나 Netlify 배포 시에도 수정한 내용이 100% 동일하게 유지됩니다.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const jsonStr = getExportJSONString();
                        navigator.clipboard.writeText(jsonStr).then(() => {
                          showToast('클립보드에 복사되었습니다! 채팅창에 붙여넣어 주세요.');
                        }).catch(() => {
                          showToast('텍스트 영역의 내용을 복사해 주세요.');
                        });
                      }}
                      className="px-3.5 py-2 bg-[#30308A] hover:bg-[#202060] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      설정 텍스트 복사
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 mb-1">
                      설정 데이터 텍스트 (직접 복사 가능)
                    </label>
                    <textarea
                      readOnly
                      value={getExportJSONString()}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      className="w-full h-24 p-2 text-[10px] font-mono bg-white border border-amber-200 rounded-lg text-slate-700 select-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">설정 데이터 백업 (Export JSON)</span>
                    <p className="text-[11px] text-slate-500">
                      현재 모든 커스터마이징 데이터를 파일로 다운로드합니다.
                    </p>
                    <button
                      onClick={exportDataJSON}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      백업 파일 다운로드 (.json)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">백업 파일 복원 (Import JSON)</span>
                    <p className="text-[11px] text-slate-500">
                      이전에 저장한 백업 파일을 업로드하여 데이터를 복원합니다.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>파일 선택 및 복원</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-red-900 block">초기 공장 기본값 리셋</span>
                      <p className="text-[11px] text-red-700">
                        모든 설정을 '오아시스 공식 에이전트' 초기 샘플 데이터로 복원합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: '전체 데이터 초기화',
                          message: '모든 설정과 데이터가 초기 공장 샘플 상태로 리셋됩니다. 계속하시겠습니까?',
                          confirmText: '초기화 실행',
                          confirmColor: 'bg-red-600 hover:bg-red-700',
                          onConfirm: async () => {
                            await resetToDefaults();
                            showToast('초기 데이터로 리셋되었습니다.');
                          },
                        });
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      기본값으로 전체 리셋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Casino Modal */}
        {casinoModalOpen && (
          <CasinoEditorModal
            casinoToEdit={editingCasino}
            onClose={() => {
              setCasinoModalOpen(false);
              setEditingCasino(null);
              showToast('카지노 정보가 저장되었습니다.');
            }}
          />
        )}

        {/* Philippine Spot Modal */}
        {spotModalOpen && (
          <PhilippineSpotEditorModal
            isOpen={spotModalOpen}
            initialData={editingSpot}
            onClose={() => {
              setSpotModalOpen(false);
              setEditingSpot(null);
            }}
            onSave={(spotData) => {
              if ('id' in spotData && spotData.id) {
                updatePhilippineSpot(spotData.id, spotData);
                showToast('필리핀 소개 카드가 수정되었습니다.');
              } else {
                addPhilippineSpot(spotData);
                showToast('새 필리핀 소개 카드가 등록되었습니다.');
              }
            }}
          />
        )}

        {/* In-App Confirmation Modal (Works 100% reliably inside iframes with no browser popup blocks) */}
        {confirmModal && confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{confirmModal.title}</h4>
                  <p className="text-xs text-slate-500">진행하시려면 확인을 눌러주세요</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {confirmModal.message}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const action = confirmModal.onConfirm;
                    setConfirmModal(null);
                    await action();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
                    confirmModal.confirmColor || 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {confirmModal.confirmText || '확인'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
