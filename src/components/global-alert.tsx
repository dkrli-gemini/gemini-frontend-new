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

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }[type];

  return (
    <div
      className={`fixed top-0 left-0 right-0 ${bgColor} text-black font-bold p-4 text-center z-50`}
    >
      {message}
    </div>
  );
}
