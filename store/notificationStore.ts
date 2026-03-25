import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'wash' | 'weather' | 'recommendation';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  isRead: boolean;
}

const STORAGE_KEY = '@fitcast_notifications';

interface NotificationState {
  notifications: Notification[];
  isLoaded: boolean;
  loadNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'wash',
    title: '세탁 알림',
    message: '흰색 면 티셔츠를 입은 지 3일이 지났어요. 세탁이 필요할 것 같습니다!',
    time: '2시간 전',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    isRead: false,
  },
  {
    id: '2',
    type: 'weather',
    title: '날씨 알림',
    message: '오늘 오후에 비 예보가 있어요. 우산을 챙기시고 젖어도 되는 신발을 추천드려요.',
    time: '5시간 전',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    isRead: true,
  },
];

const saveToStorage = async (notifications: Notification[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: DEFAULT_NOTIFICATIONS,
  isLoaded: false,

  loadNotifications: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        set({ notifications: JSON.parse(saved), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
      set({ isLoaded: true });
    }
  },

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      isRead: false,
    };
    const updated = [newNotif, ...get().notifications];
    set({ notifications: updated });
    saveToStorage(updated);
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    set({ notifications: updated });
    saveToStorage(updated);
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
    set({ notifications: updated });
    saveToStorage(updated);
  },

  clearNotifications: () => {
    set({ notifications: [] });
    saveToStorage([]);
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },
}));
