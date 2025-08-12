"use client";

import { useAlertStore } from "@/stores/alert.store";
import { useEffect } from "react";

export function GlobalAlert() {
  const { message, isVisible, type, hideAlert } = useAlertStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideAlert]);

  const bgColor = type
    ? {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
      }[type]
    : "bg-gray-500";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 ${bgColor} text-black font-bold p-4 text-center z-50 transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {message}
    </div>
  );
}
