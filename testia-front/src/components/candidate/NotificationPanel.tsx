import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '../../stores/notificationStore';
import { 
  BellIcon, 
  CheckIcon, 
  XIcon, 
  FileTextIcon,
  ClockIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  const handleNotificationClick = (notificationId: string, testId?: string) => {
    markAsRead(notificationId);
    if (testId) {
      navigate(`/candidate/test/${testId}`);
      onClose();
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <BellIcon className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-alt font-bold text-foreground">Notificaciones</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} sin leer
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-transparent text-foreground hover:bg-muted"
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="px-6 py-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <CheckIcon className="w-4 h-4" />
                Marcar todas como leídas
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <BellIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-alt font-semibold text-foreground mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-sm text-muted-foreground">
                  Te notificaremos cuando tengas nuevas pruebas asignadas
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                        !notification.read
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-card border-border'
                      }`}
                      onClick={() => handleNotificationClick(notification.id, notification.testId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'test_invitation'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <FileTextIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          {notification.testTitle && (
                            <Badge variant="outline" className="bg-background text-xs mb-2">
                              {notification.testTitle}
                            </Badge>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ClockIcon className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(notification.createdAt, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
