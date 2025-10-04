"use client";

import { useNotificationStore } from "@/stores/notification.store";
import { useEffect } from "react";

export function Notification() {
  const { message, type, show, hideNotification } = useNotificationStore();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, hideNotification]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}