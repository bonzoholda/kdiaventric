import React, { useState } from 'react';
import { 
  Wallet, 
  Globe, 
  Bell, 
  Trash2, 
  CheckCircle2, 
  ChevronDown, 
  Award, 
  Menu, 
  X, 
  LayoutDashboard, 
  Landmark, 
  Layers, 
  Users, 
  Sliders, 
  Shield,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useDisconnect } from 'wagmi';
import { Language, WalletState, AppNotification } from '../types';
// import { TokenPocketButton } from './TokenPocketButton';
import { translations } from '../translations';


interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  wallet: WalletState;
  notifications: AppNotification[];
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  wallet,
  notifications,
  clearNotifications,
  removeNotification,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.length;

  const navItems = [
    {
      id: 'overview',
      labelEn: 'Overview & Vesting',
      labelId: 'Ikhtisar & Vesting',
      icon: LayoutDashboard,
    },
    {
      id: 'treasury',
      labelEn: 'Treasury Analytics',
      labelId: 'Analisis Treasury',
      icon: Landmark,
    },
    {
      id: 'deposit-matrix',
      labelEn: 'Deposit & Matrix Queue',
      labelId: 'Deposit & Antrean Matriks',
      icon: Layers,
    },
    {
      id: 'referral',
      labelEn: 'Affiliate Hub',
      labelId: 'Hub Afiliasi',
      icon: Users,
    },
    {
      id: 'simulation',
      labelEn: 'Simulation Controls',
      labelId: 'Kontrol Simulasi',
      icon: Sliders,
    },
    {
      id: 'smart-contract-ref',
      labelEn: 'Contract Reference',
      labelId: 'Referensi Kontrak',
      icon: Shield,
    },
    {
      id: 'mining-hub',
      labelEn: 'KardiaToken Mining Hub',
      labelId: 'KardiaToken Mining Hub',
      icon: Cpu,
      externalUrl: 'https://icykardia.netlify.app',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rose-900/50 bg-[#2b0000] bg-gradient-to-b from-[#4a0000] via-[#2b0000] to-[#0a0505] backdrop-blur-xl shadow-[0_4px_30px_rgba(150,0,0,0.4)] w-full">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 xs:px-3 sm:px-6 lg:px-8 py-2 relative overflow-visible">
        
        {/* Left Side: Logo (Sleek, Left-Aligned, Compact) */}
        <div className="flex items-center min-w-0 shrink-0 mr-1 sm:mr-4">
          <img 
            src="/kdiaventric_logo.png" 
            alt="KDIA VENTRIC Logo" 
            className="w-auto h-[18px] xs:h-[22px] sm:h-[32px] md:h-[38px] object-contain transition-all duration-300 py-0.5" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-container');
              if (fallback) fallback.classList.remove('hidden');
            }} 
          />
          {/* Fallback container if kdiaventric_logo.png fails to load */}
          <div className="fallback-container hidden flex flex-col items-start justify-center">
            <div className="flex items-center space-x-1.5">
              <span className="font-sans text-[11px] sm:text-base font-black tracking-tight text-white leading-none">
                {t.brandName}
              </span>
              <span className="rounded bg-rose-500/10 px-1 py-0.5 text-[7px] sm:text-[8px] font-semibold text-rose-400 leading-none">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Controls (Elegant, Compact, Single-line, No Wrapping) */}
        <div className="flex items-center space-x-0.5 xs:space-x-1 sm:space-x-1.5 flex-nowrap min-w-0 shrink overflow-visible justify-end">
          
          {/* Navigation Burger Menu */}
          <div className="sm:relative shrink-0">
            <button
              onClick={() => {
                setShowNavMenu(!showNavMenu);
                setShowNotifDropdown(false);
                setShowWalletDropdown(false);
              }}
              className="neu-btn flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-cyan-400 hover:text-cyan-300 border-none transition-all"
              id="nav-burger-btn"
              title="Navigation Menu"
            >
              {showNavMenu ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            {showNavMenu && (
              <div className="absolute right-2 xs:right-3 sm:right-0 mt-2 w-[calc(100vw-16px)] xs:w-[calc(100vw-24px)] sm:w-60 max-w-[240px] rounded-md border border-slate-800 bg-[#12151b] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 backdrop-blur-lg">
                <div className="px-3 py-2 border-b border-slate-800/60 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-extrabold block">
                    {language === 'en' ? 'Navigation Menu' : 'Menu Navigasi'}
                  </span>
                </div>
                <div className="space-y-1">
                  {navItems.filter(item => item.id !== 'simulation').map((item) => {
                    const Icon = item.icon;
                    const isExternal = !!item.externalUrl;
                    return (
                      <a
                        key={item.id}
                        href={item.externalUrl || `#${item.id}`}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => setShowNavMenu(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded text-xs font-bold transition-all font-mono ${
                          isExternal 
                            ? 'text-cyan-400 hover:text-cyan-300 hover:bg-[#161921]/60' 
                            : 'text-slate-300 hover:text-cyan-300 hover:bg-[#161921]/60'
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isExternal ? 'text-cyan-400 animate-pulse' : 'text-cyan-400'}`} />
                        <span>{language === 'en' ? item.labelEn : item.labelId}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bilingual Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="neu-btn flex h-7 sm:h-9 items-center justify-center space-x-0.5 xs:space-x-1 px-1 sm:px-2 text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 border-none shrink-0"
            id="lang-toggle-btn"
          >
            <Globe className="hidden xs:block h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" />
            <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs">{t.bilingualToggle}</span>
          </button>

          {/* Notifications Center */}
          <div className="sm:relative shrink-0">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowWalletDropdown(false);
                setShowNavMenu(false);
              }}
              className="neu-btn relative flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-cyan-400 hover:text-cyan-300 border-none"
              id="notif-bell-btn"
            >
              <Bell className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5 items-center justify-center rounded-full bg-cyan-500 text-[7px] sm:text-[8px] font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-2 xs:right-3 sm:right-0 mt-2 w-[calc(100vw-16px)] xs:w-[calc(100vw-24px)] sm:w-96 max-w-sm neu-card p-4 shadow-2xl backdrop-blur-lg border-none z-50">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                    <span>{t.realTimeNotifications}</span>
                    <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
                      {notifications.length}
                    </span>
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{t.clearAll}</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      {t.noNotifications}
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div
                        key={`${notif.id}-${idx}`}
                        className="relative flex items-start space-x-2.5 neu-card-inset p-2.5 transition-all border-none"
                      >
                        <div className="mt-0.5 border-none">
                          {notif.type === 'success' || notif.type === 'matrix' || notif.type === 'referral' ? (
                            <CheckCircle2 className="h-4 w-4 text-rose-400" />
                          ) : (
                            <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-100">
                            {language === 'en' ? notif.titleEn : notif.titleId}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                            {language === 'en' ? notif.messageEn : notif.messageId}
                          </p>
                          <span className="mt-1 block font-mono text-[9px] text-slate-600">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={() => removeNotification(notif.id)}
                          className="text-slate-600 hover:text-slate-400 text-xs"
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Web3 Wallet Connection Selector (Hide balance for high density) */}
          <div className="flex items-center gap-2 justify-end shrink-0 overflow-visible">
            {/* @ts-ignore */}
            <w3m-button balance="hide" size="sm" />
          </div>

        </div>

      </div>
    </header>
  );
};
