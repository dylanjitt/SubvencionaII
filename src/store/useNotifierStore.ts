import { create } from "zustand";

import type { Notification } from "../interface/notificationInterface"
import { getNotificationsByUserID, archiveNotification, markAsRead } from "../services/notificationService"

interface notifierStoreInterface {
  notifications: Notification[];
  nonReadedNotifications: Notification[];
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (userId: string) => void;
  markNotificationAsReaded: (notificationId: string) => void;
  archiveNotification: (notificationId: string) => void;
}


export const useNotifierStore = create<notifierStoreInterface>()(
  (set) => ({
    notifications: [],
    nonReadedNotifications: [],
    isLoading: false,
    error: null,

    fetchNotifications: async (userId: string) => {
      try {
        set({ isLoading: true });
        const response = await getNotificationsByUserID(userId);
        if (!response) {
          throw new Error("Error buscando notificaciones");
        }
        const notRead = response.filter((notification: Notification) => !notification.read);
        set({ notifications: response.reverse(), nonReadedNotifications: notRead.reverse() })

      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          set({ error: error.message });
        }
      } finally {
        set({ isLoading: false });
      }
    },
    markNotificationAsReaded: async (notificationId: string) => {
      try {
        const response = await markAsRead(notificationId);
        if (!response) {
          throw new Error("Error marcando como leido");
        }
        set((state) => ({
          notifications: state.notifications.map((notification: Notification) =>
            notification.id === notification.id ? response : notification),
          nonReadedNotifications: state.nonReadedNotifications.filter((notification: Notification) =>
            notification.id !== response.id)
        }))
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          set({ error: error.message });
        }
      }
    },
    archiveNotification: async (notificationId: string) => {
      try {
        await archiveNotification(notificationId);
        set((state) => ({
          notifications: state.notifications.filter((notification: Notification) =>
            notification.id !== notificationId),
          nonReadedNotifications: state.nonReadedNotifications.filter((notification: Notification) =>
            notification.id !== notificationId)
        }))
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          set({ error: error.message });
        }
      }
    }
  })
);