import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Radio, CheckCircle2, X, ArrowRight } from 'lucide-react';

export interface PushNotificationData {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'sos' | 'escalated' | 'safe' | 'info';
  timestamp?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface PushNotificationToastProps {
  notification: PushNotificationData | null;
  onDismiss: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      // Auto dismiss for non-critical alerts after 8 seconds
      if (notification.type === 'safe' || notification.type === 'info') {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }, 6000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification || !visible) return null;

  const getBorderAndBg = () => {
    switch (notification.type) {
      case 'critical':
      case 'sos':
        return 'bg-slate-900 border-red-500 text-white shadow-red-500/20';
      case 'escalated':
        return 'bg-red-950 border-red-400 text-white shadow-red-600/30';
      case 'safe':
        return 'bg-slate-900 border-emerald-500 text-white shadow-emerald-500/20';
      default:
        return 'bg-slate-900 border-amber-500 text-white shadow-amber-500/20';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'critical':
      case 'sos':
        return <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'escalated':
        return <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />;
      case 'safe':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Radio className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md animate-in slide-in-from-top-4 duration-300">
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all ${getBorderAndBg()}`}
      >
        <div className="p-2 rounded-xl bg-white/10 shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <span>ECO-SHIELD PUSH</span>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <span>{notification.timestamp || 'Just now'}</span>
            </span>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onDismiss, 200);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-xs sm:text-sm font-extrabold tracking-tight mt-0.5 truncate">
            {notification.title}
          </h4>

          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          {notification.actionLabel && notification.onAction && (
            <button
              onClick={() => {
                notification.onAction?.();
                setVisible(false);
                setTimeout(onDismiss, 200);
              }}
              className="mt-2 text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>{notification.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
