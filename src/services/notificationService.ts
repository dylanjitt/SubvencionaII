import { v4 as uuidv4 } from "uuid";

import jsonServerInstance from "../api/jsonServerInstance";
import type { Notification } from "../interface/notificationInterface";
import type { SendNotificationRequest, SendNotificationsRequest } from "./models/notificationModels"
import type { User } from "../interface/userInterface";

const NOTIFICATIONS_URL = "notifications";

export const getNotificationsByUserID = async (userId: string): Promise<Notification[]> => {
  try {
    const notificationsResponse = await jsonServerInstance.get(NOTIFICATIONS_URL, { params: { userId: userId } })
    return notificationsResponse.data as Notification[]
  }
  catch (error) {
    console.error("Error Fetching notifications: ", error)
    throw error
  }
};

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const notificationsResponse = await jsonServerInstance.patch(`${NOTIFICATIONS_URL}/${notificationId}`, { read: true })
    return notificationsResponse.data as Notification
  }
  catch (error) {
    console.error("Error Fetching notifications: ", error)
    throw error
  }
};

export const archiveNotification = async (notificationId: string): Promise<Notification> => {
  try {
    const notificationsResponse = await jsonServerInstance.delete(`${NOTIFICATIONS_URL}/${notificationId}`)
    return notificationsResponse.data as Notification
  }
  catch (error) {
    console.error("Error Updating notifications: ", error)
    throw error
  }
};

export const sendNotifications = async ({ gasStationId, gasStationName, message, type }: SendNotificationsRequest) => {
  try {
    const usersResponse = await jsonServerInstance.get('users', { params: { role: "client" } })
    const usersIds = usersResponse.data
    usersIds.forEach(async (user: User) => {
      const notification: Notification = {
        id: uuidv4(),
        userId: user.id,
        gasStationId: gasStationId,
        gasStationName: gasStationName,
        message: message,
        type: type,
        read: false
      }
      await jsonServerInstance.post(NOTIFICATIONS_URL, notification)
    });
  } catch (error) {
    console.error("Error Creating notifications: ", error)
    throw error
  }
};

export const sendNotification = async ({ userId, gasStationId, gasStationName, message, type }: SendNotificationRequest): Promise<Notification> => {
  try {
    const notification: Notification = {
      id: uuidv4(),
      userId: userId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: message,
      type: type,
      read: false
    }
    const notificationResponse = await jsonServerInstance.post(NOTIFICATIONS_URL, notification)
    return notificationResponse.data as Notification
  }
  catch (error) {
    console.error("Error Creating a notifications ", error)
    throw error
  }
};