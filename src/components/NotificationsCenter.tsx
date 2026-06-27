import React from 'react';
import { SystemNotification } from '../types';
import { 
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, 
  X, Check, Trash2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation } from '../utils/translations';

interface NotificationsCenterProps {
  notifications: SystemNotification[];
  onMarkAsRead: (id?: string) => void;
  onClose: () => void;
  selectedLanguage: string;
}

export default function NotificationsCenter({ notifications, onMarkAsRead, onClose, selectedLanguage }: NotificationsCenterProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white/95 dark:bg-slate-900/95 border-l border-white/20 dark:border-white/10 shadow-2xl z-50 backdrop-blur-xl flex flex-col font-sans">
      
      {/* Header element */}
      <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell className="h-5 w-5 text-indigo-500 animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("In Progress")}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("Manage fleet orders, live monitoring tracking system.")}</p>
          </div>
        </div>

        <button 
          id="close-notifications-btn"
          onClick={onClose}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Toolbar actions */}
      {unreadCount > 0 && (
        <div className="px-6 py-3 bg-indigo-50/20 dark:bg-indigo-950/20 border-b border-indigo-500/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-indigo-600 dark:text-indigo-400">{unreadCount} {t("Trips").toLowerCase()} {t("In Progress").toLowerCase()}</span>
          <button 
            id="mark-all-read-btn"
            onClick={() => onMarkAsRead()}
            className="text-slate-500 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" /> {t("Approved")}
          </button>
        </div>
      )}

      {/* Notifications scroll list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {notifications.map((n) => {
            // Icon selection
            let AlertIcon = Info;
            let iconColor = 'text-sky-500 bg-sky-500/10 border-sky-500/20';

            if (n.type === 'danger') {
              AlertIcon = AlertTriangle;
              iconColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            } else if (n.type === 'warning') {
              AlertIcon = ShieldAlert;
              iconColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            } else if (n.type === 'success') {
              AlertIcon = CheckCircle2;
              iconColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            }

            return (
              <motion.div
                id={`notification-item-${n.id}`}
                key={n.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                  !n.read 
                    ? 'border-indigo-505/30 bg-indigo-500/5 dark:bg-indigo-950/10' 
                    : 'border-slate-200/60 dark:border-white/5 bg-transparent opacity-80'
                }`}
              >
                {/* Alert Icon */}
                <div className={`p-2.5 rounded-2xl border ${iconColor} shrink-0`}>
                  <AlertIcon className="h-4.5 w-4.5" />
                </div>

                {/* Body details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-805 dark:text-white capitalize leading-tight truncate">
                      {n.title}
                    </h4>
                    <span className="text-[9px] font-mono font-medium text-slate-400 shrink-0">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal">
                    {n.message}
                  </p>
                  
                  {/* Mark as read link */}
                  {!n.read && (
                    <button 
                      id={`mark-read-btn-${n.id}`}
                      className="text-[10px] font-mono font-bold text-indigo-505 flex items-center gap-0.5 pt-0.5 hover:underline cursor-pointer"
                    >
                      <Check className="h-3 w-3" /> {t("Approved")}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Bell className="h-8 w-8 mx-auto stroke-1" />
            <p className="text-xs font-semibold">{t("No active dispatches available")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
