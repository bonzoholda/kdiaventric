import React, { useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Language, AppNotification } from '../types';

interface NotificationToastProps {
  language: Language;
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

interface ToastItemProps {
  language: Language;
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ language, notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 15000); // Auto-close after 15 seconds

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  let icon = <CheckCircle className="h-5 w-5 text-rose-400" />;
  let borderClass = 'border-rose-500/30';
  let bgClass = 'bg-slate-900/95';
  let progressColor = 'bg-rose-500';
  let progressBg = 'bg-rose-500/10';

  if (notification.type === 'warning') {
    icon = <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />;
    borderClass = 'border-rose-500/40';
    progressColor = 'bg-rose-500';
    progressBg = 'bg-rose-500/10';
  } else if (notification.type === 'info') {
    icon = <Info className="h-5 w-5 text-slate-300" />;
    borderClass = 'border-slate-800/30';
    progressColor = 'bg-slate-400';
    progressBg = 'bg-slate-400/10';
  }

  return (
    <div
      className={`flex items-start justify-between rounded-xl border p-4 shadow-2xl backdrop-blur-md relative overflow-hidden ${borderClass} ${bgClass}`}
      style={{
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div className="flex items-start space-x-3 mb-1">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white">
            {language === 'en' ? notification.titleEn : notification.titleId}
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
            {language === 'en' ? notification.messageEn : notification.messageId}
          </p>
          <span className="mt-1.5 block font-mono text-[9px] text-slate-500">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDismiss(notification.id)}
        className="ml-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer relative z-10"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Shrinking progress bar */}
      <div className={`absolute bottom-0 left-0 w-full h-[3px] ${progressBg}`}>
        <div
          className={`h-full ${progressColor}`}
          style={{
            animation: 'shrinkProgress 15s linear forwards'
          }}
        />
      </div>
    </div>
  );
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  language,
  notifications,
  onDismiss,
}) => {
  // Show max 3 floating at once
  const freshNotifications = notifications.slice(0, 3);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      {freshNotifications.map((notif, idx) => (
        <ToastItem
          key={`${notif.id}-${idx}`}
          language={language}
          notification={notif}
          onDismiss={onDismiss}
        />
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes shrinkProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
