"use client";

import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  header,
  footer,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center absolute">
      <div className="bg-white rounded-lg shadow-lg flex flex-col w-120 max-w-6xl ">
        <div className="p-4 border-b flex justify-between items-center bg-[#F2F2F2] rounded-t-lg">
          <div>{header}</div>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="p-5 px-6 border-t  grid grid-cols-4 space-x-2 bg-[#F2F2F2] rounded-b-lg justify-between">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
