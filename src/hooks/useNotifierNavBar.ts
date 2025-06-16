import { useSnackbar, type VariantType } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifierStore } from "../store/useNotifierStore";
import { useAuthStore } from "../store/authStore";
import type { Notification } from "../interface/notificationInterface";

export const useNotifierNavBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { logoutUser, user } = useAuthStore((state) => state);
  const { notifications, nonReadedNotifications, isLoading, fetchNotifications, markNotificationAsReaded, archiveNotification } = useNotifierStore((state) => state)

  const navigate = useNavigate();

  const [anchorNotif, setAnchorNotif] = useState<HTMLButtonElement | null>(null);
  const [anchorUser, setAnchorUser] = useState<HTMLButtonElement | null>(null);

  const handleNotifClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (nonReadedNotifications.length === 0) {
      fetchNotifications(user.id);
    }
    setAnchorNotif(event.currentTarget as unknown as HTMLButtonElement | null);
  };
  const handleUserClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorUser(event.currentTarget as unknown as HTMLButtonElement | null);
  };
  const handleNotifClose = () => {
    setAnchorNotif(null);
    markEverythingsAsReaded()
  }

  const handleUserClose = () => {
    setAnchorUser(null);
  };

  const logOut = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };
  const goToReports=()=>{
    navigate('/admin/reports')
  }
  const navigateHome = () => navigate('/dashboard');

  useEffect(() => {
    fetchNotifications(user.id)
    console.log("notificaciones", notifications)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      nonReadedNotifications.slice(0, 5).forEach((notification) => {
        enqueueAlert(notification);
      });
    }
  }, [isLoading]);


  const getAlertTypeByNotificationType = (type: string) => {
    const icons: Record<string, VariantType> = {
      New: "info",
      Confirm: "info",
      Confirmed: "success",
      Cancel: "error",
      Next: "info",
      Finished: "success",
      Stock: "warning"
    };

    return icons[type] || "default";
  }

  const enqueueAlert = (notification: Notification) => {
    enqueueSnackbar(notification.message, { variant: getAlertTypeByNotificationType(notification.type) });
  }

  const markEverythingsAsReaded = async () => {
    nonReadedNotifications.forEach((notification: Notification) => {
      markNotificationAsReaded(notification.id)
    })
  }

  return { user, notifications, nonReadedNotifications, anchorNotif, anchorUser, handleNotifClick, handleNotifClose, handleUserClick, handleUserClose, logOut, navigateHome, archiveNotification,goToReports }
}