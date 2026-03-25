import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
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
      ],
      
      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          isRead: false,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => 
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
